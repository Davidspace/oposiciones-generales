import assert from "node:assert/strict";
import test from "node:test";

import { getTableConfig } from "drizzle-orm/sqlite-core";
import * as schema from "../db/schema.ts";
import {
  ACCESS_STATUSES,
  PAYMENT_STATUSES,
} from "../lib/order-state.ts";

const REFUND_STATUSES = ["pending", "completed", "failed"];

function tableConfig(name) {
  assert.ok(schema[name], `${name} must be exported by db/schema.ts`);
  return getTableConfig(schema[name]);
}

function column(config, name) {
  const result = config.columns.find((candidate) => candidate.name === name);
  assert.ok(result, `${config.name}.${name} must exist`);
  return result;
}

function index(config, name) {
  const result = config.indexes.find((candidate) => candidate.config.name === name);
  assert.ok(result, `${config.name}.${name} must exist`);
  return result.config;
}

function assertChecks(config, expectedNames) {
  const names = new Set(config.checks.map(({ name }) => name));
  for (const name of expectedNames) {
    assert.equal(names.has(name), true, `${config.name}.${name} must exist`);
  }
}

test("Drizzle models GSI email and consented SS WhatsApp as separate lead contracts", () => {
  const leads = tableConfig("leads");

  assert.equal(column(leads, "email").notNull, false);
  assert.equal(column(leads, "whatsapp").notNull, false);
  assert.equal(column(leads, "contact_key").notNull, true);
  assert.equal(column(leads, "capture_contract").notNull, true);
  assert.equal(column(leads, "whatsapp_consent_at").notNull, false);
  assert.equal(column(leads, "privacy_version").notNull, false);
  assert.deepEqual(column(leads, "capture_contract").enumValues, [
    "legacy-v1",
    "gsi-email-v1",
    "ss-whatsapp-v1",
  ]);

  const contactIndex = index(leads, "leads_contact_experiment_unique");
  assert.equal(contactIndex.unique, true);
  assertChecks(leads, [
    "leads_capture_contract_check",
    "leads_contact_contract_check",
    "leads_dates_check",
  ]);

  for (const removed of [
    "case_preference",
    "hours_per_week",
    "price_signal",
    "notes",
  ]) {
    assert.equal(
      leads.columns.some(({ name }) => name === removed),
      false,
      `leads.${removed} must not remain in the target schema`,
    );
  }
});

test("Drizzle separates payment status, access status and acceptance evidence", () => {
  const orders = tableConfig("orders");
  const accessGrants = tableConfig("accessGrants");

  assert.deepEqual(column(orders, "status").enumValues, PAYMENT_STATUSES);
  assert.deepEqual(column(accessGrants, "status").enumValues, ACCESS_STATUSES);

  for (const name of [
    "terms_accepted_at",
    "privacy_notice_version",
    "privacy_notice_provided_at",
  ]) {
    assert.equal(column(orders, name).notNull, true);
  }

  for (const name of [
    "digital_start_consent_at",
    "withdrawal_acknowledged_at",
  ]) {
    assert.equal(column(orders, name).notNull, false);
  }

  assert.equal(
    orders.columns.some(({ name }) => name === "consent_at" || name === "privacy_version"),
    false,
  );

  const activeAccessIndex = index(
    accessGrants,
    "access_grants_active_order_unique",
  );
  assert.equal(activeAccessIndex.unique, true);
  assert.ok(activeAccessIndex.where, "the access uniqueness index must be partial");
  assert.equal(
    accessGrants.indexes.some(
      (candidate) => candidate.config.name === "access_grants_order_unique",
    ),
    false,
  );
});

test("Drizzle models idempotent payment reports and versioned HMAC verification", () => {
  const reports = tableConfig("paymentReports");
  const verifications = tableConfig("paymentVerifications");

  assert.equal(column(reports, "idempotency_key").notNull, true);
  assert.equal(column(reports, "request_fingerprint").notNull, true);
  assert.equal(index(reports, "payment_reports_idempotency_unique").unique, true);
  assert.equal(index(reports, "payment_reports_fingerprint_unique").unique, true);

  assert.equal(column(verifications, "provider_reference_hmac").notNull, false);
  assert.equal(column(verifications, "provider_reference_hmac_version").notNull, false);
  assert.equal(column(verifications, "idempotency_key").notNull, true);
  assert.equal(column(verifications, "request_fingerprint").notNull, true);
  assert.equal(
    index(verifications, "payment_verifications_idempotency_unique").unique,
    true,
  );
  assert.equal(
    index(verifications, "payment_verifications_fingerprint_unique").unique,
    true,
  );
  assert.equal(
    index(verifications, "payment_verifications_matched_reference_unique").unique,
    true,
  );
  assert.equal(
    index(verifications, "payment_verifications_matched_order_unique").unique,
    true,
  );
});

