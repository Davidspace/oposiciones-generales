import assert from "node:assert/strict";
import test from "node:test";

import {
  aggregateSupportMetrics,
  parseSupportRecord,
} from "../lib/support-metrics.ts";

function validRecord(overrides = {}) {
  return {
    incidentId: "SUP-0000000001",
    category: "content",
    openedAt: "2026-07-27T09:00:00.000Z",
    dueAt: "2026-07-30T09:00:00.000Z",
    firstResponseAt: "2026-07-28T09:00:00.000Z",
    closedAt: "2026-07-28T09:30:00.000Z",
    messagesCount: 2,
    minutesSpent: 30,
    escalatedTo: "none",
    outcome: "resolved_self_service",
    extraordinary: false,
    assetId: "S03@1.0.0",
    ...overrides,
  };
}

test("support records accept only bounded operational data", () => {
  const parsed = parseSupportRecord(validRecord());
  assert.equal(parsed.kind, "valid");
  assert.equal(parsed.record.category, "content");
  assert.equal(parsed.record.minutesSpent, 30);

  for (const forbidden of [
    { messageText: "Copia del chat" },
    { email: "persona@example.test" },
    { whatsapp: "+34600000000" },
    { orderReference: "SS-00112233445566778899AABB" },
  ]) {
    assert.equal(
      parseSupportRecord({ ...validRecord(), ...forbidden }).kind,
      "invalid",
    );
  }
});

test("support records reject incoherent dates and completion states", () => {
  assert.equal(
    parseSupportRecord(
      validRecord({ dueAt: "2026-07-26T09:00:00.000Z" }),
    ).kind,
    "invalid",
  );
  assert.equal(
    parseSupportRecord(validRecord({ closedAt: null, outcome: "resolved_operator" }))
      .kind,
    "invalid",
  );
  assert.equal(
    parseSupportRecord(validRecord({ closedAt: null, outcome: "pending" })).kind,
    "valid",
  );
});

test("support metrics expose SLA and owner load without returning raw records", () => {
  const records = [
    validRecord(),
    validRecord({
      incidentId: "SUP-0000000002",
      category: "access",
      firstResponseAt: "2026-07-31T09:00:00.000Z",
      closedAt: "2026-07-31T10:00:00.000Z",
      minutesSpent: 60,
      messagesCount: 4,
      escalatedTo: "david",
      outcome: "access_restored",
      assetId: null,
    }),
    validRecord({
      incidentId: "SUP-0000000003",
      category: "payment",
      firstResponseAt: null,
      closedAt: null,
      minutesSpent: 45,
      messagesCount: 1,
      escalatedTo: "external",
      outcome: "pending",
      extraordinary: true,
      assetId: null,
    }),
    validRecord({
      incidentId: "SUP-0000000004",
      openedAt: "2026-08-03T00:00:00.000Z",
      dueAt: "2026-08-06T00:00:00.000Z",
      firstResponseAt: null,
      closedAt: null,
      minutesSpent: 240,
      messagesCount: 8,
      outcome: "pending",
      assetId: null,
    }),
  ].map((record) => {
    const parsed = parseSupportRecord(record);
    assert.equal(parsed.kind, "valid");
    return parsed.record;
  });

  const metrics = aggregateSupportMetrics(records, {
    periodStart: "2026-07-27T00:00:00.000Z",
    periodEnd: "2026-08-03T00:00:00.000Z",
    asOf: "2026-08-01T12:00:00.000Z",
    activeStudents: 50,
  });

  assert.equal(metrics.tickets, 3);
  assert.equal(metrics.messages, 7);
  assert.equal(metrics.standardMinutes, 90);
  assert.equal(metrics.extraordinaryMinutes, 45);
  assert.equal(metrics.sla.respondedOnTime, 1);
  assert.equal(metrics.sla.respondedLate, 1);
  assert.equal(metrics.sla.openOverdue, 1);
  assert.equal(metrics.escalations.total, 2);
  assert.equal(metrics.byCategory.access.minutes, 60);
  assert.equal(metrics.hoursPer100ActiveStudents, 3);
  assert.equal(metrics.supportLimitExceeded, false);
  assert.equal("records" in metrics, false);
});

test("support metrics reject duplicate incident ids", () => {
  const parsed = parseSupportRecord(validRecord());
  assert.equal(parsed.kind, "valid");
  assert.throws(
    () =>
      aggregateSupportMetrics([parsed.record, parsed.record], {
        periodStart: "2026-07-27T00:00:00.000Z",
        periodEnd: "2026-08-03T00:00:00.000Z",
        asOf: "2026-08-01T12:00:00.000Z",
        activeStudents: 50,
      }),
    /duplicado/,
  );
});

test("support load is not inferred when Moodle has no active-student count", () => {
  const parsed = parseSupportRecord(validRecord({ minutesSpent: 300 }));
  assert.equal(parsed.kind, "valid");
  const metrics = aggregateSupportMetrics([parsed.record], {
    periodStart: "2026-07-27T00:00:00.000Z",
    periodEnd: "2026-08-03T00:00:00.000Z",
    asOf: "2026-08-01T12:00:00.000Z",
    activeStudents: 0,
  });
  assert.equal(metrics.hoursPer100ActiveStudents, null);
  assert.equal(metrics.supportLimitExceeded, null);
});
