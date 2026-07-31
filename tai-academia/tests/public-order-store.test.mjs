import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { DatabaseSync } from "node:sqlite";
import { createD1PublicOrderStore } from "../db/orders.ts";

const migrationUrls = [
  new URL("../drizzle/0000_flashy_banshee.sql", import.meta.url),
  new URL("../drizzle/0001_cool_scalphunter.sql", import.meta.url),
  new URL("../drizzle/0002_dual_experiments.sql", import.meta.url),
  new URL("../drizzle/0003_ss_professional_bizum_orders.sql", import.meta.url),
];

const NOW = "2026-07-29T12:00:00.000Z";
const LATER = "2026-07-31T12:00:00.000Z";

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
    return {
      success: true,
      meta: { changes: Number(result.changes) },
    };
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

async function migratedStore(t) {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  for (const migrationUrl of migrationUrls) {
    const sql = await readFile(migrationUrl, "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      if (statement.trim()) db.exec(statement);
    }
  }
  t.after(() => db.close());
  return { db, store: createD1PublicOrderStore(new SQLiteD1Database(db)) };
}

function createInput(overrides = {}) {
  return {
    id: "00000000-4000-4000-8000-000000000001",
    reference: "SS-00112233445566778899AABB",
    lookupTokenHash: "a".repeat(64),
    createIdempotencyKey: "10000000-4000-4000-8000-000000000001",
    requestFingerprint: "b".repeat(64),
    productId: "ss-casolab-beta",
    offerVersion: "beta-2026-07",
    amountCents: 4900,
    currency: "EUR",
    name: "Persona de prueba",
    email: "persona@example.test",
    sessionId: null,
    termsVersion: "terms-2026-07",
    privacyVersion: "privacy-2026-07",
    acceptedAt: NOW,
    expiresAt: LATER,
    ...overrides,
  };
}

function reportInput(orderId, overrides = {}) {
  return {
    id: "00000000-4000-4000-8000-000000000002",
    orderId,
    idempotencyKey: "20000000-4000-4000-8000-000000000002",
    requestFingerprint: "c".repeat(64),
    createdAt: NOW,
    ...overrides,
  };
}

test("D1 create batch is atomic and replays one order without storing the lookup token", async (t) => {
  const { db, store } = await migratedStore(t);
  const input = createInput();
  const created = await store.create(input);
  assert.equal(created.kind, "created");
  assert.equal(created.order.status, "awaiting_payment");

  const persisted = db
    .prepare(
      "SELECT lookup_token_hash, amount_cents, currency, status FROM orders WHERE id = ?",
    )
    .get(input.id);
  assert.equal(persisted.lookup_token_hash, input.lookupTokenHash);
  assert.equal(persisted.lookup_token_hash.includes("lookupToken"), false);
  assert.equal(persisted.amount_cents, 4900);
  assert.equal(persisted.currency, "EUR");
  assert.equal(persisted.status, "awaiting_payment");
  assert.equal(
    db.prepare("SELECT COUNT(*) AS total FROM order_events").get().total,
    1,
  );

  const replay = await store.create({
    ...input,
    id: "00000000-4000-4000-8000-000000000099",
    reference: "SS-FFFFFFFFFFFFFFFFFFFFFFFF",
  });
  assert.equal(replay.kind, "replayed");
  assert.equal(replay.order.id, input.id);
  assert.equal(
    db.prepare("SELECT COUNT(*) AS total FROM orders").get().total,
    1,
  );
  assert.equal(
    (
      await store.create({ ...input, requestFingerprint: "d".repeat(64) })
    ).kind,
    "idempotency_conflict",
  );

  assert.equal(
    (await store.findByCredentials(input.reference, input.lookupTokenHash))?.id,
    input.id,
  );
  assert.equal(
    await store.findByCredentials(input.reference, "e".repeat(64)),
    null,
  );
});

test("D1 report batch only moves awaiting_payment to payment_reported and is replay-safe", async (t) => {
  const { db, store } = await migratedStore(t);
  const input = createInput();
  await store.create(input);

  const report = reportInput(input.id);
  const reported = await store.reportPayment(report);
  assert.equal(reported.kind, "reported");
  assert.equal(reported.order.status, "payment_reported");
  assert.notEqual(reported.order.status, "paid");
  assert.equal(
    db.prepare("SELECT COUNT(*) AS total FROM payment_reports").get().total,
    1,
  );
  assert.equal(
    db
      .prepare(
        "SELECT COUNT(*) AS total FROM order_events WHERE next_status = 'payment_reported'",
      )
      .get().total,
    1,
  );

  const replay = await store.reportPayment(report);
  assert.equal(replay.kind, "replayed");
  const sameFingerprint = await store.reportPayment({
    ...report,
    id: "00000000-4000-4000-8000-000000000003",
    idempotencyKey: "30000000-4000-4000-8000-000000000003",
  });
  assert.equal(sameFingerprint.kind, "replayed");
  assert.equal(
    db.prepare("SELECT COUNT(*) AS total FROM payment_reports").get().total,
    1,
  );
  assert.equal(
    (
      await store.reportPayment({
        ...report,
        requestFingerprint: "f".repeat(64),
      })
    ).kind,
    "idempotency_conflict",
  );
});

test("D1 conditional report leaves expired and non-awaiting orders untouched", async (t) => {
  const { db, store } = await migratedStore(t);
  const input = createInput({
    acceptedAt: "2026-07-28T12:00:00.000Z",
    expiresAt: "2026-07-29T11:00:00.000Z",
  });
  await store.create(input);
  const result = await store.reportPayment(reportInput(input.id));
  assert.equal(result.kind, "invalid_state");
  assert.equal(result.order.status, "awaiting_payment");
  assert.equal(
    db.prepare("SELECT COUNT(*) AS total FROM payment_reports").get().total,
    0,
  );
  assert.equal(
    db
      .prepare(
        "SELECT COUNT(*) AS total FROM order_events WHERE next_status = 'payment_reported'",
      )
      .get().total,
    0,
  );
});

test("a failure in the D1 report batch rolls back report, status and event together", async (t) => {
  const { db, store } = await migratedStore(t);
  const input = createInput();
  await store.create(input);
  db.exec(`
    CREATE TRIGGER force_payment_report_event_failure
    BEFORE INSERT ON order_events
    WHEN NEW.reason_code = 'buyer_reported_payment'
    BEGIN
      SELECT RAISE(ABORT, 'forced event failure');
    END
  `);

  await assert.rejects(
    () => store.reportPayment(reportInput(input.id)),
    /forced event failure/,
  );
  assert.equal(
    db.prepare("SELECT status FROM orders WHERE id = ?").get(input.id).status,
    "awaiting_payment",
  );
  assert.equal(
    db.prepare("SELECT COUNT(*) AS total FROM payment_reports").get().total,
    0,
  );
  assert.equal(
    db
      .prepare(
        "SELECT COUNT(*) AS total FROM order_events WHERE next_status = 'payment_reported'",
      )
      .get().total,
    0,
  );
});
