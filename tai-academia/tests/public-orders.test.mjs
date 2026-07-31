import assert from "node:assert/strict";
import test from "node:test";

import { createPublicOrderHandlers } from "../lib/public-order-handlers.ts";
import {
  buildWhatsappUrl,
  deriveLookupCredentials,
  FixedWindowRateLimiter,
  hashLookupToken,
  parseCreateOrderBody,
  parseLookupAuthorization,
  parsePaymentReportBody,
  randomPublicReference,
  readPublicOrderConfig,
  toPublicCommercialDisclosures,
  toPublicOrderView,
} from "../lib/public-orders.ts";

const NOW = new Date("2026-07-29T12:00:00.000Z");
const CREATE_KEY = "10000000-4000-4000-8000-000000000001";
const REPORT_KEY = "20000000-4000-4000-8000-000000000002";
const REFERENCE = "SS-00112233445566778899AABB";

function configuredEnv(overrides = {}) {
  return {
    SS_CASOLAB_ORDERING_ENABLED: "true",
    SS_CASOLAB_PRODUCT_ID: "ss-casolab-beta",
    SS_CASOLAB_OFFER_VERSION: "beta-2026-07",
    SS_CASOLAB_PRICE_CENTS: "4900",
    SS_CASOLAB_CURRENCY: "EUR",
    SS_CASOLAB_ORDER_TTL_HOURS: "48",
    SS_CASOLAB_BIZUM_MODE: "professional_manual",
    SS_CASOLAB_BIZUM_RECIPIENT: "COMERCIO-DE-PRUEBA",
    SS_CASOLAB_BIZUM_DISPLAY_NAME: "SS CasoLab",
    SS_CASOLAB_WHATSAPP_PHONE: "34600000000",
    SS_CASOLAB_SUPPORT_HOURS: "Laborables, 10:00-14:00",
    SS_CASOLAB_SELLER_LEGAL_NAME: "Vendedor de prueba",
    SS_CASOLAB_SELLER_NIF: "X0000000T",
    SS_CASOLAB_SELLER_ADDRESS: "Dirección pública de prueba, España",
    SS_CASOLAB_SELLER_EMAIL: "ventas@example.test",
    SS_CASOLAB_TERMS_VERSION: "terms-2026-07",
    SS_CASOLAB_PRIVACY_VERSION: "privacy-2026-07",
    SS_CASOLAB_PRODUCT_INVENTORY_URL: "https://example.test/inventario",
    SS_CASOLAB_TERMS_URL: "https://example.test/condiciones",
    SS_CASOLAB_PRIVACY_URL: "https://example.test/privacidad",
    SS_CASOLAB_WITHDRAWAL_URL: "https://example.test/desistimiento",
    SS_CASOLAB_GATE2_APPROVAL_ID: "gate2-test-2026-07",
    SS_CASOLAB_GATE2_APPROVED_AT: "2026-07-30T10:00:00.000Z",
    SS_CASOLAB_GATE2_APPROVED_BY: "david+alba",
    SS_CASOLAB_LOOKUP_HMAC_SECRET: "s".repeat(64),
    ...overrides,
  };
}

function validCreateBody(overrides = {}) {
  return {
    name: "Persona de prueba",
    email: "persona@example.test",
    termsAccepted: true,
    privacyNoticeAcknowledged: true,
    digitalStartConsent: true,
    withdrawalAcknowledged: true,
    ...overrides,
  };
}