test("Drizzle exposes refunds and mandatory idempotent order events", () => {
  const refunds = tableConfig("refunds");
  const events = tableConfig("orderEvents");

  for (const name of [
    "order_id",
    "amount_cents",
    "currency",
    "status",
    "idempotency_key",
    "request_fingerprint",
    "requested_by",
    "requested_at",
  ]) {
    assert.equal(column(refunds, name).notNull, true);
  }

  assert.equal(index(refunds, "refunds_idempotency_unique").unique, true);
  assert.equal(index(refunds, "refunds_fingerprint_unique").unique, true);
  assert.equal(index(refunds, "refunds_completed_order_unique").unique, true);

  assert.deepEqual(column(events, "previous_status").enumValues, PAYMENT_STATUSES);
  assert.deepEqual(column(events, "next_status").enumValues, PAYMENT_STATUSES);
  assert.equal(column(events, "idempotency_key").notNull, true);
});

test("Drizzle gives payment, access and refund aggregates separate typed ledgers", () => {
  const ledgers = [
    {
      config: tableConfig("orderEvents"),
      aggregateColumn: "order_id",
      statuses: PAYMENT_STATUSES,
      eventIndex: "order_events_event_id_unique",
      idempotencyIndex: "order_events_idempotency_unique",
      aggregateIndex: "order_events_order_created_idx",
    },
    {
      config: tableConfig("accessEvents"),
      aggregateColumn: "access_grant_id",
      statuses: ACCESS_STATUSES,
      eventIndex: "access_events_event_id_unique",
      idempotencyIndex: "access_events_idempotency_unique",
      aggregateIndex: "access_events_access_grant_created_idx",
    },
    {
      config: tableConfig("refundEvents"),
      aggregateColumn: "refund_id",
      statuses: REFUND_STATUSES,
      eventIndex: "refund_events_event_id_unique",
      idempotencyIndex: "refund_events_idempotency_unique",
      aggregateIndex: "refund_events_refund_created_idx",
    },
  ];

  for (const {
    config,
    aggregateColumn,
    statuses,
    eventIndex,
    idempotencyIndex,
    aggregateIndex,
  } of ledgers) {
    assert.equal(column(config, "event_id").notNull, true);
    assert.equal(column(config, aggregateColumn).notNull, true);
    assert.equal(column(config, "previous_status").notNull, false);
    assert.equal(column(config, "next_status").notNull, true);
    assert.deepEqual(column(config, "previous_status").enumValues, statuses);
    assert.deepEqual(column(config, "next_status").enumValues, statuses);
    assert.equal(column(config, "actor_type").notNull, true);
    assert.equal(column(config, "actor_id").notNull, false);
    assert.equal(column(config, "reason_code").notNull, false);
    assert.equal(column(config, "metadata_json").notNull, false);
    assert.equal(column(config, "idempotency_key").notNull, true);
    assert.equal(column(config, "created_at").notNull, true);
    assert.equal(index(config, eventIndex).unique, true);
    assert.equal(index(config, idempotencyIndex).unique, true);
    assert.equal(index(config, aggregateIndex).unique, false);
    assert.equal(config.foreignKeys.length, 1);
  }
});

test("Drizzle represents every single-table constraint owned by manual SQL", () => {
  assertChecks(tableConfig("orders"), [
    "orders_status_check",
    "orders_amount_positive_check",
    "orders_currency_eur_check",
    "orders_dates_check",
    "orders_acceptance_dates_check",
  ]);
  assertChecks(tableConfig("paymentReports"), [
    "payment_reports_channel_check",
    "payment_reports_created_at_check",
  ]);
  assertChecks(tableConfig("paymentVerifications"), [
    "payment_verifications_result_check",
    "payment_verifications_verified_by_check",
    "payment_verifications_amount_positive_check",
    "payment_verifications_dates_check",
    "payment_verifications_hmac_pair_check",
    "payment_verifications_matched_hmac_check",
  ]);
  assertChecks(tableConfig("refunds"), [
    "refunds_status_check",
    "refunds_requested_by_check",
    "refunds_verified_by_check",
    "refunds_amount_positive_check",
    "refunds_currency_eur_check",
    "refunds_dates_check",
    "refunds_hmac_pair_check",
    "refunds_completed_verification_check",
    "refunds_completed_hmac_check",
  ]);
  assertChecks(tableConfig("accessGrants"), [
    "access_grants_status_check",
    "access_grants_actors_check",
    "access_grants_dates_check",
    "access_grants_provisioned_at_check",
    "access_grants_revoked_at_check",
  ]);
  assertChecks(tableConfig("orderEvents"), [
    "order_events_previous_status_check",
    "order_events_next_status_check",
    "order_events_actor_type_check",
    "order_events_created_at_check",
    "order_events_distinct_status_check",
  ]);
  assertChecks(tableConfig("accessEvents"), [
    "access_events_previous_status_check",
    "access_events_next_status_check",
    "access_events_actor_type_check",
    "access_events_created_at_check",
    "access_events_distinct_status_check",
  ]);
  assertChecks(tableConfig("refundEvents"), [
    "refund_events_previous_status_check",
    "refund_events_next_status_check",
    "refund_events_actor_type_check",
    "refund_events_created_at_check",
    "refund_events_distinct_status_check",
  ]);
});
