import { parsePublicReference } from "./public-orders.ts";

export const ADMIN_ACTORS = ["david", "alba"] as const;
export const ADMIN_PAYMENT_DECISIONS = [
  "matched",
  "needs_review",
  "rejected",
] as const;
export const ADMIN_EXPECTED_PAYMENT_STATUSES = [
  "awaiting_payment",
  "payment_reported",
  "expired",
  "cancelled",
] as const;

export type AdminActor = (typeof ADMIN_ACTORS)[number];
export type AdminPaymentDecision =
  (typeof ADMIN_PAYMENT_DECISIONS)[number];
export type AdminExpectedPaymentStatus =
  (typeof ADMIN_EXPECTED_PAYMENT_STATUSES)[number];

export type AdminOrderConfig = {
  actorSecrets: Record<AdminActor, string>;
  paymentReferenceHmacSecret: string;
  paymentReferenceHmacVersion: string;
};

export type ParsedAdminPaymentInput = {
  reference: string;
  expectedStatus: AdminExpectedPaymentStatus;
  decision: AdminPaymentDecision;
  observedAmountCents: number;
  observedAt: string;
  providerTransactionId: string | null;
  reasonCode: string;
};

type AdminConfigResult =
  | { ok: true; config: AdminOrderConfig }
  | { ok: false; reasons: string[] };

type AdminPaymentParseResult =
  | { kind: "valid"; input: ParsedAdminPaymentInput }
  | { kind: "invalid"; message: string };

const ALLOWED_KEYS = new Set([
  "reference",
  "expectedStatus",
  "decision",
  "observedAmountCents",
  "observedAt",
  "providerTransactionId",
  "reasonCode",
]);
const EXPECTED_STATUS_SET = new Set<string>(ADMIN_EXPECTED_PAYMENT_STATUSES);
const DECISION_SET = new Set<string>(ADMIN_PAYMENT_DECISIONS);
const REASONS_BY_DECISION: Record<AdminPaymentDecision, ReadonlySet<string>> = {
  matched: new Set(["matched_exact"]),
  needs_review: new Set([
    "amount_mismatch",
    "late_payment",
    "missing_reference",
    "duplicate_payment",
    "payer_mismatch",
    "manual_review",
  ]),
  rejected: new Set(["bank_transaction_not_found", "invalid_evidence"]),
};
const PROVIDER_REFERENCE_PATTERN = /^[^\u0000-\u001f\u007f]{6,120}$/u;
const VERSION_PATTERN = /^v[1-9][0-9]{0,5}$/;

function envText(env: Record<string, unknown>, key: string): string {
  const value = env[key];
  return typeof value === "string" ? value.trim() : "";
}

function isStrongSecret(value: string): boolean {
  return value.length >= 48 && value.length <= 512;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizedProviderReference(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toUpperCase();
}

function exactIsoDate(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 40) return null;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  return parsed.toISOString() === value ? value : null;
}

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
}

async function sha256(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return new Uint8Array(digest);
}

async function constantTimeSecretMatch(
  candidate: string,
  expected: string,
): Promise<boolean> {
  const [candidateHash, expectedHash] = await Promise.all([
    sha256(candidate),
    sha256(expected),
  ]);
  let difference = 0;
  for (let index = 0; index < expectedHash.length; index += 1) {
    difference |= candidateHash[index] ^ expectedHash[index];
  }
  return difference === 0;
}

export function readAdminOrderConfig(
  env: Record<string, unknown>,
): AdminConfigResult {
  if (envText(env, "SS_CASOLAB_ADMIN_ENABLED") !== "true") {
    return { ok: false, reasons: ["admin_disabled"] };
  }

  const reasons: string[] = [];
  const david = envText(env, "SS_CASOLAB_ADMIN_DAVID_SECRET");
  const alba = envText(env, "SS_CASOLAB_ADMIN_ALBA_SECRET");
  const paymentReferenceHmacSecret = envText(
    env,
    "SS_CASOLAB_PAYMENT_REFERENCE_HMAC_SECRET",
  );
  const paymentReferenceHmacVersion = envText(
    env,
    "SS_CASOLAB_PAYMENT_REFERENCE_HMAC_VERSION",
  );

  if (!isStrongSecret(david)) reasons.push("invalid_david_secret");
  if (!isStrongSecret(alba)) reasons.push("invalid_alba_secret");
  if (!isStrongSecret(paymentReferenceHmacSecret)) {
    reasons.push("invalid_payment_reference_hmac_secret");
  }
  if (!VERSION_PATTERN.test(paymentReferenceHmacVersion)) {
    reasons.push("invalid_payment_reference_hmac_version");
  }
  if (david && alba && david === alba) reasons.push("shared_operator_secret");
  if (
    paymentReferenceHmacSecret &&
    (paymentReferenceHmacSecret === david ||
      paymentReferenceHmacSecret === alba)
  ) {
    reasons.push("shared_payment_reference_secret");
  }

  if (reasons.length > 0) return { ok: false, reasons };
  return {
    ok: true,
    config: {
      actorSecrets: { david, alba },
      paymentReferenceHmacSecret,
      paymentReferenceHmacVersion,
    },
  };
}