function jsonRequest(url, method, body, headers = {}) {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

class MemoryOrderStore {
  orders = new Map();
  creations = new Map();
  reportsByKey = new Map();
  reportsByFingerprint = new Map();

  async create(input) {
    const previous = this.creations.get(input.createIdempotencyKey);
    if (previous) {
      if (previous.fingerprint !== input.requestFingerprint) {
        return { kind: "idempotency_conflict" };
      }
      return { kind: "replayed", order: this.orders.get(previous.id) };
    }
    const order = {
      id: input.id,
      reference: input.reference,
      productId: input.productId,
      offerVersion: input.offerVersion,
      amountCents: input.amountCents,
      currency: input.currency,
      status: "awaiting_payment",
      expiresAt: input.expiresAt,
      createdAt: input.acceptedAt,
      updatedAt: input.acceptedAt,
      lookupTokenHash: input.lookupTokenHash,
    };
    this.orders.set(input.id, order);
    this.creations.set(input.createIdempotencyKey, {
      id: input.id,
      fingerprint: input.requestFingerprint,
    });
    return { kind: "created", order };
  }

  async findByCredentials(reference, lookupTokenHash) {
    return (
      [...this.orders.values()].find(
        (order) =>
          order.reference === reference &&
          order.lookupTokenHash === lookupTokenHash,
      ) ?? null
    );
  }

  async reportPayment(input) {
    const byKey = this.reportsByKey.get(input.idempotencyKey);
    if (byKey) {
      if (
        byKey.orderId !== input.orderId ||
        byKey.fingerprint !== input.requestFingerprint
      ) {
        return { kind: "idempotency_conflict" };
      }
      return { kind: "replayed", order: this.orders.get(input.orderId) };
    }
    const byFingerprint = this.reportsByFingerprint.get(
      input.requestFingerprint,
    );
    if (byFingerprint) {
      return byFingerprint.orderId === input.orderId
        ? { kind: "replayed", order: this.orders.get(input.orderId) }
        : { kind: "idempotency_conflict" };
    }
    const order = this.orders.get(input.orderId);
    if (!order || order.status !== "awaiting_payment") {
      return { kind: "invalid_state", order: order ?? null };
    }
    order.status = "payment_reported";
    order.updatedAt = input.createdAt;
    const report = {
      orderId: input.orderId,
      fingerprint: input.requestFingerprint,
    };
    this.reportsByKey.set(input.idempotencyKey, report);
    this.reportsByFingerprint.set(input.requestFingerprint, report);
    return { kind: "reported", order };
  }
}

test("order configuration fails closed for every commercial gate", () => {
  const complete = configuredEnv();
  assert.equal(readPublicOrderConfig(complete).ok, true);
  assert.equal(
    readPublicOrderConfig({
      ...complete,
      SS_CASOLAB_ORDERING_ENABLED: "false",
    }).ok,
    false,
  );

  for (const key of [
    "SS_CASOLAB_PRODUCT_ID",
    "SS_CASOLAB_OFFER_VERSION",
    "SS_CASOLAB_PRICE_CENTS",
    "SS_CASOLAB_CURRENCY",
    "SS_CASOLAB_ORDER_TTL_HOURS",
    "SS_CASOLAB_BIZUM_MODE",
    "SS_CASOLAB_BIZUM_RECIPIENT",
    "SS_CASOLAB_BIZUM_DISPLAY_NAME",
    "SS_CASOLAB_WHATSAPP_PHONE",
    "SS_CASOLAB_SUPPORT_HOURS",
    "SS_CASOLAB_SELLER_LEGAL_NAME",
    "SS_CASOLAB_SELLER_NIF",
    "SS_CASOLAB_SELLER_ADDRESS",
    "SS_CASOLAB_SELLER_EMAIL",
    "SS_CASOLAB_TERMS_VERSION",
    "SS_CASOLAB_PRIVACY_VERSION",
    "SS_CASOLAB_PRODUCT_INVENTORY_URL",
    "SS_CASOLAB_TERMS_URL",
    "SS_CASOLAB_PRIVACY_URL",
    "SS_CASOLAB_WITHDRAWAL_URL",
    "SS_CASOLAB_GATE2_APPROVAL_ID",
    "SS_CASOLAB_GATE2_APPROVED_AT",
    "SS_CASOLAB_GATE2_APPROVED_BY",
    "SS_CASOLAB_LOOKUP_HMAC_SECRET",
  ]) {
    assert.equal(readPublicOrderConfig({ ...complete, [key]: "" }).ok, false, key);
  }

  assert.equal(
    readPublicOrderConfig(
      configuredEnv({ SS_CASOLAB_BIZUM_MODE: "personal_p2p" }),
    ).ok,
    false,
  );
  assert.equal(
    readPublicOrderConfig(
      configuredEnv({ SS_CASOLAB_WHATSAPP_PHONE: "+34600000000" }),
    ).ok,
    false,
  );
  assert.equal(
    readPublicOrderConfig(
      configuredEnv({ SS_CASOLAB_PRICE_CENTS: "49.00" }),
    ).ok,
    false,
  );
});

test("commercial disclosures expose the exact offer documents but no Bizum recipient or secrets", () => {
  const parsed = readPublicOrderConfig(configuredEnv());
  assert.equal(parsed.ok, true);
  const disclosures = toPublicCommercialDisclosures(parsed.config);
  assert.equal(disclosures.amountCents, 4900);
  assert.equal(disclosures.termsVersion, "terms-2026-07");
  assert.equal(
    disclosures.documents.withdrawalUrl,
    "https://example.test/desistimiento",
  );
  const serialized = JSON.stringify(disclosures);
  assert.doesNotMatch(serialized, /COMERCIO-DE-PRUEBA/);
  assert.doesNotMatch(serialized, new RegExp("s".repeat(64)));
});

test("create and report inputs reject client commerce fields and keep acceptances separate", () => {
  assert.equal(parseCreateOrderBody(validCreateBody()).kind, "valid");
  assert.equal(
    parseCreateOrderBody(validCreateBody({ termsAccepted: false })).kind,
    "invalid",
  );
  assert.equal(
    parseCreateOrderBody(
      validCreateBody({ privacyNoticeAcknowledged: false }),
    ).kind,
    "invalid",
  );
  assert.equal(
    parseCreateOrderBody(validCreateBody({ digitalStartConsent: false })).kind,
    "invalid",
  );
  assert.equal(
    parseCreateOrderBody(validCreateBody({ withdrawalAcknowledged: false })).kind,
    "invalid",
  );
  for (const forbidden of [
    { amountCents: 1 },
    { currency: "USD" },
    { productId: "another-product" },
    { price: "1" },
    { screenshot: "data:image/png;base64,..." },
    { iban: "ES0000000000000000000000" },
  ]) {
    assert.equal(
      parseCreateOrderBody(validCreateBody(forbidden)).kind,
      "invalid",
      JSON.stringify(forbidden),
    );
  }
  assert.equal(
    parseCreateOrderBody({ company: "bot", amountCents: 1 }).kind,
    "honeypot",
  );
  assert.equal(
    parsePaymentReportBody({ reference: REFERENCE }).kind,
    "valid",
  );
  assert.equal(
    parsePaymentReportBody({ reference: REFERENCE, screenshot: "x" }).kind,
    "invalid",
  );
});

test("lookup credentials are opaque, repeatable for idempotent replay and stored as HMAC only", async () => {
  const secret = "k".repeat(64);
  const first = await deriveLookupCredentials(CREATE_KEY, secret);
  const replay = await deriveLookupCredentials(CREATE_KEY, secret);
  const other = await deriveLookupCredentials(REPORT_KEY, secret);

  assert.deepEqual(first, replay);
  assert.match(first.token, /^[a-f0-9]{64}$/);
  assert.match(first.tokenHash, /^[a-f0-9]{64}$/);
  assert.notEqual(first.token, first.tokenHash);
  assert.notEqual(first.token, other.token);
  assert.equal(await hashLookupToken(first.token, secret), first.tokenHash);
  assert.equal(parseLookupAuthorization(`Bearer ${first.token}`), first.token);
  assert.equal(parseLookupAuthorization(first.token), null);
});

test("opaque references and WhatsApp links expose only the bounded reference", () => {
  const reference = randomPublicReference((bytes) => {
    bytes.fill(0xab);
    return bytes;
  });
  assert.equal(reference, "SS-ABABABABABABABABABABABAB");

  const parsed = readPublicOrderConfig(configuredEnv());
  assert.equal(parsed.ok, true);
  const url = new URL(buildWhatsappUrl(reference, parsed.config));
  assert.equal(url.protocol, "https:");
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/34600000000");
  assert.match(url.searchParams.get("text"), new RegExp(reference));
  assert.doesNotMatch(url.toString(), /4900|persona@example|Vendedor/);
  assert.equal([...url.searchParams.keys()].join(","), "text");
});

test("public order views contain no PII, bank data or server secrets", () => {
  const parsed = readPublicOrderConfig(configuredEnv());
  assert.equal(parsed.ok, true);
  const order = {
    id: "internal-id",
    reference: REFERENCE,
    productId: parsed.config.productId,
    offerVersion: parsed.config.offerVersion,
    amountCents: parsed.config.amountCents,
    currency: "EUR",
    status: "awaiting_payment",
    expiresAt: "2026-07-30T12:00:00.000Z",
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
  };
  const view = toPublicOrderView(order, parsed.config, NOW);
  const serialized = JSON.stringify(view);
  assert.equal(view.status, "awaiting_payment");
  assert.equal(view.nextAction, "pay_with_reference");
  assert.doesNotMatch(serialized, /internal-id|Vendedor de prueba|X0000000T/);
  assert.doesNotMatch(serialized, new RegExp("s".repeat(64)));

  const expired = toPublicOrderView(
    { ...order, expiresAt: "2026-07-28T12:00:00.000Z" },
    parsed.config,
    NOW,
  );
  assert.equal(expired.status, "expired");
  assert.equal(expired.bizum, null);
});

test("fixed-window limiter bounds attempts without IP or fingerprint data", () => {
  const limiter = new FixedWindowRateLimiter(2, 60_000);
  assert.equal(limiter.consume("opaque-reference", 0).allowed, true);
  assert.equal(limiter.consume("opaque-reference", 1).allowed, true);
  const blocked = limiter.consume("opaque-reference", 2);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 60);
  assert.equal(limiter.consume("opaque-reference", 60_000).allowed, true);
});

