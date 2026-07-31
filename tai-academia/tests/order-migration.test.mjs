import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { DatabaseSync } from "node:sqlite";
import {
  ACCESS_STATUSES,
  PAYMENT_STATUSES,
} from "../lib/order-state.ts";

const REFUND_STATUSES = ["pending", "completed", "failed"];
const leadMigrationUrl = new URL(
  "../drizzle/0004_whatsapp_leads.sql",
  import.meta.url,
);

const migrationUrls = [
  new URL("../drizzle/0000_flashy_banshee.sql", import.meta.url),
  new URL("../drizzle/0001_cool_scalphunter.sql", import.meta.url),
  new URL("../drizzle/0002_dual_experiments.sql", import.meta.url),
  new URL("../drizzle/0003_ss_professional_bizum_orders.sql", import.meta.url),
  leadMigrationUrl,
];

const OMIT = Symbol("omit");
const NOW = "2026-07-29T10:00:00.000Z";
const LATER = "2026-07-30T10:00:00.000Z";

async function applyMigrations(db, urls) {
  for (const migrationUrl of urls) {
    const sql = await readFile(migrationUrl, "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      if (statement.trim()) db.exec(statement);
    }
  }
}

async function migratedDatabase(t) {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON");

  await applyMigrations(db, migrationUrls);

  t.after(() => db.close());
  return db;
}

function insertRow(db, table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== OMIT);
  const columns = entries.map(([name]) => `\`${name}\``).join(", ");
  const placeholders = entries.map(() => "?").join(", ");
  return db
    .prepare(`INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`)
    .run(...entries.map(([, value]) => value));
}

function insertGsiLead(db, id, overrides = {}) {
  const email = `${id}@example.test`;
  return insertRow(db, "leads", {
    id,
    experiment: "gsi-caso-0",
    offer_variant: "gsi-baseline",
    name: "Persona GSI",
    email,
    whatsapp: null,
    contact_key: `email:${email}`,
    capture_contract: "gsi-email-v1",
    modality: "free",
    stage: "studying",
    challenge: "structure",
    consent_at: NOW,
    whatsapp_consent_at: null,
    privacy_version: null,
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  });
}

function insertSsLead(db, id, overrides = {}) {
  const whatsapp = "+34600000001";
  return insertRow(db, "leads", {
    id,
    experiment: "ss-casolab",
    offer_variant: "academy-beta-49-v1",
    name: "Persona SS",
    email: null,
    whatsapp,
    contact_key: `whatsapp:${whatsapp}`,
    capture_contract: "ss-whatsapp-v1",
    modality: "free",
    stage: "practicing",
    challenge: "feedback",
    consent_at: NOW,
    whatsapp_consent_at: NOW,
    privacy_version: "privacy-2026-07",
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  });
}

function insertOrder(db, id, overrides = {}) {
  return insertRow(db, "orders", {
    id,
    reference: `REF-${id}`,
    lookup_token_hash: `lookup-${id}`,
    create_idempotency_key: `create-${id}`,
    product_id: "ss-beta",
    offer_version: "v1",
    amount_cents: 4900,
    currency: "EUR",
    name: "Persona de prueba",
    email: `${id}@example.test`,
    status: "awaiting_payment",
    terms_version: "terms-v1",
    terms_accepted_at: NOW,
    privacy_notice_version: "privacy-v1",
    privacy_notice_provided_at: NOW,
    expires_at: LATER,
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  });
}

function insertAccess(db, id, orderId, overrides = {}) {
  return insertRow(db, "access_grants", {
    id,
    order_id: orderId,
    course_id: "ss-course",
    status: "pending",
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  });
}

function insertReport(db, id, orderId, overrides = {}) {
  return insertRow(db, "payment_reports", {
    id,
    order_id: orderId,
    channel: "whatsapp",
    idempotency_key: `report-key-${id}`,
    request_fingerprint: `report-fingerprint-${id}`,
    created_at: NOW,
    ...overrides,
  });
}

