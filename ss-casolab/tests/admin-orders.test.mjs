import assert from "node:assert/strict";
import test from "node:test";

import {
  authenticateAdminBearer,
  fingerprintAdminPayment,
  hmacProviderReference,
  parseAdminPaymentInput,
  readAdminOrderConfig,
} from "../lib/admin-orders.ts";
import { createAdminOrderHandlers } from "../lib/admin-order-handlers.ts";

const DAVID_SECRET = "d".repeat(64);
const ALBA_SECRET = "a".repeat(64);
const PAYMENT_SECRET = "p".repeat(64);
const IDEMPOTENCY_KEY = "10000000-4000-4000-8000-000000000001";
const REFERENCE = "SS-00112233445566778899AABB";
const NOW = "2026-07-30T12:00:00.000Z";

function validEnv(overrides = {}) {
  return {
    SS_CASOLAB_ORDERING_ENABLED: "true",
    SS_CASOLAB_PRODUCT_ID: "ss-casolab-beta",
    SS_CASOLAB_OFFER_VERSION: "beta-2026-07",
    SS_CASOLAB_PRICE_CENTS: "4900",
    SS_CASOLAB_CURRENCY: "EUR",
    SS_CASOLAB_ORDER_TTL_HOURS: "48",
    SS_CASOLAB_BIZUM_MODE: "professional_manual",
    SS_CASOLAB_BIZUM_RECIPIENT: "recipient-test",
    SS_CASOLAB_BIZUM_DISPLAY_NAME: "Seller test",
    SS_CASOLAB_WHATSAPP_PHONE: "34600000000",
    SS_CASOLAB_SUPPORT_HOURS: "martes y jueves, 18:00-20:00",
    SS_CASOLAB_SELLER_LEGAL_NAME: "Seller test",
    SS_CASOLAB_SELLER_NIF: "TEST-NIF",
    SS_CASOLAB_SELLER_ADDRESS: "Test address",
    SS_CASOLAB_SELLER_EMAIL: "seller@example.test",
    SS_CASOLAB_TERMS_VERSION: "terms-2026-07",
    SS_CASOLAB_PRIVACY_VERSION: "privacy-2026-07",
    SS_CASOLAB_PRODUCT_INVENTORY_URL: "https://example.test/inventory",
    SS_CASOLAB_TERMS_URL: "https://example.test/terms",
    SS_CASOLAB_PRIVACY_URL: "https://example.test/privacy",
    SS_CASOLAB_WITHDRAWAL_URL: "https://example.test/withdrawal",
    SS_CASOLAB_LOOKUP_HMAC_SECRET: "l".repeat(64),
    SS_CASOLAB_ADMIN_ENABLED: "true",
    SS_CASOLAB_ADMIN_DAVID_SECRET: DAVID_SECRET,
    SS_CASOLAB_ADMIN_ALBA_SECRET: ALBA_SECRET,
    SS_CASOLAB_PAYMENT_REFERENCE_HMAC_SECRET: PAYMENT_SECRET,
    SS_CASOLAB_PAYMENT_REFERENCE_HMAC_VERSION: "v1",
    ...overrides,
  };
}

function matchedBody(overrides = {}) {
  return {
    reference: REFERENCE,
    expectedStatus: "awaiting_payment",
    decision: "matched",
    observedAmountCents: 4900,
    observedAt: "2026-07-30T11:58:00.000Z",
    providerTransactionId: "BANK-OP-001122",
    reasonCode: "matched_exact",
    ...overrides,
  };
}

test("admin payment configuration fails closed and separates every secret", () => {
  assert.equal(readAdminOrderConfig(validEnv()).ok, true);
  assert.deepEqual(readAdminOrderConfig(validEnv({ SS_CASOLAB_ADMIN_ENABLED: "false" })), {
    ok: false,
    reasons: ["admin_disabled"],
  });
  assert.equal(
    readAdminOrderConfig(
      validEnv({ SS_CASOLAB_ADMIN_ALBA_SECRET: DAVID_SECRET }),
    ).ok,
    false,
  );
  assert.equal(
    readAdminOrderConfig(
      validEnv({ SS_CASOLAB_PAYMENT_REFERENCE_HMAC_SECRET: DAVID_SECRET }),
    ).ok,
    false,
  );
  assert.equal(
    readAdminOrderConfig(
      validEnv({
        SS_CASOLAB_ORDERING_ENABLED: "false",
        SS_CASOLAB_PRODUCT_INVENTORY_URL: "",
      }),
    ).ok,
    true,
    "cerrar nuevas ventas no debe bloquear la conciliación de pedidos existentes",
  );
});

