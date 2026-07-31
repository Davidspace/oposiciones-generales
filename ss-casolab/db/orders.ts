import type { PublicOrderRecord } from "../lib/public-orders.ts";

type D1ResultLike = {
  success?: boolean;
  meta?: { changes?: number };
};

export type D1StatementLike = {
  bind(...values: unknown[]): D1StatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<D1ResultLike>;
};

export type D1DatabaseLike = {
  prepare(query: string): D1StatementLike;
  batch(statements: D1StatementLike[]): Promise<D1ResultLike[]>;
};

type OrderRow = {
  id: string;
  reference: string;
  product_id: string;
  offer_version: string;
  amount_cents: number;
  currency: "EUR";
  status: PublicOrderRecord["status"];
  expires_at: string;
  created_at: string;
  updated_at: string;
};

type ExistingCreationRow = OrderRow & {
  metadata_json: string | null;
};

type ExistingReportRow = {
  order_id: string;
  idempotency_key: string;
  request_fingerprint: string;
};

export type PersistOrderInput = {
  id: string;
  reference: string;
  lookupTokenHash: string;
  createIdempotencyKey: string;
  requestFingerprint: string;
  productId: string;
  offerVersion: string;
  amountCents: number;
  currency: "EUR";
  name: string;
  email: string;
  sessionId: string | null;
  termsVersion: string;
  privacyVersion: string;
  acceptedAt: string;
  expiresAt: string;
};

export type PersistPaymentReportInput = {
  id: string;
  orderId: string;
  idempotencyKey: string;
  requestFingerprint: string;
  createdAt: string;
};

export type CreateOrderResult =
  | { kind: "created" | "replayed"; order: PublicOrderRecord }
  | { kind: "idempotency_conflict" };

export type ReportPaymentResult =
  | { kind: "reported" | "replayed"; order: PublicOrderRecord }
  | { kind: "idempotency_conflict" }
  | { kind: "invalid_state"; order: PublicOrderRecord | null };

export type PublicOrderStore = {
  create(input: PersistOrderInput): Promise<CreateOrderResult>;
  findByCredentials(
    reference: string,
    lookupTokenHash: string,
  ): Promise<PublicOrderRecord | null>;
  reportPayment(input: PersistPaymentReportInput): Promise<ReportPaymentResult>;
};

const orderColumns = `
  id, reference, product_id, offer_version, amount_cents, currency,
  status, expires_at, created_at, updated_at
`;

