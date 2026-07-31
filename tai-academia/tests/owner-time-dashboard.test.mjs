import assert from "node:assert/strict";
import test from "node:test";

import {
  aggregateOwnerTime,
  parseOwnerTimeRecord,
} from "../lib/owner-time.ts";
import {
  buildWeeklyDashboard,
  renderWeeklyDashboardMarkdown,
} from "../lib/weekly-dashboard.ts";

function timeRecord(overrides = {}) {
  return {
    workId: "WORK-0000000001",
    actor: "david",
    category: "sales_access",
    mode: "recurring",
    occurredAt: "2026-07-28T10:00:00.000Z",
    minutesSpent: 30,
    taskId: "B011",
    ...overrides,
  };
}

test("owner time records reject narrative and personal data", () => {
  assert.equal(parseOwnerTimeRecord(timeRecord()).kind, "valid");
  for (const forbidden of [
    { note: "Llamé al alumno" },
    { email: "persona@example.test" },
    { phone: "+34600000000" },
    { orderReference: "SS-REFERENCE" },
  ]) {
    assert.equal(
      parseOwnerTimeRecord({ ...timeRecord(), ...forbidden }).kind,
      "invalid",
    );
  }
});

test("owner time aggregation is half-open and refuses duplicate work ids", () => {
  const values = [
    timeRecord(),
    timeRecord({
      workId: "WORK-0000000002",
      actor: "alba",
      category: "editorial",
      mode: "setup",
      occurredAt: "2026-08-03T00:00:00.000Z",
      minutesSpent: 90,
      taskId: "S007",
    }),
  ].map((value) => {
    const parsed = parseOwnerTimeRecord(value);
    assert.equal(parsed.kind, "valid");
    return parsed.record;
  });
  const aggregate = aggregateOwnerTime(values, {
    startAt: "2026-07-27T00:00:00.000Z",
    endAt: "2026-08-03T00:00:00.000Z",
  });
  assert.equal(aggregate.entries, 1);
  assert.equal(aggregate.totalMinutes, 30);
  assert.equal(aggregate.byCategory.sales_access, 30);
  assert.equal(aggregate.byActor.david, 30);

  assert.throws(
    () =>
      aggregateOwnerTime([values[0], values[0]], {
        startAt: "2026-07-27T00:00:00.000Z",
        endAt: "2026-08-03T00:00:00.000Z",
      }),
    /duplicado/,
  );
});

test("weekly dashboard calculates net income per total owner hour", () => {
  const dashboard = buildWeeklyDashboard(
    {
      schemaVersion: "ss-weekly-report-v1",
      period: {
        startAt: "2026-07-27T00:00:00.000Z",
        endAt: "2026-08-03T00:00:00.000Z",
      },
      commerce: { paymentsVerified: 10, grossRevenueCents: 49_000 },
      refunds: { completed: 1, amountCents: 4_900 },
      currentReconciliation: { paidWithoutActiveAccess: 1, needsReview: 2 },
      conversionPercent: { landingToOrder: 5 },
    },
    {
      period: {
        startAt: "2026-07-27T00:00:00.000Z",
        endAt: "2026-08-03T00:00:00.000Z",
      },
      totalMinutes: 240,
      byCategory: { sales_access: 30, editorial: 120 },
      byMode: { setup: 120, recurring: 120, extraordinary: 0 },
    },
    {
      periodStart: "2026-07-27T00:00:00.000Z",
      periodEnd: "2026-08-03T00:00:00.000Z",
      activeStudents: 100,
      tickets: 4,
      standardMinutes: 120,
      extraordinaryMinutes: 60,
      hoursPer100ActiveStudents: 2,
      supportLimitHoursPer100: 4,
      supportLimitExceeded: false,
    },
  );

  assert.equal(dashboard.economics.netRevenueCents, 44_100);
  assert.equal(dashboard.economics.totalOwnerMinutes, 420);
  assert.equal(dashboard.economics.netRevenuePerOwnerHourCents, 6_300);
  assert.equal(dashboard.workload.salesAccessHoursPer100VerifiedPayments, 5);
  assert.equal(dashboard.workload.salesAccessLimitExceeded, false);
  assert.equal(dashboard.evidence.reconciliationIssues, 3);
  const markdown = renderWeeklyDashboardMarkdown(dashboard);
  assert.match(markdown, /Ingreso neto por hora: 63\.00 €/);
  assert.match(markdown, /Desajustes de conciliación abiertos: 3/);
  assert.doesNotMatch(markdown, /email|teléfono|referencia bancaria/i);
});

test("weekly dashboard does not invent ratios without denominators", () => {
  const period = {
    startAt: "2026-07-27T00:00:00.000Z",
    endAt: "2026-08-03T00:00:00.000Z",
  };
  const dashboard = buildWeeklyDashboard(
    {
      schemaVersion: "ss-weekly-report-v1",
      period,
      commerce: { paymentsVerified: 0, grossRevenueCents: 0 },
      refunds: { completed: 0, amountCents: 0 },
      currentReconciliation: {},
      conversionPercent: {},
    },
    {
      period,
      totalMinutes: 0,
      byCategory: { sales_access: 0, editorial: 0 },
      byMode: { setup: 0, recurring: 0, extraordinary: 0 },
    },
    {
      periodStart: period.startAt,
      periodEnd: period.endAt,
      activeStudents: 0,
      tickets: 0,
      standardMinutes: 0,
      extraordinaryMinutes: 0,
      hoursPer100ActiveStudents: null,
      supportLimitHoursPer100: 4,
      supportLimitExceeded: null,
    },
  );
  assert.equal(dashboard.economics.netRevenuePerOwnerHourCents, null);
  assert.equal(dashboard.workload.salesAccessHoursPer100VerifiedPayments, null);
});
