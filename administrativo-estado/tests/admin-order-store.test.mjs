import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { DatabaseSync } from "node:sqlite";
import { createD1AdminOrderStore } from "../db/admin-orders.ts";
import { createD1PublicOrderStore } from "../db/orders.ts";

const migrationUrls = [
  new URL("../drizzle/0000_flashy_banshee.sql", import.meta.url),
  new URL("../drizzle/0001_cool_scalphunter.sql", import.meta.url),
  new URL("../drizzle/0002_dual_experiments.sql", import.meta.url),
  new URL("../drizzle/0003_ss_professional_bizum_orders.sql", import.meta.url),
];
const NOW = "2026-07-30T12:00:00.000Z";
const LATER = "2026-08-01T12:00:00.000Z";

class SQLiteD1Statement {
  values = [];
  constructor(db, query) {
    this.statement = db.prepare(query);
  }
  bind(...values) {
    this.values = values;
    return this;
  }
  async first() {
    return this.statement.get(...this.values) ?? null;
  }
  async run() {
    const result = this.statement.run(...this.values);
    return { success: true, meta: { changes: Number(result.changes) } };
  }
}

class SQLiteD1Database {
  constructor(db) {
    this.db = db;
  }
  prepare(query) {
    return new SQLiteD1Statement(this.db, query);
  }
  async batch(statements) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      this.db.exec("COMMIT");
      return results;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
}

async function stores(t) {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON");
  for (const migrationUrl of migrationUrls) {
    const sql = await readFile(migrationUrl, "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      if (statement.trim()) sqlite.exec(statement);
    }
  }
  t.after(() => sqlite.close());
  const d1 = new SQLiteD1Database(sqlite);
  return {
    sqlite,
    publicStore: createD1PublicOrderStore(d1),
    adminStore: createD1AdminOrderStore(d1),
  };
}

function orderInput(number, overrides = {}) {
  const serial = String(number).padStart(12, "0");
  return {
    id: `00000000-4000-4000-8000-${serial}`,
    reference: `SS-${String(number).padStart(24, "0")}`,
    lookupTokenHash: String(number).repeat(64).slice(0, 64),
    createIdempotencyKey: `10000000-4000-4000-8000-${serial}`,
    requestFingerprint: String(number + 1).repeat(64).slice(0, 64),
    productId: "ss-casolab-beta",
    offerVersion: "beta-2026-07",
    amountCents: 4900,
    currency: "EUR",
    name: "Persona de prueba",
    email: `persona${number}@example.test`,
    sessionId: null,
    termsVersion: "terms-2026-07",
    privacyVersion: "privacy-2026-07",
    acceptedAt: NOW,
    expiresAt: LATER,
    ...overrides,
  };
}

function verificationInput(order, overrides = {}) {
  return {
    verificationId: "20000000-4000-4000-8000-000000000001",
    eventId: "30000000-4000-4000-8000-000000000001",
    reference: order.reference,
    expectedStatus: "awaiting_payment",
    decision: "matched",
    targetStatus: "paid",
    observedAmountCents: order.amountCents,
    observedAt: "2026-07-30T11:58:00.000Z",
    providerReferenceHmac: "f".repeat(64),
    providerReferenceHmacVersion: "v1",
    reasonCode: "matched_exact",
    actor: "david",
    idempotencyKey: "40000000-4000-4000-8000-000000000001",
    requestFingerprint: "e".repeat(64),
    verifiedAt: NOW,
    ...overrides,
  };
}