function toOrder(row: OrderRow): PublicOrderRecord {
  return {
    id: row.id,
    reference: row.reference,
    productId: row.product_id,
    offerVersion: row.offer_version,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parseCreationFingerprint(metadataJson: string | null): string | null {
  if (!metadataJson) return null;
  try {
    const value = JSON.parse(metadataJson) as Record<string, unknown>;
    return typeof value.requestFingerprint === "string"
      ? value.requestFingerprint
      : null;
  } catch {
    return null;
  }
}

function eventIdempotencyKey(action: "create" | "report", key: string) {
  return `order-event:${action}:${key}`;
}

export function createD1PublicOrderStore(
  d1: D1DatabaseLike,
): PublicOrderStore {
  async function findById(id: string): Promise<PublicOrderRecord | null> {
    const row = await d1
      .prepare(`SELECT ${orderColumns} FROM orders WHERE id = ? LIMIT 1`)
      .bind(id)
      .first<OrderRow>();
    return row ? toOrder(row) : null;
  }

  async function findExistingCreation(
    idempotencyKey: string,
  ): Promise<ExistingCreationRow | null> {
    return d1
      .prepare(
        `SELECT
          o.id, o.reference, o.product_id, o.offer_version, o.amount_cents,
          o.currency, o.status, o.expires_at, o.created_at, o.updated_at,
          e.metadata_json
        FROM orders o
        LEFT JOIN order_events e
          ON e.order_id = o.id AND e.idempotency_key = ?
        WHERE o.create_idempotency_key = ?
        LIMIT 1`,
      )
      .bind(
        eventIdempotencyKey("create", idempotencyKey),
        idempotencyKey,
      )
      .first<ExistingCreationRow>();
  }

  async function resolveExistingCreation(
    input: PersistOrderInput,
  ): Promise<CreateOrderResult | null> {
    const existing = await findExistingCreation(input.createIdempotencyKey);
    if (!existing) return null;
    if (
      parseCreationFingerprint(existing.metadata_json) !==
      input.requestFingerprint
    ) {
      return { kind: "idempotency_conflict" };
    }
    return { kind: "replayed", order: toOrder(existing) };
  }

  async function findExistingReport(
    input: PersistPaymentReportInput,
  ): Promise<ReportPaymentResult | null> {
    const byKey = await d1
      .prepare(
        `SELECT order_id, idempotency_key, request_fingerprint
         FROM payment_reports WHERE idempotency_key = ? LIMIT 1`,
      )
      .bind(input.idempotencyKey)
      .first<ExistingReportRow>();

    if (byKey) {
      if (
        byKey.order_id !== input.orderId ||
        byKey.request_fingerprint !== input.requestFingerprint
      ) {
        return { kind: "idempotency_conflict" };
      }
      const order = await findById(input.orderId);
      return order
        ? { kind: "replayed", order }
        : { kind: "invalid_state", order: null };
    }

    const byFingerprint = await d1
      .prepare(
        `SELECT order_id, idempotency_key, request_fingerprint
         FROM payment_reports WHERE request_fingerprint = ? LIMIT 1`,
      )
      .bind(input.requestFingerprint)
      .first<ExistingReportRow>();

    if (!byFingerprint) return null;
    if (byFingerprint.order_id !== input.orderId) {
      return { kind: "idempotency_conflict" };
    }
    const order = await findById(input.orderId);
    return order
      ? { kind: "replayed", order }
      : { kind: "invalid_state", order: null };
  }

  return {
    async create(input) {
      const replay = await resolveExistingCreation(input);
      if (replay) return replay;

      const eventId = crypto.randomUUID();
      const eventKey = eventIdempotencyKey(
        "create",
        input.createIdempotencyKey,
      );
      const metadataJson = JSON.stringify({
        eventType: "order_created",
        requestFingerprint: input.requestFingerprint,
      });

      try {
        await d1.batch([
          d1
            .prepare(
              `INSERT INTO orders (
                id, reference, lookup_token_hash, create_idempotency_key,
                product_id, offer_version, amount_cents, currency, name, email,
                session_id, status, terms_version, terms_accepted_at,
                privacy_notice_version, privacy_notice_provided_at,
                digital_start_consent_at, withdrawal_acknowledged_at,
                expires_at, created_at, updated_at
              ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'awaiting_payment', ?, ?, ?, ?, ?, ?, ?, ?, ?
              )`,
            )
            .bind(
              input.id,
              input.reference,
              input.lookupTokenHash,
              input.createIdempotencyKey,
              input.productId,
              input.offerVersion,
              input.amountCents,
              input.currency,
              input.name,
              input.email,
              input.sessionId,
              input.termsVersion,
              input.acceptedAt,
              input.privacyVersion,
              input.acceptedAt,
              input.acceptedAt,
              input.acceptedAt,
              input.expiresAt,
              input.acceptedAt,
              input.acceptedAt,
            ),
          d1
            .prepare(
              `INSERT INTO order_events (
                id, event_id, order_id, previous_status, next_status,
                actor_type, actor_id, reason_code, idempotency_key,
                metadata_json, created_at
              )
              SELECT ?, ?, id, NULL, 'awaiting_payment', 'system', NULL,
                'order_created', ?, ?, ?
              FROM orders WHERE id = ?`,
            )
            .bind(
              crypto.randomUUID(),
              eventId,
              eventKey,
              metadataJson,
              input.acceptedAt,
              input.id,
            ),
        ]);
      } catch (error) {
        const concurrentReplay = await resolveExistingCreation(input);
        if (concurrentReplay) return concurrentReplay;
        throw error;
      }

      const order = await findById(input.id);
      if (!order) {
        throw new Error("El lote de creación no persistió el pedido.");
      }
      return { kind: "created", order };
    },

    async findByCredentials(reference, lookupTokenHash) {
      const row = await d1
        .prepare(
          `SELECT ${orderColumns}
           FROM orders
           WHERE reference = ? AND lookup_token_hash = ?
           LIMIT 1`,
        )
        .bind(reference, lookupTokenHash)
        .first<OrderRow>();
      return row ? toOrder(row) : null;
    },

    async reportPayment(input) {
      const replay = await findExistingReport(input);
      if (replay) return replay;

      const eventKey = eventIdempotencyKey(
        "report",
        input.idempotencyKey,
      );
      const metadataJson = JSON.stringify({ eventType: "payment_reported" });
      const results = await d1.batch([
        d1
          .prepare(
            `INSERT INTO payment_reports (
              id, order_id, channel, whatsapp_suffix, idempotency_key,
              request_fingerprint, created_at
            )
            SELECT ?, id, 'web', NULL, ?, ?, ?
            FROM orders
            WHERE id = ?
              AND status = 'awaiting_payment'
              AND datetime(expires_at) > datetime(?)`,
          )
          .bind(
            input.id,
            input.idempotencyKey,
            input.requestFingerprint,
            input.createdAt,
            input.orderId,
            input.createdAt,
          ),
        d1
          .prepare(
            `UPDATE orders
             SET status = 'payment_reported', updated_at = ?
             WHERE id = ? AND status = 'awaiting_payment'
               AND EXISTS (
                 SELECT 1 FROM payment_reports
                 WHERE id = ? AND order_id = orders.id
               )`,
          )
          .bind(input.createdAt, input.orderId, input.id),
        d1
          .prepare(
            `INSERT INTO order_events (
              id, event_id, order_id, previous_status, next_status,
              actor_type, actor_id, reason_code, idempotency_key,
              metadata_json, created_at
            )
            SELECT ?, ?, id, 'awaiting_payment', 'payment_reported',
              'buyer', NULL, 'buyer_reported_payment', ?, ?, ?
            FROM orders
            WHERE id = ? AND status = 'payment_reported'
              AND EXISTS (
                SELECT 1 FROM payment_reports
                WHERE id = ? AND order_id = orders.id
              )`,
          )
          .bind(
            crypto.randomUUID(),
            crypto.randomUUID(),
            eventKey,
            metadataJson,
            input.createdAt,
            input.orderId,
            input.id,
          ),
      ]);

      const inserted = results[0]?.meta?.changes ?? 0;
      if (inserted < 1) {
        const concurrentReplay = await findExistingReport(input);
        if (concurrentReplay) return concurrentReplay;
        return { kind: "invalid_state", order: await findById(input.orderId) };
      }

      const order = await findById(input.orderId);
      if (!order || order.status !== "payment_reported") {
        throw new Error("El lote de aviso no dejó un estado coherente.");
      }
      return { kind: "reported", order };
    },
  };
}
