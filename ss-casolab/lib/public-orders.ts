import type { PaymentStatus } from "./order-state.ts";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_REFERENCE_PATTERN = /^SS-[A-F0-9]{24}$/;
const LOOKUP_TOKEN_PATTERN = /^[a-f0-9]{64}$/;
const E164_DIGITS_PATTERN = /^[1-9][0-9]{7,14}$/;
const RELEASE_APPROVAL_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{7,119}$/;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;

const CREATE_BODY_KEYS = new Set([
  "name",
  "email",
  "termsAccepted",
  "privacyNoticeAcknowledged",
  "digitalStartConsent",
  "withdrawalAcknowledged",
  "sessionId",
  "company",
]);

const REPORT_BODY_KEYS = new Set(["reference", "company"]);

export type PublicOrderConfig = {
  productId: string;
  offerVersion: string;
  amountCents: number;
  currency: "EUR";
  ttlHours: number;
  bizum: {
    mode: "professional_manual";
    recipient: string;
    displayName: string;
  };
  whatsapp: {
    phone: string;
    supportHours: string;
  };
  seller: {
    legalName: string;
    nif: string;
    address: string;
    email: string;
  };
  termsVersion: string;
  privacyVersion: string;
  documents: {
    inventoryUrl: string;
    termsUrl: string;
    privacyUrl: string;
    withdrawalUrl: string;
  };
  releaseGate: {
    approvalId: string;
    approvedAt: string;
    approvedBy: "david" | "alba" | "david+alba";
  };
  lookupHmacSecret: string;
};

export type PublicCommercialDisclosures = {
  productId: string;
  offerVersion: string;
  amountCents: number;
  currency: "EUR";
  ttlHours: number;
  seller: PublicOrderConfig["seller"];
  supportHours: string;
  termsVersion: string;
  privacyVersion: string;
  documents: PublicOrderConfig["documents"];
};

export type PublicOrderRecord = {
  id: string;
  reference: string;
  productId: string;
  offerVersion: string;
  amountCents: number;
  currency: "EUR";
  status: PaymentStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = {
  name: string;
  email: string;
  sessionId: string | null;
};

export type PublicOrderView = {
  reference: string;
  productId: string;
  offerVersion: string;
  amountCents: number;
  currency: "EUR";
  status: PaymentStatus;
  expiresAt: string;
  nextAction:
    | "pay_with_reference"
    | "wait_for_review"
    | "contact_support"
    | "check_email_for_access"
    | "refund_in_progress"
    | "closed";
  bizum: {
    mode: "professional_manual";
    recipient: string;
    displayName: string;
  } | null;
  whatsapp: {
    url: string;
    supportHours: string;
  };
};

export type RateLimitResult =
  | { allowed: true; retryAfterSeconds: 0 }
  | { allowed: false; retryAfterSeconds: number };

function envText(env: Record<string, unknown>, key: string): string {
  const value = env[key];
  return typeof value === "string" ? value.trim() : "";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isBoundedText(
  value: string,
  minLength: number,
  maxLength: number,
): boolean {
  return (
    value.length >= minLength &&
    value.length <= maxLength &&
    !CONTROL_CHARACTER_PATTERN.test(value)
  );
}

function canonicalJson(value: Record<string, unknown>): string {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(value).sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    ),
  );
}

function exactIsoTimestamp(value: string): boolean {
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString() === value;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );
  return bytesToHex(new Uint8Array(signature));
}