test("matched verification atomically records evidence, pays once and writes one event", async (t) => {
  const { sqlite, publicStore, adminStore } = await stores(t);
  const order = orderInput(1);
  await publicStore.create(order);

  const input = verificationInput(order);
  const result = await adminStore.verifyPayment(input);
  assert.equal(result.kind, "verified");
  assert.equal(result.order.status, "paid");
  assert.equal(result.verificationResult, "matched");
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS total FROM payment_verifications").get().total,
    1,
  );
  assert.equal(
    sqlite
      .prepare("SELECT COUNT(*) AS total FROM order_events WHERE next_status = 'paid'")
      .get().total,
    1,
  );
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS total FROM access_grants").get().total,
    0,
  );

  const replay = await adminStore.verifyPayment(input);
  assert.equal(replay.kind, "replayed");
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS total FROM payment_verifications").get().total,
    1,
  );
  assert.equal(
    (
      await adminStore.verifyPayment({
        ...input,
        requestFingerprint: "a".repeat(64),
      })
    ).kind,
    "idempotency_conflict",
  );
});

test("matched verification rejects amount, expiry and stale state before mutation", async (t) => {
  const { sqlite, publicStore, adminStore } = await stores(t);
  const order = orderInput(2);
  await publicStore.create(order);

  assert.equal(
    (
      await adminStore.verifyPayment(
        verificationInput(order, { observedAmountCents: 4800 }),
      )
    ).kind,
    "amount_mismatch",
  );
  assert.equal(
    (
      await adminStore.verifyPayment(
        verificationInput(order, {
          idempotencyKey: "40000000-4000-4000-8000-000000000002",
          requestFingerprint: "b".repeat(64),
          verifiedAt: "2026-08-02T12:00:00.000Z",
        }),
      )
    ).kind,
    "late_payment_requires_review",
  );
  sqlite.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(order.id);
  assert.equal(
    (
      await adminStore.verifyPayment(
        verificationInput(order, {
          idempotencyKey: "40000000-4000-4000-8000-000000000003",
          requestFingerprint: "c".repeat(64),
        }),
      )
    ).kind,
    "invalid_state",
  );
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS total FROM payment_verifications").get().total,
    0,
  );
});

test("needs-review decisions preserve evidence without ever setting paid", async (t) => {
  const { sqlite, publicStore, adminStore } = await stores(t);
  const order = orderInput(3);
  await publicStore.create(order);
  const result = await adminStore.verifyPayment(
    verificationInput(order, {
      decision: "needs_review",
      targetStatus: "needs_review",
      providerReferenceHmac: null,
      providerReferenceHmacVersion: null,
      reasonCode: "missing_reference",
    }),
  );
  assert.equal(result.kind, "verified");
  assert.equal(result.order.status, "needs_review");
  assert.equal(result.verificationResult, "needs_review");
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS total FROM orders WHERE status = 'paid'").get().total,
    0,
  );
});

test("one bank transaction cannot pay two orders", async (t) => {
  const { publicStore, adminStore } = await stores(t);
  const firstOrder = orderInput(4);
  const secondOrder = orderInput(5);
  await publicStore.create(firstOrder);
  await publicStore.create(secondOrder);
  await adminStore.verifyPayment(verificationInput(firstOrder));
  const reused = await adminStore.verifyPayment(
    verificationInput(secondOrder, {
      verificationId: "20000000-4000-4000-8000-000000000002",
      eventId: "30000000-4000-4000-8000-000000000002",
      idempotencyKey: "40000000-4000-4000-8000-000000000002",
      requestFingerprint: "d".repeat(64),
    }),
  );
  assert.equal(reused.kind, "provider_reference_conflict");
});

test("event failure rolls back verification and paid status", async (t) => {
  const { sqlite, publicStore, adminStore } = await stores(t);
  const order = orderInput(6);
  await publicStore.create(order);
  sqlite.exec(`
    CREATE TRIGGER force_verified_event_failure
    BEFORE INSERT ON order_events
    WHEN NEW.reason_code = 'matched_exact'
    BEGIN
      SELECT RAISE(ABORT, 'forced verification event failure');
    END
  `);
  await assert.rejects(
    () => adminStore.verifyPayment(verificationInput(order)),
    /forced verification event failure/,
  );
  assert.equal(
    sqlite.prepare("SELECT status FROM orders WHERE id = ?").get(order.id).status,
    "awaiting_payment",
  );
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS total FROM payment_verifications").get().total,
    0,
  );
});
