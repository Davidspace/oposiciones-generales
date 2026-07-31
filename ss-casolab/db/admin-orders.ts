import type {
  AdminActor,
  AdminExpectedPaymentStatus,
  AdminPaymentDecision,
} from "../lib/admin-orders.ts";
import type { PaymentStatus } from "../lib/order-state.ts";
import type { D1DatabaseLike } from "./orders.ts";

export type AdminOrderView = {
  reference: string;
  amountCents: number;
  currency: "EUR";
  status: PaymentStatus;
  expiresAt: string;
};

export type VerifyAdminPaymentInput = {
  verificationId: string;
  eventId: string;
  reference: string;
  expectedStatus: AdminExpectedPaymentStatus;
  decision: AdminPaymentDecision;
  targetStatus: "paid" | "needs_review";
  observedAmountCents: number;
  observedAt: string;
  providerReferenceHmac: string | null;
  providerReferenceHmacVersion: string | null;
  reasonCode: string;
  actor: AdminActor;
  idempotencyKey: string;
  requestFingerprint: string;
  verifiedAt: string;
};

export type VerifyAdminPaymentResult =
  | {
      kind: "verified" | "replayed";
      verificationResult: AdminPaymentDecision;
      order: AdminOrderView;
    }
  | { kind: "not_found" }
  | { kind: "invalid_state"; currentStatus: PaymentStatus | null }
  | { kind: "amount_mismatch" }
  | { kind: "late_payment_requires_review" }
  | { kind: "provider_reference_conflict" }
  | { kind: "idempotency_conflict" };

export type AdminOrderStore = {
  verifyPayment(
    input: VerifyAdminPaymentInput,
  ): Promise<VerifyAdminPaymentResult>;
};

type AdminOrderRow = {
  id: string;
  reference: string;
  amount_cents: number;
  currency: "EUR";
  status: PaymentStatus;
  expires_at: string;
};

type ExistingVerificationRow = AdminOrderRow & {
  result: AdminPaymentDecision;
  request_fingerprint: string;
  verified_by: AdminActor;
};

function toAdminOrder(row: AdminOrderRow): AdminOrderView {
  return {
    reference: row.reference,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    expiresAt: row.expires_at,
  };
}

function eventIdempotencyKey(key: string) {
  return `order-event:verify:${key}`;
}

function replayResult(
  row: ExistingVerificationRow,
): VerifyAdminPaymentResult {
  return {
    kind: "replayed",
    verificationResult: row.result,
    order: toAdminOrder(row),
  };
}