export function readPublicOrderConfig(
  env: Record<string, unknown>,
):
  | { ok: true; config: PublicOrderConfig }
  | { ok: false; reasons: readonly string[] } {
  const reasons: string[] = [];
  const enabled =
    envText(env, "SS_CASOLAB_ORDERING_ENABLED").toLowerCase() === "true";
  if (!enabled) reasons.push("ordering_disabled");

  const productId = envText(env, "SS_CASOLAB_PRODUCT_ID");
  const offerVersion = envText(env, "SS_CASOLAB_OFFER_VERSION");
  const amountRaw = envText(env, "SS_CASOLAB_PRICE_CENTS");
  const amountCents = Number(amountRaw);
  const currency = envText(env, "SS_CASOLAB_CURRENCY");
  const ttlRaw = envText(env, "SS_CASOLAB_ORDER_TTL_HOURS");
  const ttlHours = Number(ttlRaw);
  const bizumMode = envText(env, "SS_CASOLAB_BIZUM_MODE");
  const bizumRecipient = envText(env, "SS_CASOLAB_BIZUM_RECIPIENT");
  const bizumDisplayName = envText(
    env,
    "SS_CASOLAB_BIZUM_DISPLAY_NAME",
  );
  const whatsappPhone = envText(env, "SS_CASOLAB_WHATSAPP_PHONE");
  const supportHours = envText(env, "SS_CASOLAB_SUPPORT_HOURS");
  const sellerLegalName = envText(env, "SS_CASOLAB_SELLER_LEGAL_NAME");
  const sellerNif = envText(env, "SS_CASOLAB_SELLER_NIF");
  const sellerAddress = envText(env, "SS_CASOLAB_SELLER_ADDRESS");
  const sellerEmail = envText(env, "SS_CASOLAB_SELLER_EMAIL").toLowerCase();
  const termsVersion = envText(env, "SS_CASOLAB_TERMS_VERSION");
  const privacyVersion = envText(env, "SS_CASOLAB_PRIVACY_VERSION");
  const inventoryUrl = envText(env, "SS_CASOLAB_PRODUCT_INVENTORY_URL");
  const termsUrl = envText(env, "SS_CASOLAB_TERMS_URL");
  const privacyUrl = envText(env, "SS_CASOLAB_PRIVACY_URL");
  const withdrawalUrl = envText(env, "SS_CASOLAB_WITHDRAWAL_URL");
  const releaseApprovalId = envText(
    env,
    "SS_CASOLAB_GATE2_APPROVAL_ID",
  );
  const releaseApprovedAt = envText(
    env,
    "SS_CASOLAB_GATE2_APPROVED_AT",
  );
  const releaseApprovedBy = envText(
    env,
    "SS_CASOLAB_GATE2_APPROVED_BY",
  );
  const lookupHmacSecret = envText(env, "SS_CASOLAB_LOOKUP_HMAC_SECRET");

  if (!SLUG_PATTERN.test(productId) || productId.length > 80) {
    reasons.push("invalid_product_id");
  }
  if (!SLUG_PATTERN.test(offerVersion) || offerVersion.length > 80) {
    reasons.push("invalid_offer_version");
  }
  if (
    !/^[1-9][0-9]*$/.test(amountRaw) ||
    !Number.isSafeInteger(amountCents) ||
    amountCents < 100 ||
    amountCents > 1_000_000
  ) {
    reasons.push("invalid_price");
  }
  if (currency !== "EUR") reasons.push("invalid_currency");
  if (
    !/^[1-9][0-9]*$/.test(ttlRaw) ||
    !Number.isSafeInteger(ttlHours) ||
    ttlHours < 1 ||
    ttlHours > 168
  ) {
    reasons.push("invalid_ttl");
  }
  if (bizumMode !== "professional_manual") {
    reasons.push("invalid_bizum_mode");
  }
  if (!isBoundedText(bizumRecipient, 2, 100)) {
    reasons.push("missing_bizum_recipient");
  }
  if (!isBoundedText(bizumDisplayName, 2, 100)) {
    reasons.push("missing_bizum_display_name");
  }
  if (!E164_DIGITS_PATTERN.test(whatsappPhone)) {
    reasons.push("invalid_whatsapp_phone");
  }
  if (!isBoundedText(supportHours, 2, 160)) {
    reasons.push("missing_support_hours");
  }
  if (!isBoundedText(sellerLegalName, 2, 160)) {
    reasons.push("missing_seller_legal_name");
  }
  if (!isBoundedText(sellerNif, 5, 24)) {
    reasons.push("missing_seller_nif");
  }
  if (!isBoundedText(sellerAddress, 8, 300)) {
    reasons.push("missing_seller_address");
  }
  if (!EMAIL_PATTERN.test(sellerEmail) || sellerEmail.length > 160) {
    reasons.push("invalid_seller_email");
  }
  if (!SLUG_PATTERN.test(termsVersion) || termsVersion.length > 80) {
    reasons.push("invalid_terms_version");
  }
  if (!SLUG_PATTERN.test(privacyVersion) || privacyVersion.length > 80) {
    reasons.push("invalid_privacy_version");
  }
  for (const [reason, value] of [
    ["invalid_inventory_url", inventoryUrl],
    ["invalid_terms_url", termsUrl],
    ["invalid_privacy_url", privacyUrl],
    ["invalid_withdrawal_url", withdrawalUrl],
  ] as const) {
    if (!httpsUrl(value)) reasons.push(reason);
  }
  if (!RELEASE_APPROVAL_ID_PATTERN.test(releaseApprovalId)) {
    reasons.push("invalid_gate2_approval_id");
  }
  if (!exactIsoTimestamp(releaseApprovedAt)) {
    reasons.push("invalid_gate2_approved_at");
  }
  if (!["david", "alba", "david+alba"].includes(releaseApprovedBy)) {
    reasons.push("invalid_gate2_approved_by");
  }
  if (
    lookupHmacSecret.length < 32 ||
    lookupHmacSecret.length > 4_096 ||
    CONTROL_CHARACTER_PATTERN.test(lookupHmacSecret)
  ) {
    reasons.push("invalid_lookup_secret");
  }

  if (reasons.length > 0) return { ok: false, reasons };

  return {
    ok: true,
    config: {
      productId,
      offerVersion,
      amountCents,
      currency: "EUR",
      ttlHours,
      bizum: {
        mode: "professional_manual",
        recipient: bizumRecipient,
        displayName: bizumDisplayName,
      },
      whatsapp: {
        phone: whatsappPhone,
        supportHours,
      },
      seller: {
        legalName: sellerLegalName,
        nif: sellerNif,
        address: sellerAddress,
        email: sellerEmail,
      },
      termsVersion,
      privacyVersion,
      documents: {
        inventoryUrl,
        termsUrl,
        privacyUrl,
        withdrawalUrl,
      },
      releaseGate: {
        approvalId: releaseApprovalId,
        approvedAt: releaseApprovedAt,
        approvedBy: releaseApprovedBy as "david" | "alba" | "david+alba",
      },
      lookupHmacSecret,
    },
  };
}

function httpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function toPublicCommercialDisclosures(
  config: PublicOrderConfig,
): PublicCommercialDisclosures {
  return {
    productId: config.productId,
    offerVersion: config.offerVersion,
    amountCents: config.amountCents,
    currency: config.currency,
    ttlHours: config.ttlHours,
    seller: config.seller,
    supportHours: config.whatsapp.supportHours,
    termsVersion: config.termsVersion,
    privacyVersion: config.privacyVersion,
    documents: config.documents,
  };
}

export function parseIdempotencyKey(value: string | null): string | null {
  const normalized = value?.trim() ?? "";
  return UUID_PATTERN.test(normalized) ? normalized.toLowerCase() : null;
}

export function parseLookupAuthorization(value: string | null): string | null {
  if (!value) return null;
  const match = /^Bearer ([a-f0-9]{64})$/.exec(value.trim());
  return match?.[1] ?? null;
}

export function parsePublicReference(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  return PUBLIC_REFERENCE_PATTERN.test(normalized) ? normalized : null;
}

export function parseCreateOrderBody(
  value: unknown,
):
  | { kind: "honeypot" }
  | { kind: "invalid"; message: string }
  | { kind: "valid"; input: CreateOrderInput } {
  if (!isPlainObject(value)) {
    return { kind: "invalid", message: "La solicitud no tiene un formato válido." };
  }

  if (typeof value.company === "string" && value.company.trim()) {
    return { kind: "honeypot" };
  }

  if (Object.keys(value).some((key) => !CREATE_BODY_KEYS.has(key))) {
    return { kind: "invalid", message: "La solicitud contiene campos no permitidos." };
  }

  const name =
    typeof value.name === "string"
      ? value.name.trim().replace(/\s+/g, " ")
      : "";
  const email =
    typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const sessionId =
    typeof value.sessionId === "string" && UUID_PATTERN.test(value.sessionId)
      ? value.sessionId.toLowerCase()
      : null;

  if (!isBoundedText(name, 2, 80)) {
    return { kind: "invalid", message: "Indica un nombre válido." };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 160) {
    return { kind: "invalid", message: "Indica un email válido." };
  }
  if (value.sessionId !== undefined && sessionId === null) {
    return { kind: "invalid", message: "La sesión no tiene un formato válido." };
  }
  if (value.termsAccepted !== true) {
    return { kind: "invalid", message: "Debes aceptar las condiciones de contratación." };
  }
  if (value.privacyNoticeAcknowledged !== true) {
    return { kind: "invalid", message: "Debes confirmar que has recibido la información de privacidad." };
  }
  if (value.digitalStartConsent !== true) {
    return { kind: "invalid", message: "Debes solicitar de forma expresa el inicio del contenido digital." };
  }
  if (value.withdrawalAcknowledged !== true) {
    return { kind: "invalid", message: "Debes confirmar por separado la consecuencia sobre el desistimiento." };
  }

  return { kind: "valid", input: { name, email, sessionId } };
}

export function parsePaymentReportBody(
  value: unknown,
):
  | { kind: "honeypot" }
  | { kind: "invalid"; message: string }
  | { kind: "valid"; reference: string } {
  if (!isPlainObject(value)) {
    return { kind: "invalid", message: "La solicitud no tiene un formato válido." };
  }
  if (typeof value.company === "string" && value.company.trim()) {
    return { kind: "honeypot" };
  }
  if (Object.keys(value).some((key) => !REPORT_BODY_KEYS.has(key))) {
    return { kind: "invalid", message: "La solicitud contiene campos no permitidos." };
  }
  const reference = parsePublicReference(value.reference);
  if (!reference) {
    return { kind: "invalid", message: "La referencia no tiene un formato válido." };
  }
  return { kind: "valid", reference };
}