function insertVerification(db, id, orderId, overrides = {}) {
  return insertRow(db, "payment_verifications", {
    id,
    order_id: orderId,
    provider_reference_hmac: `hmac-${id}`,
    provider_reference_hmac_version: "hmac-sha256-v1",
    observed_amount_cents: 4900,
    observed_at: NOW,
    result: "matched",
    verified_by: "david",
    verified_at: NOW,
    idempotency_key: `verification-key-${id}`,
    request_fingerprint: `verification-fingerprint-${id}`,
    ...overrides,
  });
}

function insertRefund(db, id, orderId, overrides = {}) {
  return insertRow(db, "refunds", {
    id,
    order_id: orderId,
    amount_cents: 4900,
    currency: "EUR",
    status: "pending",
    idempotency_key: `refund-key-${id}`,
    request_fingerprint: `refund-fingerprint-${id}`,
    requested_by: "david",
    requested_at: NOW,
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  });
}

function insertAccessEvent(db, id, accessGrantId, overrides = {}) {
  return insertRow(db, "access_events", {
    id,
    event_id: `access-event-${id}`,
    access_grant_id: accessGrantId,
    previous_status: null,
    next_status: "pending",
    actor_type: "system",
    actor_id: "access-worker",
    idempotency_key: `access-event-key-${id}`,
    metadata_json: "{}",
    created_at: NOW,
    ...overrides,
  });
}

function insertRefundEvent(db, id, refundId, overrides = {}) {
  return insertRow(db, "refund_events", {
    id,
    event_id: `refund-event-${id}`,
    refund_id: refundId,
    previous_status: null,
    next_status: "pending",
    actor_type: "david",
    actor_id: "david",
    idempotency_key: `refund-event-key-${id}`,
    metadata_json: "{}",
    created_at: NOW,
    ...overrides,
  });
}

test("0000 through 0004 apply in explicit order to a fresh SQLite database", async (t) => {
  const db = await migratedDatabase(t);
  const tables = new Set(
    db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all()
      .map(({ name }) => name),
  );

  for (const table of [
    "leads",
    "funnel_events",
    "orders",
    "payment_reports",
    "payment_verifications",
    "refunds",
    "access_grants",
    "order_events",
    "access_events",
    "refund_events",
  ]) {
    assert.equal(tables.has(table), true, `${table} was not migrated`);
  }

  const forbiddenColumns = new Set(["pin", "iban", "card_number", "screenshot"]);
  for (const table of tables) {
    for (const { name } of db.prepare(`PRAGMA table_info(\`${table}\`)`).all()) {
      assert.equal(forbiddenColumns.has(name), false, `${table}.${name} is forbidden`);
    }
  }

  const leadColumns = new Set(
    db.prepare("PRAGMA table_info(`leads`)").all().map(({ name }) => name),
  );
  for (const removed of [
    "case_preference",
    "hours_per_week",
    "price_signal",
    "notes",
  ]) {
    assert.equal(leadColumns.has(removed), false, `leads.${removed} was retired`);
  }
  for (const required of [
    "contact_key",
    "capture_contract",
    "whatsapp_consent_at",
    "privacy_version",
  ]) {
    assert.equal(leadColumns.has(required), true, `leads.${required} was not migrated`);
  }
});