export async function authenticateAdminBearer(
  authorization: string | null,
  config: AdminOrderConfig,
): Promise<AdminActor | null> {
  const match = authorization?.match(/^Bearer ([^\s]{1,1024})$/);
  if (!match) return null;
  const candidate = match[1];
  const [isDavid, isAlba] = await Promise.all([
    constantTimeSecretMatch(candidate, config.actorSecrets.david),
    constantTimeSecretMatch(candidate, config.actorSecrets.alba),
  ]);
  if (isDavid === isAlba) return null;
  return isDavid ? "david" : "alba";
}

export function parseAdminPaymentInput(
  value: unknown,
): AdminPaymentParseResult {
  if (!isRecord(value)) {
    return { kind: "invalid", message: "La solicitud no tiene un formato válido." };
  }
  if (Object.keys(value).some((key) => !ALLOWED_KEYS.has(key))) {
    return { kind: "invalid", message: "La solicitud contiene campos no admitidos." };
  }

  const reference = parsePublicReference(value.reference);
  const expectedStatus = value.expectedStatus;
  const decision = value.decision;
  const observedAmountCents =
    typeof value.observedAmountCents === "number"
      ? value.observedAmountCents
      : null;
  const observedAt = exactIsoDate(value.observedAt);
  const reasonCode = value.reasonCode;
  const providerTransactionId =
    typeof value.providerTransactionId === "string" &&
    value.providerTransactionId.trim()
      ? normalizedProviderReference(value.providerTransactionId)
      : null;

  if (
    !reference ||
    typeof expectedStatus !== "string" ||
    !EXPECTED_STATUS_SET.has(expectedStatus) ||
    typeof decision !== "string" ||
    !DECISION_SET.has(decision) ||
    !Number.isInteger(observedAmountCents) ||
    observedAmountCents === null ||
    observedAmountCents < 1 ||
    observedAmountCents > 10_000_000 ||
    !observedAt ||
    typeof reasonCode !== "string"
  ) {
    return { kind: "invalid", message: "Faltan datos válidos de conciliación." };
  }

  const typedDecision = decision as AdminPaymentDecision;
  if (!REASONS_BY_DECISION[typedDecision].has(reasonCode)) {
    return { kind: "invalid", message: "El motivo no corresponde a la decisión." };
  }
  if (
    providerTransactionId !== null &&
    !PROVIDER_REFERENCE_PATTERN.test(providerTransactionId)
  ) {
    return { kind: "invalid", message: "La referencia bancaria no es válida." };
  }
  if (typedDecision === "matched" && providerTransactionId === null) {
    return {
      kind: "invalid",
      message: "Una coincidencia exige una referencia bancaria estable.",
    };
  }

  return {
    kind: "valid",
    input: {
      reference,
      expectedStatus: expectedStatus as AdminExpectedPaymentStatus,
      decision: typedDecision,
      observedAmountCents,
      observedAt,
      providerTransactionId,
      reasonCode,
    },
  };
}

export async function hmacProviderReference(
  providerTransactionId: string,
  secret: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(
      normalizedProviderReference(providerTransactionId),
    ),
  );
  return bytesToHex(signature);
}

export async function fingerprintAdminPayment(
  input: ParsedAdminPaymentInput,
  providerReferenceHmac: string | null,
): Promise<string> {
  const canonical = JSON.stringify({
    decision: input.decision,
    expectedStatus: input.expectedStatus,
    observedAmountCents: input.observedAmountCents,
    observedAt: input.observedAt,
    providerReferenceHmac,
    reasonCode: input.reasonCode,
    reference: input.reference,
  });
  return bytesToHex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical)),
  );
}