test("bearer authentication infers the operator without trusting request data", async () => {
  const configured = readAdminOrderConfig(validEnv());
  assert.equal(configured.ok, true);
  assert.equal(
    await authenticateAdminBearer(`Bearer ${DAVID_SECRET}`, configured.config),
    "david",
  );
  assert.equal(
    await authenticateAdminBearer(`Bearer ${ALBA_SECRET}`, configured.config),
    "alba",
  );
  assert.equal(
    await authenticateAdminBearer(`Bearer ${"x".repeat(64)}`, configured.config),
    null,
  );
  assert.equal(await authenticateAdminBearer("Basic abc", configured.config), null);
});

test("admin input is closed, bounded and forces evidence for a match", () => {
  assert.equal(parseAdminPaymentInput(matchedBody()).kind, "valid");
  assert.equal(
    parseAdminPaymentInput(matchedBody({ providerTransactionId: "" })).kind,
    "invalid",
  );
  assert.equal(
    parseAdminPaymentInput(matchedBody({ observedAmountCents: 49.5 })).kind,
    "invalid",
  );
  assert.equal(
    parseAdminPaymentInput(matchedBody({ decision: "paid" })).kind,
    "invalid",
  );
  assert.equal(
    parseAdminPaymentInput({ ...matchedBody(), screenshot: "base64" }).kind,
    "invalid",
  );
  assert.equal(
    parseAdminPaymentInput({
      ...matchedBody({
        decision: "needs_review",
        reasonCode: "amount_mismatch",
      }),
      providerTransactionId: undefined,
    }).kind,
    "valid",
  );
});

test("provider references are normalized, HMACed and never part of fingerprints in clear", async () => {
  const first = await hmacProviderReference(
    " bank-op-001122 ",
    PAYMENT_SECRET,
  );
  const second = await hmacProviderReference(
    "BANK-OP-001122",
    PAYMENT_SECRET,
  );
  assert.equal(first, second);
  assert.match(first, /^[a-f0-9]{64}$/);
  assert.equal(first.includes("BANK"), false);

  const parsed = parseAdminPaymentInput(matchedBody());
  assert.equal(parsed.kind, "valid");
  const fingerprint = await fingerprintAdminPayment(
    parsed.input,
    first,
  );
  assert.match(fingerprint, /^[a-f0-9]{64}$/);
  assert.equal(fingerprint.includes("BANK-OP"), false);
});

test("authenticated handler records bank evidence but does not grant Moodle access", async () => {
  const calls = [];
  const store = {
    async verifyPayment(input) {
      calls.push(input);
      return {
        kind: "verified",
        verificationResult: "matched",
        order: {
          reference: REFERENCE,
          amountCents: 4900,
          currency: "EUR",
          status: "paid",
          expiresAt: "2026-08-01T12:00:00.000Z",
        },
      };
    },
  };
  const handler = createAdminOrderHandlers({
    env: validEnv(),
    store,
    now: () => new Date(NOW),
    randomUUID: (() => {
      let counter = 1;
      return () => `00000000-4000-4000-8000-${String(counter++).padStart(12, "0")}`;
    })(),
    rateLimit: () => ({ allowed: true, retryAfterSeconds: 0 }),
  });
  const response = await handler.verifyPayment(
    new Request("https://example.test/api/admin/orders/verify-payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DAVID_SECRET}`,
        "Content-Type": "application/json",
        "Idempotency-Key": IDEMPOTENCY_KEY,
      },
      body: JSON.stringify(matchedBody()),
    }),
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.paymentVerified, true);
  assert.equal(payload.accessProvisioned, false);
  assert.equal(payload.order.status, "paid");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].actor, "david");
  assert.match(calls[0].providerReferenceHmac, /^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(calls[0]).includes("BANK-OP-001122"), false);
  assert.equal(JSON.stringify(payload).includes("BANK-OP-001122"), false);
});

test("admin handler rejects unauthenticated, stale and conflicting mutations without store writes", async () => {
  let calls = 0;
  const handler = createAdminOrderHandlers({
    env: validEnv(),
    store: {
      async verifyPayment() {
        calls += 1;
        return { kind: "idempotency_conflict" };
      },
    },
    now: () => new Date(NOW),
    rateLimit: () => ({ allowed: true, retryAfterSeconds: 0 }),
  });

  const unauthorized = await handler.verifyPayment(
    new Request("https://example.test/api/admin/orders/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matchedBody()),
    }),
  );
  assert.equal(unauthorized.status, 401);
  assert.equal(calls, 0);

  const stale = await handler.verifyPayment(
    new Request("https://example.test/api/admin/orders/verify-payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ALBA_SECRET}`,
        "Content-Type": "application/json",
        "Idempotency-Key": IDEMPOTENCY_KEY,
      },
      body: JSON.stringify(
        matchedBody({ observedAt: "2026-07-30T12:10:01.000Z" }),
      ),
    }),
  );
  assert.equal(stale.status, 400);
  assert.equal(calls, 0);
});