test("0004 preserves legacy lead rows without inventing WhatsApp consent", async (t) => {
  const migrationSql = await readFile(leadMigrationUrl, "utf8");
  assert.doesNotMatch(
    migrationSql,
    /\b(?:BEGIN(?:\s+TRANSACTION|\s+IMMEDIATE)?|COMMIT)\b/i,
    "D1 owns the transaction used by --file and rejects nested transactions",
  );

  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  t.after(() => db.close());

  await applyMigrations(db, migrationUrls.slice(0, 4));
  insertRow(db, "leads", {
    id: "legacy-gsi",
    experiment: "gsi-caso-0",
    offer_variant: "legacy-290",
    name: "Lead GSI heredado",
    email: "gsi-legacy@example.test",
    whatsapp: null,
    modality: "internal",
    stage: "studying",
    challenge: "structure",
    case_preference: "diagnostic",
    hours_per_week: "5-10",
    price_signal: "not-asked",
    notes: "dato que se retira",
    utm_source: "community",
    consent_at: "legacy-unparsed-consent",
    created_at: "legacy-unparsed-created",
    updated_at: "legacy-unparsed-updated",
  });
  insertRow(db, "leads", {
    id: "legacy-ss",
    experiment: "ss-casolab",
    offer_variant: "academy-beta-49-v1",
    name: "Lead SS heredado",
    email: "ss-legacy@example.test",
    whatsapp: "+34600000999",
    modality: "free",
    stage: "practicing",
    challenge: "feedback",
    case_preference: "diagnostic",
    price_signal: "not-asked",
    consent_at: NOW,
    created_at: NOW,
    updated_at: NOW,
  });

  await applyMigrations(db, [leadMigrationUrl]);

  assert.deepEqual(
    db
      .prepare(
        "SELECT id, experiment, email, whatsapp, contact_key, capture_contract, whatsapp_consent_at, privacy_version, utm_source FROM leads ORDER BY id",
      )
      .all()
      .map((row) => ({ ...row })),
    [
      {
        id: "legacy-gsi",
        experiment: "gsi-caso-0",
        email: "gsi-legacy@example.test",
        whatsapp: null,
        contact_key: "legacy:legacy-gsi",
        capture_contract: "legacy-v1",
        whatsapp_consent_at: null,
        privacy_version: null,
        utm_source: "community",
      },
      {
        id: "legacy-ss",
        experiment: "ss-casolab",
        email: "ss-legacy@example.test",
        whatsapp: "+34600000999",
        contact_key: "legacy:legacy-ss",
        capture_contract: "legacy-v1",
        whatsapp_consent_at: null,
        privacy_version: null,
        utm_source: null,
      },
    ],
  );
});

