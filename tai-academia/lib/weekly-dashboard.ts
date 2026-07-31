type WeeklyCommerceReport = {
  schemaVersion: string;
  period: { startAt: string; endAt: string };
  commerce: {
    paymentsVerified: number;
    grossRevenueCents: number;
  };
  refunds: { completed: number; amountCents: number };
  currentReconciliation: Record<string, number>;
  conversionPercent: Record<string, number | null>;
};

type OwnerTimeMetrics = {
  period: { startAt: string; endAt: string };
  totalMinutes: number;
  byCategory: { sales_access: number; editorial: number };
  byMode: { setup: number; recurring: number; extraordinary: number };
};

type SupportMetrics = {
  periodStart: string;
  periodEnd: string;
  activeStudents: number;
  tickets: number;
  standardMinutes: number;
  extraordinaryMinutes: number;
  hoursPer100ActiveStudents: number | null;
  supportLimitHoursPer100: number;
  supportLimitExceeded: boolean | null;
};

function centsPerHour(cents: number, minutes: number): number | null {
  return minutes > 0 ? Math.round((cents * 60) / minutes) : null;
}

function hoursPer100(minutes: number, denominator: number): number | null {
  return denominator > 0
    ? Number(((minutes / 60 / denominator) * 100).toFixed(2))
    : null;
}

export function buildWeeklyDashboard(
  commerce: WeeklyCommerceReport,
  ownerTime: OwnerTimeMetrics,
  support: SupportMetrics,
) {
  const samePeriod =
    commerce.period.startAt === ownerTime.period.startAt &&
    commerce.period.endAt === ownerTime.period.endAt &&
    commerce.period.startAt === support.periodStart &&
    commerce.period.endAt === support.periodEnd;
  if (!samePeriod) {
    throw new TypeError("Los tres informes deben cubrir el mismo periodo.");
  }

  const supportMinutes = support.standardMinutes + support.extraordinaryMinutes;
  const totalOwnerMinutes = ownerTime.totalMinutes + supportMinutes;
  const netRevenueCents =
    commerce.commerce.grossRevenueCents - commerce.refunds.amountCents;
  const salesAccessHoursPer100 = hoursPer100(
    ownerTime.byCategory.sales_access,
    commerce.commerce.paymentsVerified,
  );
  const reconciliationIssues = Object.values(
    commerce.currentReconciliation,
  ).reduce((total, value) => total + value, 0);

  return {
    schemaVersion: "ss-weekly-dashboard-v1",
    period: commerce.period,
    economics: {
      verifiedGrossRevenueCents: commerce.commerce.grossRevenueCents,
      refundAmountCents: commerce.refunds.amountCents,
      netRevenueCents,
      totalOwnerMinutes,
      totalOwnerHours: Number((totalOwnerMinutes / 60).toFixed(2)),
      grossRevenuePerOwnerHourCents: centsPerHour(
        commerce.commerce.grossRevenueCents,
        totalOwnerMinutes,
      ),
      netRevenuePerOwnerHourCents: centsPerHour(
        netRevenueCents,
        totalOwnerMinutes,
      ),
    },
    workload: {
      recordedWorkMinutes: ownerTime.totalMinutes,
      supportMinutes,
      setupMinutes: ownerTime.byMode.setup,
      recurringMinutes: ownerTime.byMode.recurring + support.standardMinutes,
      extraordinaryMinutes:
        ownerTime.byMode.extraordinary + support.extraordinaryMinutes,
      editorialMinutes: ownerTime.byCategory.editorial,
      salesAccessMinutes: ownerTime.byCategory.sales_access,
      salesAccessHoursPer100VerifiedPayments: salesAccessHoursPer100,
      salesAccessLimitHoursPer100: 6,
      salesAccessLimitExceeded:
        salesAccessHoursPer100 === null ? null : salesAccessHoursPer100 > 6,
      supportHoursPer100ActiveStudents: support.hoursPer100ActiveStudents,
      supportLimitHoursPer100: support.supportLimitHoursPer100,
      supportLimitExceeded: support.supportLimitExceeded,
    },
    evidence: {
      paymentsVerified: commerce.commerce.paymentsVerified,
      activeStudents: support.activeStudents,
      supportTickets: support.tickets,
      refundsCompleted: commerce.refunds.completed,
      reconciliationIssues,
      funnelConversionPercent: commerce.conversionPercent,
    },
  };
}

function euros(cents: number | null): string {
  return cents === null ? "sin dato" : `${(cents / 100).toFixed(2)} €`;
}

function ratio(value: number | null, suffix: string): string {
  return value === null ? "sin dato" : `${value.toFixed(2)} ${suffix}`;
}

export function renderWeeklyDashboardMarkdown(
  dashboard: ReturnType<typeof buildWeeklyDashboard>,
): string {
  const { economics, workload, evidence, period } = dashboard;
  return [
    "# Cuadro semanal SS CasoLab",
    "",
    `Periodo UTC: ${period.startAt} — ${period.endAt}`,
    "",
    "## Economía",
    "",
    `- Ingreso verificado bruto: ${euros(economics.verifiedGrossRevenueCents)}`,
    `- Devoluciones: ${euros(economics.refundAmountCents)}`,
    `- Ingreso neto tras devoluciones: ${euros(economics.netRevenueCents)}`,
    `- Horas totales registradas: ${economics.totalOwnerHours.toFixed(2)} h`,
    `- Ingreso neto por hora: ${euros(economics.netRevenuePerOwnerHourCents)}`,
    "",
    "## Carga operativa",
    "",
    `- Soporte ordinario y extraordinario: ${ratio(workload.supportMinutes / 60, "h")}`,
    `- Venta y alta por 100 pagos verificados: ${ratio(workload.salesAccessHoursPer100VerifiedPayments, "h")}`,
    `- Soporte por 100 alumnos activos: ${ratio(workload.supportHoursPer100ActiveStudents, "h")}`,
    `- Trabajo recurrente: ${ratio(workload.recurringMinutes / 60, "h")}`,
    `- Trabajo extraordinario: ${ratio(workload.extraordinaryMinutes / 60, "h")}`,
    "",
    "## Evidencia",
    "",
    `- Pagos verificados: ${evidence.paymentsVerified}`,
    `- Alumnos activos informados: ${evidence.activeStudents}`,
    `- Incidencias de soporte: ${evidence.supportTickets}`,
    `- Desajustes de conciliación abiertos: ${evidence.reconciliationIssues}`,
    "",
  ].join("\n");
}
