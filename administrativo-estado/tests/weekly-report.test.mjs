import assert from "node:assert/strict";
import test from "node:test";

import { createAdminWeeklyReportHandler } from "../lib/admin-weekly-report-handler.ts";
import {
  buildWeeklyReport,
  parseUtcWeekStart,
} from "../lib/weekly-report.ts";

const DAVID_SECRET = "d".repeat(64);
const ALBA_SECRET = "a".repeat(64);
const HMAC_SECRET = "h".repeat(64);

function env() {
  return {
    SS_CASOLAB_ADMIN_ENABLED: "true",
    SS_CASOLAB_ADMIN_DAVID_SECRET: DAVID_SECRET,
    SS_CASOLAB_ADMIN_ALBA_SECRET: ALBA_SECRET,
    SS_CASOLAB_PAYMENT_REFERENCE_HMAC_SECRET: HMAC_SECRET,
    SS_CASOLAB_PAYMENT_REFERENCE_HMAC_VERSION: "v1",
  };
}

function source() {
  return {
    funnel: {
      landingSessions: 100,
      diagnosticStarts: 50,
      diagnosticCompletes: 30,
      offerViews: 20,
      orderFormStarts: 12,
      bizumInstructionsViewed: 10,
      whatsappClicks: 8,
    },
    contacts: { captured: 10 },
    commerce: {
      ordersCreated: 5,
      orderedAmountCents: 24_500,
      paymentReports: 4,
      paymentsVerified: 2,
      grossRevenueCents: 9_800,
      paymentsNeedsReview: 1,
      paymentsRejected: 0,
      expiredTransitions: 1,
      averageVerificationSeconds: 600,
    },
    delivery: {
      accessesProvisioned: 2,
      accessesFailed: 0,
      averageAccessSeconds: 900,
    },
    refunds: { completed: 0, amountCents: 0 },
    currentReconciliation: {
      paidWithoutActiveAccess: 0,
      paymentReported: 1,
      needsReview: 1,
      activeAccessOutsideAllowedOrder: 0,
      completedRefundWithActiveAccess: 0,
    },
  };
}

test("weekly periods require a real Monday and use a half-open UTC week", () => {
  assert.deepEqual(parseUtcWeekStart("2026-07-27"), {
    weekStart: "2026-07-27",
    startAt: "2026-07-27T00:00:00.000Z",
    endAt: "2026-08-03T00:00:00.000Z",
  });
  assert.equal(parseUtcWeekStart("2026-07-28"), null);
  assert.equal(parseUtcWeekStart("2026-02-30"), null);
});

test("weekly reports calculate funnel conversion without raw records", () => {
  const period = parseUtcWeekStart("2026-07-27");
  assert.ok(period);
  const report = buildWeeklyReport(
    period,
    "2026-08-01T12:00:00.000Z",
    source(),
  );
  assert.equal(report.conversionPercent.diagnosticStartToComplete, 60);
  assert.equal(report.conversionPercent.landingToOrder, 5);
  assert.equal(report.conversionPercent.orderToVerifiedPayment, 40);
  assert.equal(report.conversionPercent.verifiedPaymentToAccess, 100);
  assert.doesNotMatch(JSON.stringify(report), /email|whatsappSuffix|lookupToken|reference/i);
});

test("weekly report endpoint is authenticated, strict and exportable", async () => {
  let calls = 0;
  const handler = createAdminWeeklyReportHandler({
    env: env(),
    store: {
      async readWeek() {
        calls += 1;
        return source();
      },
    },
    now: () => new Date("2026-08-01T12:00:00.000Z"),
    rateLimit: () => ({ allowed: true, retryAfterSeconds: 0 }),
  });

  const unauthorized = await handler.get(
    new Request("https://example.test/api/admin/reports/weekly?weekStart=2026-07-27"),
  );
  assert.equal(unauthorized.status, 401);
  assert.equal(calls, 0);

  const invalid = await handler.get(
    new Request(
      "https://example.test/api/admin/reports/weekly?weekStart=2026-07-27&email=x",
      { headers: { Authorization: `Bearer ${DAVID_SECRET}` } },
    ),
  );
  assert.equal(invalid.status, 400);
  assert.equal(calls, 0);

  const ok = await handler.get(
    new Request("https://example.test/api/admin/reports/weekly?weekStart=2026-07-27", {
      headers: { Authorization: `Bearer ${DAVID_SECRET}` },
    }),
  );
  assert.equal(ok.status, 200);
  assert.match(ok.headers.get("content-disposition") ?? "", /2026-07-27/);
  assert.equal(ok.headers.get("cache-control"), "no-store");
  const body = await ok.json();
  assert.equal(body.ok, true);
  assert.equal(body.report.commerce.grossRevenueCents, 9_800);
  assert.equal(calls, 1);
  assert.doesNotMatch(JSON.stringify(body), new RegExp(DAVID_SECRET));
});