test("new lead contracts enforce GSI email and consented SS WhatsApp", async (t) => {
  const db = await migratedDatabase(t);

  insertGsiLead(db, "gsi-valid");
  insertSsLead(db, "ss-valid");

  assert.throws(
    () => insertGsiLead(db, "gsi-without-email", { email: null }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertSsLead(db, "ss-without-consent", {
        whatsapp_consent_at: null,
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertSsLead(db, "ss-without-privacy", {
        privacy_version: null,
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertSsLead(db, "ss-bad-phone", {
        whatsapp: "34600000001",
        contact_key: "whatsapp:34600000001",
      }),
    /constraint/i,
  );
  assert.throws(
    () => insertSsLead(db, "ss-duplicate-contact"),
    /unique/i,
  );
});

test("orders accept only payment states and valid commercial values", async (t) => {
  const db = await migratedDatabase(t);

  for (const [position, status] of PAYMENT_STATUSES.entries()) {
    if (status === "refunded") continue;
    insertOrder(db, `status-${position}`, { status });
  }

  assert.throws(
    () => insertOrder(db, "refunded-without-operation", { status: "refunded" }),
    /completed refund/i,
  );

  for (const status of ACCESS_STATUSES) {
    assert.throws(
      () => insertOrder(db, `access-${status}`, { status }),
      /constraint/i,
    );
  }

  assert.throws(() => insertOrder(db, "zero", { amount_cents: 0 }), /constraint/i);
  assert.throws(() => insertOrder(db, "usd", { currency: "USD" }), /constraint/i);
  assert.throws(
    () => insertOrder(db, "expired-before-create", { expires_at: NOW }),
    /constraint/i,
  );
  assert.throws(
    () => insertOrder(db, "bad-date", { created_at: "not-a-date" }),
    /constraint/i,
  );
  assert.throws(
    () => insertOrder(db, "without-terms", { terms_accepted_at: OMIT }),
    /constraint/i,
  );
  assert.throws(
    () => insertOrder(db, "without-privacy", { privacy_notice_provided_at: OMIT }),
    /constraint/i,
  );

  insertOrder(db, "optional-consents", {
    digital_start_consent_at: null,
    withdrawal_acknowledged_at: null,
  });

  const orderColumns = new Map(
    db.prepare("PRAGMA table_info(`orders`)").all().map((info) => [info.name, info]),
  );
  assert.equal(orderColumns.get("terms_accepted_at").notnull, 1);
  assert.equal(orderColumns.get("privacy_notice_provided_at").notnull, 1);
  assert.equal(orderColumns.get("digital_start_consent_at").notnull, 0);
  assert.equal(orderColumns.get("withdrawal_acknowledged_at").notnull, 0);
  assert.equal(orderColumns.has("consent_at"), false);
  assert.equal(orderColumns.has("privacy_version"), false);
});

test("payment reports require two independent unique replay guards", async (t) => {
  const db = await migratedDatabase(t);
  insertOrder(db, "report-order");

  insertReport(db, "one", "report-order");
  assert.throws(
    () =>
      insertReport(db, "duplicate-key", "report-order", {
        idempotency_key: "report-key-one",
      }),
    /unique/i,
  );
  assert.throws(
    () =>
      insertReport(db, "duplicate-fingerprint", "report-order", {
        request_fingerprint: "report-fingerprint-one",
      }),
    /unique/i,
  );
  assert.throws(
    () => insertReport(db, "missing-key", "report-order", { idempotency_key: OMIT }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertReport(db, "missing-fingerprint", "report-order", {
        request_fingerprint: OMIT,
      }),
    /constraint/i,
  );
});

test("a matched provider reference and order can each be consumed only once", async (t) => {
  const db = await migratedDatabase(t);
  insertOrder(db, "verification-one");
  insertOrder(db, "verification-two");
  insertVerification(db, "one", "verification-one");

  insertVerification(db, "review-one", "verification-one", {
    provider_reference_hmac: "hmac-one",
    result: "needs_review",
  });
  insertVerification(db, "review-two", "verification-two", {
    provider_reference_hmac: "hmac-one",
    result: "needs_review",
  });

  assert.throws(
    () =>
      insertVerification(db, "same-reference", "verification-two", {
        provider_reference_hmac: "hmac-one",
      }),
    /unique/i,
  );
  assert.throws(
    () => insertVerification(db, "same-order", "verification-one"),
    /unique/i,
  );
  assert.throws(
    () =>
      insertVerification(db, "missing-hmac", "verification-two", {
        provider_reference_hmac: null,
        provider_reference_hmac_version: null,
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertVerification(db, "missing-version", "verification-two", {
        provider_reference_hmac_version: null,
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertVerification(db, "zero-observed", "verification-two", {
        observed_amount_cents: 0,
      }),
    /constraint/i,
  );
});

test("payment verifications require independent idempotency and fingerprint guards", async (t) => {
  const db = await migratedDatabase(t);
  insertOrder(db, "verification-replay");
  insertVerification(db, "original", "verification-replay", {
    result: "needs_review",
  });

  assert.throws(
    () =>
      insertVerification(db, "missing-fingerprint", "verification-replay", {
        request_fingerprint: OMIT,
        result: "needs_review",
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertVerification(db, "same-key-different-payload", "verification-replay", {
        idempotency_key: "verification-key-original",
        request_fingerprint: "different-payload-fingerprint",
        observed_amount_cents: 5100,
        result: "needs_review",
      }),
    /unique/i,
  );
  assert.throws(
    () =>
      insertVerification(db, "same-payload-different-key", "verification-replay", {
        idempotency_key: "different-verification-key",
        request_fingerprint: "verification-fingerprint-original",
        result: "needs_review",
      }),
    /unique/i,
  );
});

test("active access can bridge refund review and only one grant is active", async (t) => {
  const db = await migratedDatabase(t);
  insertOrder(db, "access-order");

  assert.throws(
    () => insertAccess(db, "too-early", "access-order"),
    /paid order/i,
  );
  insertAccess(db, "failed-access", "access-order", { status: "failed" });
  assert.throws(
    () =>
      db
        .prepare("UPDATE access_grants SET status = 'pending' WHERE id = ?")
        .run("failed-access"),
    /paid order/i,
  );
  db.prepare("DELETE FROM access_grants WHERE id = ?").run("failed-access");

  db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run("access-order");
  insertAccess(db, "access", "access-order");
  assert.throws(
    () => insertAccess(db, "second-active", "access-order"),
    /unique/i,
  );

  db.prepare("UPDATE orders SET status = 'refund_pending' WHERE id = ?").run("access-order");
  assert.equal(
    db.prepare("SELECT status FROM access_grants WHERE id = ?").get("access").status,
    "pending",
  );
  assert.throws(
    () => db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run("access-order"),
    /active access/i,
  );

  db.prepare(
    "UPDATE access_grants SET status = 'revoked', revoked_at = ?, revoked_by = 'system', updated_at = ? WHERE id = ?",
  ).run(NOW, NOW, "access");
  db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run("access-order");
  insertAccess(db, "replacement-access", "access-order");

  const grants = db
    .prepare("SELECT id, status FROM access_grants WHERE order_id = ? ORDER BY id")
    .all("access-order")
    .map((row) => ({ ...row }));
  assert.deepEqual(grants, [
    { id: "access", status: "revoked" },
    { id: "replacement-access", status: "pending" },
  ]);
});

test("a failed refund preserves active access and does not deadlock recovery", async (t) => {
  const db = await migratedDatabase(t);
  insertOrder(db, "failed-refund-order", { status: "paid" });
  insertAccess(db, "continuous-access", "failed-refund-order");
  insertRefund(db, "failed-refund", "failed-refund-order");

  db.exec("BEGIN");
  db.prepare("UPDATE orders SET status = 'refund_pending' WHERE id = ?").run(
    "failed-refund-order",
  );
  db.prepare(
    "UPDATE refunds SET status = 'failed', reason_code = 'provider_rejected', updated_at = ? WHERE id = ?",
  ).run(NOW, "failed-refund");
  db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run(
    "failed-refund-order",
  );
  db.exec("COMMIT");

  assert.deepEqual(
    {
      ...db
      .prepare(
        "SELECT orders.status AS order_status, access_grants.status AS access_status FROM orders JOIN access_grants ON access_grants.order_id = orders.id WHERE orders.id = ?",
      )
      .get("failed-refund-order"),
    },
    { order_status: "paid", access_status: "pending" },
  );

  insertOrder(db, "revoked-recovery-order", { status: "paid" });
  insertAccess(db, "revoked-before-failure", "revoked-recovery-order");
  insertRefund(db, "second-failed-refund", "revoked-recovery-order");
  db.prepare("UPDATE orders SET status = 'refund_pending' WHERE id = ?").run(
    "revoked-recovery-order",
  );
  db.prepare(
    "UPDATE access_grants SET status = 'revoked', revoked_at = ?, revoked_by = 'alba', updated_at = ? WHERE id = ?",
  ).run(NOW, NOW, "revoked-before-failure");
  db.prepare(
    "UPDATE refunds SET status = 'failed', reason_code = 'provider_rejected', updated_at = ? WHERE id = ?",
  ).run(NOW, "second-failed-refund");
  db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run(
    "revoked-recovery-order",
  );
  insertAccess(db, "recovered-access", "revoked-recovery-order");

  assert.deepEqual(
    db
      .prepare(
        "SELECT id, status FROM access_grants WHERE order_id = ? ORDER BY id",
      )
      .all("revoked-recovery-order")
      .map((row) => ({ ...row })),
    [
      { id: "recovered-access", status: "pending" },
      { id: "revoked-before-failure", status: "revoked" },
    ],
  );
});

test("refund completion is atomic and requires no active access", async (t) => {
  const db = await migratedDatabase(t);
  insertOrder(db, "refund-order", { status: "paid" });
  insertAccess(db, "refund-access", "refund-order", {
    status: "provisioned",
    provisioned_at: NOW,
    provisioned_by: "system",
  });
  insertRefund(db, "refund", "refund-order");

  assert.throws(
    () =>
      insertRefund(db, "duplicate-refund-key", "refund-order", {
        idempotency_key: "refund-key-refund",
      }),
    /unique/i,
  );
  assert.throws(
    () =>
      insertRefund(db, "duplicate-refund-fingerprint", "refund-order", {
        request_fingerprint: "refund-fingerprint-refund",
      }),
    /unique/i,
  );
  db.exec("BEGIN");
  db.prepare("UPDATE orders SET status = 'refund_pending' WHERE id = ?").run(
    "refund-order",
  );
  assert.throws(
    () =>
      db
        .prepare(
          "UPDATE refunds SET status = 'completed', provider_reference_hmac = ?, provider_reference_hmac_version = 'hmac-sha256-v1', verified_by = 'alba', verified_at = ?, updated_at = ? WHERE id = ?",
        )
        .run("refund-hmac-active", NOW, NOW, "refund"),
    /active access/i,
  );
  db.exec("ROLLBACK");

  assert.equal(
    db.prepare("SELECT status FROM orders WHERE id = ?").get("refund-order").status,
    "paid",
  );
  assert.equal(
    db.prepare("SELECT status FROM refunds WHERE id = ?").get("refund").status,
    "pending",
  );

  db.exec("BEGIN");
  db.prepare("UPDATE orders SET status = 'refund_pending' WHERE id = ?").run(
    "refund-order",
  );
  db.prepare(
    "UPDATE access_grants SET status = 'revoked', revoked_at = ?, revoked_by = 'alba', updated_at = ? WHERE id = ?",
  ).run(NOW, NOW, "refund-access");
  db.prepare(
    "UPDATE refunds SET status = 'completed', provider_reference_hmac = ?, provider_reference_hmac_version = 'hmac-sha256-v1', verified_by = 'alba', verified_at = ?, updated_at = ? WHERE id = ?",
  ).run("refund-hmac-completed", NOW, NOW, "refund");
  db.prepare("UPDATE orders SET status = 'refunded' WHERE id = ?").run(
    "refund-order",
  );
  db.exec("COMMIT");

  assert.equal(
    db.prepare("SELECT status FROM orders WHERE id = ?").get("refund-order").status,
    "refunded",
  );
  assert.throws(
    () => db.prepare("DELETE FROM refunds WHERE id = ?").run("refund"),
    /completed refund/i,
  );
  assert.throws(
    () => db.prepare("UPDATE refunds SET status = 'failed' WHERE id = ?").run("refund"),
    /completed refund/i,
  );

  insertOrder(db, "refund-without-access", { status: "paid" });
  insertRefund(db, "no-access-refund", "refund-without-access");
  db.prepare("UPDATE orders SET status = 'refund_pending' WHERE id = ?").run(
    "refund-without-access",
  );
  db.prepare(
    "UPDATE refunds SET status = 'completed', provider_reference_hmac = ?, provider_reference_hmac_version = 'hmac-sha256-v1', verified_by = 'david', verified_at = ?, updated_at = ? WHERE id = ?",
  ).run("refund-hmac-no-access", NOW, NOW, "no-access-refund");
  db.prepare("UPDATE orders SET status = 'refunded' WHERE id = ?").run(
    "refund-without-access",
  );
  assert.equal(
    db
      .prepare("SELECT COUNT(*) AS total FROM access_grants WHERE order_id = ?")
      .get("refund-without-access").total,
    0,
  );

  insertOrder(db, "completed-before-order-update", { status: "paid" });
  insertRefund(db, "completed-refund", "completed-before-order-update", {
    status: "completed",
    provider_reference_hmac: "refund-hmac-precompleted",
    provider_reference_hmac_version: "hmac-sha256-v1",
    verified_by: "david",
    verified_at: NOW,
  });
  assert.throws(
    () => insertAccess(db, "active-after-completion", "completed-before-order-update"),
    /completed refund/i,
  );
});

test("order events accept only payment states and are append-only", async (t) => {
  const db = await migratedDatabase(t);
  insertOrder(db, "event-order");

  insertRow(db, "order_events", {
    id: "event-row",
    event_id: "event-public-id",
    order_id: "event-order",
    previous_status: "draft",
    next_status: "awaiting_payment",
    actor_type: "system",
    idempotency_key: "event-idempotency",
    created_at: NOW,
  });

  assert.throws(
    () =>
      insertRow(db, "order_events", {
        id: "invalid-state",
        event_id: "invalid-state-event",
        order_id: "event-order",
        previous_status: "awaiting_payment",
        next_status: "access_provisioned",
        actor_type: "system",
        idempotency_key: "invalid-state-key",
        created_at: NOW,
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertRow(db, "order_events", {
        id: "missing-idempotency",
        event_id: "missing-idempotency-event",
        order_id: "event-order",
        previous_status: "awaiting_payment",
        next_status: "payment_reported",
        actor_type: "buyer",
        idempotency_key: OMIT,
        created_at: NOW,
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertRow(db, "order_events", {
        id: "duplicate-idempotency",
        event_id: "duplicate-idempotency-event",
        order_id: "event-order",
        previous_status: "awaiting_payment",
        next_status: "payment_reported",
        actor_type: "buyer",
        idempotency_key: "event-idempotency",
        created_at: NOW,
      }),
    /unique/i,
  );
  assert.throws(
    () =>
      insertRow(db, "order_events", {
        id: "same-state",
        event_id: "same-state-event",
        order_id: "event-order",
        previous_status: "awaiting_payment",
        next_status: "awaiting_payment",
        actor_type: "david",
        idempotency_key: "same-state-key",
        created_at: NOW,
      }),
    /constraint/i,
  );
  assert.throws(
    () => db.prepare("UPDATE order_events SET reason_code = 'changed' WHERE id = ?").run("event-row"),
    /append-only/i,
  );
  assert.throws(
    () => db.prepare("DELETE FROM order_events WHERE id = ?").run("event-row"),
    /append-only/i,
  );
});

test("access and refund ledgers are typed, idempotent, aggregate-owned and append-only", async (t) => {
  const db = await migratedDatabase(t);
  insertOrder(db, "ledger-order", { status: "paid" });
  insertAccess(db, "ledger-access", "ledger-order");
  insertRefund(db, "ledger-refund", "ledger-order");

  for (const [position, status] of ACCESS_STATUSES.entries()) {
    insertAccessEvent(db, `status-${position}`, "ledger-access", {
      next_status: status,
    });
  }
  for (const [position, status] of REFUND_STATUSES.entries()) {
    insertRefundEvent(db, `status-${position}`, "ledger-refund", {
      next_status: status,
    });
  }

  assert.throws(
    () =>
      insertAccessEvent(db, "payment-state", "ledger-access", {
        next_status: "paid",
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertRefundEvent(db, "access-state", "ledger-refund", {
        previous_status: "provisioned",
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertAccessEvent(db, "same-state", "ledger-access", {
        previous_status: "pending",
        next_status: "pending",
      }),
    /constraint/i,
  );
  assert.throws(
    () =>
      insertRefundEvent(db, "bad-actor", "ledger-refund", {
        actor_type: "buyer",
      }),
    /constraint/i,
  );
  assert.throws(
    () => insertAccessEvent(db, "orphan", "missing-access"),
    /foreign key/i,
  );
  assert.throws(
    () => insertRefundEvent(db, "orphan", "missing-refund"),
    /foreign key/i,
  );

  assert.throws(
    () =>
      insertAccessEvent(db, "duplicate-event-id", "ledger-access", {
        event_id: "access-event-status-0",
      }),
    /unique/i,
  );
  assert.throws(
    () =>
      insertAccessEvent(db, "duplicate-key", "ledger-access", {
        idempotency_key: "access-event-key-status-0",
      }),
    /unique/i,
  );
  assert.throws(
    () =>
      insertRefundEvent(db, "duplicate-event-id", "ledger-refund", {
        event_id: "refund-event-status-0",
      }),
    /unique/i,
  );
  assert.throws(
    () =>
      insertRefundEvent(db, "duplicate-key", "ledger-refund", {
        idempotency_key: "refund-event-key-status-0",
      }),
    /unique/i,
  );

  assert.throws(
    () =>
      db
        .prepare("UPDATE access_events SET reason_code = 'changed' WHERE id = ?")
        .run("status-0"),
    /append-only/i,
  );
  assert.throws(
    () => db.prepare("DELETE FROM access_events WHERE id = ?").run("status-0"),
    /append-only/i,
  );
  assert.throws(
    () =>
      db
        .prepare("UPDATE refund_events SET reason_code = 'changed' WHERE id = ?")
        .run("status-0"),
    /append-only/i,
  );
  assert.throws(
    () => db.prepare("DELETE FROM refund_events WHERE id = ?").run("status-0"),
    /append-only/i,
  );
});
