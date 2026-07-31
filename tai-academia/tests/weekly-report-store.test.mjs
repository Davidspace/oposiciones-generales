import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";

import { createD1AdminOrderStore } from "../db/admin-orders.ts";
import { createD1PublicOrderStore } from "../db/orders.ts";
import { createD1WeeklyReportStore } from "../db/weekly-report.ts";
import { buildWeeklyReport, parseUtcWeekStart } from "../lib/weekly-report.ts";

const migrationUrls = [
  new URL("../drizzle/0000_flashy_banshee.sql", import.meta.url),
  new URL("../drizzle/0001_cool_scalphunter.sql", import.meta.url),
  new URL("../drizzle/0002_dual_experiments.sql", import.meta.url),
  new URL("../drizzle/0003_ss_professional_bizum_orders.sql", import.meta.url),
  new URL("../drizzle/0004_whatsapp_leads.sql", import.meta.url),
];

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

async function database(t) {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON");
  for (const migrationUrl of migrationUrls) {
    const sql = await readFile(migrationUrl, "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      if (statement.trim()) sqlite.exec(statement);
    }
  }
  t.after(() => sqlite.close());
  return { sqlite, d1: new SQLiteD1Database(sqlite) };
}

test("weekly D1 export aggregates commerce and delivery without PII", async (t) => {
  const { sqlite, d1 } = await database(t);
  const publicStore = createD1PublicOrderStore(d1);
  const adminStore = createD1AdminOrderStore(d1);
  const reportStore = createD1WeeklyReportStore(d1);
  const createdAt = "2026-07-28T09:00:00.000Z";
  const orderId = "00000000-4000-4000-8000-000000000001";
  const reference = "SS-000000000000000000000001";

  for (const [id, session, eventType, at] of [
    ["e1", "10000000-4000-4000-8000-000000000001", "landing_view", createdAt],
    ["e2", "10000000-4000-4000-8000-000000000001", "diagnostic_start", createdAt],
    ["e3", "10000000-4000-4000-8000-000000000001", "diagnostic_complete", createdAt],
    ["e4", "10000000-4000-4000-8000-000000000002", "landing_view", createdAt],
    ["e5", "10000000-4000-4000-8000-000000000003", "landing_view", "2026-08-04T09:00:00.000Z"],
  ]) {
    sqlite
      .prepare(
        `INSERT INTO funnel_events
         (id, session_id, experiment, offer_variant, event_type, created_at)
         VALUES (?, ?, 'ss-casolab', 'academy-full-beta-49-v2', ?, ?)`,
      )
      .run(id, session, eventType, at);
  }
  sqlite
    .prepare(
      `INSERT INTO leads (
         id, experiment, offer_variant, name, whatsapp, contact_key,
         capture_contract, modality, stage, challenge, consent_at,
         whatsapp_consent_at, privacy_version, created_at, updated_at
       ) VALUES (
         'lead-1', 'ss-casolab', 'academy-full-beta-49-v2', 'Persona',
         '+34600000001', 'whatsapp:+34600000001', 'ss-whatsapp-v1',
         'free', 'studying', 'feedback', ?, ?, 'privacy-v1', ?, ?
       )`,
    )
    .run(createdAt, createdAt, createdAt, createdAt);

  await publicStore.create({
    id: orderId,
    reference,
    lookupTokenHash: "1".repeat(64),
    createIdempotencyKey: "20000000-4000-4000-8000-000000000001",
    requestFingerprint: "2".repeat(64),
    productId: "ss-casolab-beta",
    offerVersion: "beta-2026-07",
    amountCents: 4_900,
    currency: "EUR",
    name: "Persona de prueba",
    email: "persona@example.test",
    sessionId: null,
    termsVersion: "terms-v1",
    privacyVersion: "privacy-v1",
    acceptedAt: createdAt,
    expiresAt: "2026-08-01T09:00:00.000Z",
  });
  await publicStore.reportPayment({
    id: "30000000-4000-4000-8000-000000000001",
    orderId,
    idempotencyKey: "40000000-4000-4000-8000-000000000001",
    requestFingerprint: "3".repeat(64),
    createdAt: "2026-07-28T09:05:00.000Z",
  });
  const verification = await adminStore.verifyPayment({
    verificationId: "50000000-4000-4000-8000-000000000001",
    eventId: "60000000-4000-4000-8000-000000000001",
    reference,
    expectedStatus: "payment_reported",
    decision: "matched",
    targetStatus: "paid",
    observedAmountCents: 4_900,
    observedAt: "2026-07-28T09:04:00.000Z",
    providerReferenceHmac: "4".repeat(64),
    providerReferenceHmacVersion: "v1",
    reasonCode: "matched_exact",
    actor: "david",
    idempotencyKey: "70000000-4000-4000-8000-000000000001",
    requestFingerprint: "5".repeat(64),
    verifiedAt: "2026-07-28T09:10:00.000Z",
  });
  assert.equal(verification.kind, "verified");

  sqlite
    .prepare(
      `INSERT INTO access_grants (
         id, order_id, moodle_user_id, course_id, status, provisioned_at,
         provisioned_by, created_at, updated_at
       ) VALUES (
         'access-1', ?, 'moodle-opaque-1', 'course-1', 'provisioned',
         '2026-07-28T09:15:00.000Z', 'david',
         '2026-07-28T09:11:00.000Z', '2026-07-28T09:15:00.000Z'
       )`,
    )
    .run(orderId);
  sqlite
    .prepare(
      `INSERT INTO access_events (
         id, event_id, access_grant_id, previous_status, next_status,
         actor_type, actor_id, reason_code, idempotency_key, created_at
       ) VALUES (
         'ae-1', 'ae-public-1', 'access-1', 'pending', 'provisioned',
         'david', 'david', 'moodle_enrolled', 'ae-key-1',
         '2026-07-28T09:15:00.000Z'
       )`,
    )
    .run();

  const period = parseUtcWeekStart("2026-07-27");
  assert.ok(period);
  const source = await reportStore.readWeek(period);
  const report = buildWeeklyReport(
    period,
    "2026-08-01T12:00:00.000Z",
    source,
  );

  assert.equal(report.funnel.landingSessions, 2);
  assert.equal(report.funnel.diagnosticStarts, 1);
  assert.equal(report.funnel.diagnosticCompletes, 1);
  assert.equal(report.contacts.captured, 1);
  assert.equal(report.commerce.ordersCreated, 1);
  assert.equal(report.commerce.paymentReports, 1);
  assert.equal(report.commerce.paymentsVerified, 1);
  assert.equal(report.commerce.grossRevenueCents, 4_900);
  assert.equal(report.commerce.averageVerificationSeconds, 600);
  assert.equal(report.delivery.accessesProvisioned, 1);
  assert.equal(report.delivery.averageAccessSeconds, 300);
  assert.equal(report.currentReconciliation.paidWithoutActiveAccess, 0);
  assert.doesNotMatch(
    JSON.stringify(report),
    /persona@example|Persona de prueba|\+346|SS-0000|moodle-opaque/i,
  );
});