export function randomPublicReference(
  randomValues: (array: Uint8Array) => Uint8Array = (array) =>
    crypto.getRandomValues(array),
): string {
  return `SS-${bytesToHex(randomValues(new Uint8Array(12))).toUpperCase()}`;
}

export async function deriveLookupCredentials(
  idempotencyKey: string,
  secret: string,
): Promise<{ token: string; tokenHash: string }> {
  const token = await hmacSha256(
    secret,
    `ss-casolab:lookup-token:v1:${idempotencyKey}`,
  );
  const tokenHash = await hashLookupToken(token, secret);
  return { token, tokenHash };
}

export async function hashLookupToken(
  token: string,
  secret: string,
): Promise<string> {
  if (!LOOKUP_TOKEN_PATTERN.test(token)) {
    throw new TypeError("Token de consulta no válido.");
  }
  return hmacSha256(secret, `ss-casolab:lookup-hash:v1:${token}`);
}

export async function fingerprintCreateOrder(
  input: CreateOrderInput,
  config: PublicOrderConfig,
): Promise<string> {
  return hmacSha256(
    config.lookupHmacSecret,
    `ss-casolab:create:v1:${canonicalJson({
      email: input.email,
      name: input.name,
      privacyVersion: config.privacyVersion,
      productId: config.productId,
      sessionId: input.sessionId,
      termsVersion: config.termsVersion,
    })}`,
  );
}

export async function fingerprintPaymentReport(
  orderId: string,
  config: PublicOrderConfig,
): Promise<string> {
  return hmacSha256(
    config.lookupHmacSecret,
    `ss-casolab:payment-report:v1:${orderId}:web`,
  );
}

export function buildWhatsappUrl(
  reference: string,
  config: PublicOrderConfig,
): string {
  if (!PUBLIC_REFERENCE_PATTERN.test(reference)) {
    throw new TypeError("Referencia pública no válida.");
  }
  const message = `Hola. He avisado del pago del pedido ${reference}.`;
  if (message.length > 120) {
    throw new Error("El mensaje de WhatsApp supera el límite permitido.");
  }
  const url = new URL(`https://wa.me/${config.whatsapp.phone}`);
  url.searchParams.set("text", message);
  return url.toString();
}

export function effectivePublicStatus(
  order: PublicOrderRecord,
  now: Date,
): PaymentStatus {
  if (
    order.status === "awaiting_payment" &&
    Date.parse(order.expiresAt) <= now.getTime()
  ) {
    return "expired";
  }
  return order.status;
}

export function toPublicOrderView(
  order: PublicOrderRecord,
  config: PublicOrderConfig,
  now: Date,
): PublicOrderView {
  const status = effectivePublicStatus(order, now);
  const nextAction: PublicOrderView["nextAction"] =
    status === "awaiting_payment"
      ? "pay_with_reference"
      : status === "payment_reported"
        ? "wait_for_review"
        : status === "needs_review"
          ? "contact_support"
          : status === "paid"
            ? "check_email_for_access"
            : status === "refund_pending"
              ? "refund_in_progress"
              : "closed";

  return {
    reference: order.reference,
    productId: order.productId,
    offerVersion: order.offerVersion,
    amountCents: order.amountCents,
    currency: order.currency,
    status,
    expiresAt: order.expiresAt,
    nextAction,
    bizum:
      status === "awaiting_payment"
        ? {
            mode: config.bizum.mode,
            recipient: config.bizum.recipient,
            displayName: config.bizum.displayName,
          }
        : null,
    whatsapp: {
      url: buildWhatsappUrl(order.reference, config),
      supportHours: config.whatsapp.supportHours,
    },
  };
}

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<
    string,
    { count: number; windowStartedAt: number }
  >();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly maxBuckets: number;

  constructor(
    limit: number,
    windowMs: number,
    maxBuckets = 10_000,
  ) {
    if (limit < 1 || windowMs < 1 || maxBuckets < 1) {
      throw new TypeError("Configuración de rate limit no válida.");
    }
    this.limit = limit;
    this.windowMs = windowMs;
    this.maxBuckets = maxBuckets;
  }

  consume(key: string, nowMs = Date.now()): RateLimitResult {
    const current = this.buckets.get(key);
    if (!current || nowMs - current.windowStartedAt >= this.windowMs) {
      if (this.buckets.size >= this.maxBuckets) {
        const firstKey = this.buckets.keys().next().value as string | undefined;
        if (firstKey) this.buckets.delete(firstKey);
      }
      this.buckets.set(key, { count: 1, windowStartedAt: nowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (current.count >= this.limit) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil(
            (this.windowMs - (nowMs - current.windowStartedAt)) / 1_000,
          ),
        ),
      };
    }

    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