test("public handlers create, replay, query and report without ever confirming payment", async () => {
  const store = new MemoryOrderStore();
  let uuidCounter = 0;
  const handlers = createPublicOrderHandlers({
    env: configuredEnv(),
    store,
    now: () => new Date(NOW),
    randomUUID: () => `00000000-4000-4000-8000-${String(++uuidCounter).padStart(12, "0")}`,
    referenceFactory: () => REFERENCE,
    rateLimit: () => ({ allowed: true, retryAfterSeconds: 0 }),
  });

  const createdResponse = await handlers.create(
    jsonRequest("https://example.test/api/orders", "POST", validCreateBody(), {
      "Idempotency-Key": CREATE_KEY,
    }),
  );
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.equal(created.ok, true);
  assert.equal(created.order.status, "awaiting_payment");
  assert.equal(created.order.amountCents, 4900);
  assert.match(created.lookupToken, /^[a-f0-9]{64}$/);
  assert.doesNotMatch(
    JSON.stringify(created),
    /persona@example|Persona de prueba|Vendedor de prueba|X0000000T|Dirección pública|tokenHash/,
  );

  const replayResponse = await handlers.create(
    jsonRequest("https://example.test/api/orders", "POST", validCreateBody(), {
      "Idempotency-Key": CREATE_KEY,
    }),
  );
  const replay = await replayResponse.json();
  assert.equal(replayResponse.status, 200);
  assert.equal(replay.replayed, true);
  assert.equal(replay.lookupToken, created.lookupToken);
  assert.equal(replay.order.reference, created.order.reference);

  const conflictResponse = await handlers.create(
    jsonRequest(
      "https://example.test/api/orders",
      "POST",
      validCreateBody({ name: "Otra persona" }),
      { "Idempotency-Key": CREATE_KEY },
    ),
  );
  assert.equal(conflictResponse.status, 409);

  const noHeader = await handlers.status(
    new Request(
      `https://example.test/api/orders/status?reference=${REFERENCE}&token=${created.lookupToken}`,
    ),
  );
  assert.equal(noHeader.status, 404);

  const statusResponse = await handlers.status(
    new Request(
      `https://example.test/api/orders/status?reference=${REFERENCE}`,
      { headers: { authorization: `Bearer ${created.lookupToken}` } },
    ),
  );
  const status = await statusResponse.json();
  assert.equal(statusResponse.status, 200);
  assert.equal(status.order.status, "awaiting_payment");
  assert.equal("lookupToken" in status, false);
  assert.doesNotMatch(JSON.stringify(status), /lookupToken|tokenHash/);

  const reportResponse = await handlers.reportPayment(
    jsonRequest(
      "https://example.test/api/orders/report-payment",
      "POST",
      { reference: REFERENCE },
      {
        authorization: `Bearer ${created.lookupToken}`,
        "Idempotency-Key": REPORT_KEY,
      },
    ),
  );
  const report = await reportResponse.json();
  assert.equal(reportResponse.status, 201);
  assert.equal(report.paymentVerified, false);
  assert.equal(report.order.status, "payment_reported");
  assert.notEqual(report.order.status, "paid");
  assert.equal("lookupToken" in report, false);

  const replayedReport = await handlers.reportPayment(
    jsonRequest(
      "https://example.test/api/orders/report-payment",
      "POST",
      { reference: REFERENCE },
      {
        authorization: `Bearer ${created.lookupToken}`,
        "Idempotency-Key": REPORT_KEY,
      },
    ),
  );
  assert.equal(replayedReport.status, 200);
  assert.equal((await replayedReport.json()).replayed, true);
});

test("public handlers stay closed and do not touch storage with incomplete config", async () => {
  const store = {
    create() {
      throw new Error("must not run");
    },
    findByCredentials() {
      throw new Error("must not run");
    },
    reportPayment() {
      throw new Error("must not run");
    },
  };
  const handlers = createPublicOrderHandlers({
    env: configuredEnv({ SS_CASOLAB_ORDERING_ENABLED: "false" }),
    store,
  });
  const response = await handlers.create(
    jsonRequest("https://example.test/api/orders", "POST", validCreateBody(), {
      "Idempotency-Key": CREATE_KEY,
    }),
  );
  assert.equal(response.status, 503);
});