export function createD1AdminOrderStore(
  d1: D1DatabaseLike,
): AdminOrderStore {
  async function findOrder(
    reference: string,
  ): Promise<AdminOrderRow | null> {
    return d1
      .prepare(
        `SELECT id, reference, amount_cents, currency, status, expires_at
         FROM orders WHERE reference = ? LIMIT 1`,
      )
      .bind(reference)
      .first<AdminOrderRow>();
  }

  async function findVerificationBy(
    column: "idempotency_key" | "request_fingerprint",
    value: string,
  ): Promise<ExistingVerificationRow | null> {
    return d1
      .prepare(
        `SELECT
          o.id, o.reference, o.amount_cents, o.currency, o.status, o.expires_at,
          v.result, v.request_fingerprint, v.verified_by
        FROM payment_verifications v
        JOIN orders o ON o.id = v.order_id
        WHERE v.${column} = ?
        LIMIT 1`,
      )
      .bind(value)
      .first<ExistingVerificationRow>();
  }

  async function findReplay(
    input: VerifyAdminPaymentInput,
  ): Promise<VerifyAdminPaymentResult | null> {
    const byKey = await findVerificationBy(
      "idempotency_key",
      input.idempotencyKey,
    );
    if (byKey) {
      if (
        byKey.reference !== input.reference ||
        byKey.request_fingerprint !== input.requestFingerprint ||
        byKey.verified_by !== input.actor
      ) {
        return { kind: "idempotency_conflict" };
      }
      return replayResult(byKey);
    }

    const byFingerprint = await findVerificationBy(
      "request_fingerprint",
      input.requestFingerprint,
    );
    if (!byFingerprint) return null;
    return byFingerprint.reference === input.reference
      ? replayResult(byFingerprint)
      : { kind: "idempotency_conflict" };
  }

  async function providerReferenceUsed(
    providerReferenceHmac: string | null,
  ): Promise<boolean> {
    if (!providerReferenceHmac) return false;
    const row = await d1
      .prepare(
        `SELECT order_id FROM payment_verifications
         WHERE provider_reference_hmac = ? AND result = 'matched'
         LIMIT 1`,
      )
      .bind(providerReferenceHmac)
      .first<{ order_id: string }>();
    return row !== null;
  }

  return {
    async verifyPayment(input) {
      const replay = await findReplay(input);
      if (replay) return replay;

      const order = await findOrder(input.reference);
      if (!order) return { kind: "not_found" };
      if (order.status !== input.expectedStatus) {
        return { kind: "invalid_state", currentStatus: order.status };
      }

      const matched = input.decision === "matched";
      if (
        matched &&
        !["awaiting_payment", "payment_reported"].includes(
          input.expectedStatus,
        )
      ) {
        return { kind: "invalid_state", currentStatus: order.status };
      }
      if (matched && input.targetStatus !== "paid") {
        throw new TypeError("Una coincidencia solo puede terminar en paid.");
      }
      if (!matched && input.targetStatus !== "needs_review") {
        throw new TypeError("Una incidencia solo puede terminar en needs_review.");
      }
      if (matched && order.amount_cents !== input.observedAmountCents) {
        return { kind: "amount_mismatch" };
      }
      if (
        matched &&
        Date.parse(order.expires_at) <= Date.parse(input.verifiedAt)
      ) {
        return { kind: "late_payment_requires_review" };
      }
      if (
        matched &&
        (await providerReferenceUsed(input.providerReferenceHmac))
      ) {
        return { kind: "provider_reference_conflict" };
      }

      const conditionalMatch = matched
        ? "AND amount_cents = ? AND datetime(expires_at) > datetime(?)"
        : "";
      const insertBindings = [
        input.verificationId,
        input.providerReferenceHmac,
        input.providerReferenceHmacVersion,
        input.observedAmountCents,
        input.observedAt,
        input.decision,
        input.reasonCode,
        input.actor,
        input.verifiedAt,
        input.idempotencyKey,
        input.requestFingerprint,
        input.reference,
        input.expectedStatus,
        ...(matched ? [input.observedAmountCents, input.verifiedAt] : []),
      ];
      const eventMetadata = JSON.stringify({
        eventType:
          input.decision === "matched"
            ? "payment_verified"
            : "payment_needs_review",
        verificationResult: input.decision,
      });

      try {
        const results = await d1.batch([
          d1
            .prepare(
              `INSERT INTO payment_verifications (
                id, order_id, provider_reference_hmac,
                provider_reference_hmac_version, observed_amount_cents,
                observed_at, result, reason_code, verified_by, verified_at,
                idempotency_key, request_fingerprint
              )
              SELECT ?, id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
              FROM orders
              WHERE reference = ? AND status = ? ${conditionalMatch}`,
            )
            .bind(...insertBindings),
          d1
            .prepare(
              `UPDATE orders
               SET status = ?, updated_at = ?
               WHERE reference = ? AND status = ?
                 AND EXISTS (
                   SELECT 1 FROM payment_verifications
                   WHERE id = ? AND order_id = orders.id
                 )`,
            )
            .bind(
              input.targetStatus,
              input.verifiedAt,
              input.reference,
              input.expectedStatus,
              input.verificationId,
            ),
          d1
            .prepare(
              `INSERT INTO order_events (
                id, event_id, order_id, previous_status, next_status,
                actor_type, actor_id, reason_code, idempotency_key,
                metadata_json, created_at
              )
              SELECT ?, ?, id, ?, ?, ?, ?, ?, ?, ?, ?
              FROM orders
              WHERE reference = ? AND status = ?
                AND EXISTS (
                  SELECT 1 FROM payment_verifications
                  WHERE id = ? AND order_id = orders.id
                )`,
            )
            .bind(
              crypto.randomUUID(),
              input.eventId,
              input.expectedStatus,
              input.targetStatus,
              input.actor,
              input.actor,
              input.reasonCode,
              eventIdempotencyKey(input.idempotencyKey),
              eventMetadata,
              input.verifiedAt,
              input.reference,
              input.targetStatus,
              input.verificationId,
            ),
        ]);

        if ((results[0]?.meta?.changes ?? 0) < 1) {
          const concurrentReplay = await findReplay(input);
          if (concurrentReplay) return concurrentReplay;
          const current = await findOrder(input.reference);
          return {
            kind: "invalid_state",
            currentStatus: current?.status ?? null,
          };
        }
      } catch (error) {
        const concurrentReplay = await findReplay(input);
        if (concurrentReplay) return concurrentReplay;
        if (
          matched &&
          (await providerReferenceUsed(input.providerReferenceHmac))
        ) {
          return { kind: "provider_reference_conflict" };
        }
        throw error;
      }

      const updated = await findOrder(input.reference);
      if (!updated || updated.status !== input.targetStatus) {
        throw new Error("La conciliación no dejó un estado coherente.");
      }
      return {
        kind: "verified",
        verificationResult: input.decision,
        order: toAdminOrder(updated),
      };
    },
  };
}
