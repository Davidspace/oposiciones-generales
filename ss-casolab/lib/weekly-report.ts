export type UtcWeekPeriod = {
  weekStart: string;
  startAt: string;
  endAt: string;
};

export type WeeklyReportSource = {
  funnel: {
    landingSessions: number;
    diagnosticStarts: number;
    diagnosticCompletes: number;
    offerViews: number;
    orderFormStarts: number;
    bizumInstructionsViewed: number;
    whatsappClicks: number;
  };
  contacts: { captured: number };
  commerce: {
    ordersCreated: number;
    orderedAmountCents: number;
    paymentReports: number;
    paymentsVerified: number;
    grossRevenueCents: number;
    paymentsNeedsReview: number;
    paymentsRejected: number;
    expiredTransitions: number;
    averageVerificationSeconds: number | null;
  };
  delivery: {
    accessesProvisioned: number;
    accessesFailed: number;
    averageAccessSeconds: number | null;
  };
  refunds: {
    completed: number;
    amountCents: number;
  };
  currentReconciliation: {
    paidWithoutActiveAccess: number;
    paymentReported: number;
    needsReview: number;
    activeAccessOutsideAllowedOrder: number;
    completedRefundWithActiveAccess: number;
  };
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseUtcWeekStart(value: unknown): UtcWeekPeriod | null {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return null;
  const start = new Date(`${value}T00:00:00.000Z`);
  if (
    !Number.isFinite(start.getTime()) ||
    start.toISOString().slice(0, 10) !== value ||
    start.getUTCDay() !== 1
  ) {
    return null;
  }
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1_000);
  return {
    weekStart: value,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
  };
}

function percent(numerator: number, denominator: number): number | null {
  return denominator > 0
    ? Number(((numerator / denominator) * 100).toFixed(2))
    : null;
}

export function buildWeeklyReport(
  period: UtcWeekPeriod,
  generatedAt: string,
  source: WeeklyReportSource,
) {
  const generated = new Date(generatedAt);
  if (
    !Number.isFinite(generated.getTime()) ||
    generated.toISOString() !== generatedAt
  ) {
    throw new TypeError("La fecha de generación no es válida.");
  }
  return {
    schemaVersion: "ss-weekly-report-v1",
    generatedAt,
    period: { ...period, timeZone: "UTC" as const },
    ...source,
    conversionPercent: {
      diagnosticStartToComplete: percent(
        source.funnel.diagnosticCompletes,
        source.funnel.diagnosticStarts,
      ),
      landingToContact: percent(
        source.contacts.captured,
        source.funnel.landingSessions,
      ),
      landingToOrder: percent(
        source.commerce.ordersCreated,
        source.funnel.landingSessions,
      ),
      orderToVerifiedPayment: percent(
        source.commerce.paymentsVerified,
        source.commerce.ordersCreated,
      ),
      verifiedPaymentToAccess: percent(
        source.delivery.accessesProvisioned,
        source.commerce.paymentsVerified,
      ),
    },
  };
}
