export const SUPPORT_CATEGORIES = [
  "content",
  "access",
  "technical",
  "payment",
  "refund",
  "privacy",
  "accessibility",
  "unsubscribe",
] as const;

export const SUPPORT_ESCALATIONS = ["none", "alba", "david", "external"] as const;

export const SUPPORT_OUTCOMES = [
  "pending",
  "resolved_self_service",
  "resolved_operator",
  "corrected_content",
  "access_restored",
  "payment_reviewed",
  "refund_routed",
  "privacy_routed",
  "unsubscribe_completed",
] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];
export type SupportEscalation = (typeof SUPPORT_ESCALATIONS)[number];
export type SupportOutcome = (typeof SUPPORT_OUTCOMES)[number];

export type SupportRecord = {
  incidentId: string;
  category: SupportCategory;
  openedAt: string;
  dueAt: string;
  firstResponseAt: string | null;
  closedAt: string | null;
  messagesCount: number;
  minutesSpent: number;
  escalatedTo: SupportEscalation;
  outcome: SupportOutcome;
  extraordinary: boolean;
  assetId: string | null;
};

type ParseResult =
  | { kind: "valid"; record: SupportRecord }
  | { kind: "invalid"; message: string };

type AggregateInput = {
  periodStart: string;
  periodEnd: string;
  asOf: string;
  activeStudents: number;
};

const ALLOWED_KEYS = new Set([
  "incidentId",
  "category",
  "openedAt",
  "dueAt",
  "firstResponseAt",
  "closedAt",
  "messagesCount",
  "minutesSpent",
  "escalatedTo",
  "outcome",
  "extraordinary",
  "assetId",
]);
const CATEGORY_SET = new Set<string>(SUPPORT_CATEGORIES);
const ESCALATION_SET = new Set<string>(SUPPORT_ESCALATIONS);
const OUTCOME_SET = new Set<string>(SUPPORT_OUTCOMES);
const INCIDENT_ID_PATTERN = /^SUP-[A-Z0-9]{10,40}$/;
const ASSET_ID_PATTERN = /^(?:G|S)[0-9]{2}@[0-9]+\.[0-9]+\.[0-9]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactIso(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 40) return null;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  return parsed.toISOString() === value ? value : null;
}

function optionalExactIso(value: unknown): string | null | undefined {
  if (value === null) return null;
  return exactIso(value) ?? undefined;
}

function integerInRange(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number {
  return Number.isInteger(value) && Number(value) >= minimum && Number(value) <= maximum;
}

export function parseSupportRecord(value: unknown): ParseResult {
  if (!isRecord(value) || Object.keys(value).some((key) => !ALLOWED_KEYS.has(key))) {
    return { kind: "invalid", message: "El registro contiene campos no admitidos." };
  }

  const openedAt = exactIso(value.openedAt);
  const dueAt = exactIso(value.dueAt);
  const firstResponseAt = optionalExactIso(value.firstResponseAt);
  const closedAt = optionalExactIso(value.closedAt);
  const assetId = value.assetId === null ? null : value.assetId;

  if (
    typeof value.incidentId !== "string" ||
    !INCIDENT_ID_PATTERN.test(value.incidentId) ||
    typeof value.category !== "string" ||
    !CATEGORY_SET.has(value.category) ||
    !openedAt ||
    !dueAt ||
    firstResponseAt === undefined ||
    closedAt === undefined ||
    !integerInRange(value.messagesCount, 0, 1_000) ||
    !integerInRange(value.minutesSpent, 0, 1_440) ||
    typeof value.escalatedTo !== "string" ||
    !ESCALATION_SET.has(value.escalatedTo) ||
    typeof value.outcome !== "string" ||
    !OUTCOME_SET.has(value.outcome) ||
    typeof value.extraordinary !== "boolean" ||
    (assetId !== null &&
      (typeof assetId !== "string" || !ASSET_ID_PATTERN.test(assetId)))
  ) {
    return { kind: "invalid", message: "El registro de soporte no es válido." };
  }

  const openedMs = Date.parse(openedAt);
  if (
    Date.parse(dueAt) <= openedMs ||
    (firstResponseAt !== null && Date.parse(firstResponseAt) < openedMs) ||
    (closedAt !== null && Date.parse(closedAt) < openedMs) ||
    (closedAt === null && value.outcome !== "pending") ||
    (closedAt !== null && value.outcome === "pending")
  ) {
    return { kind: "invalid", message: "Las fechas o el resultado no son coherentes." };
  }

  return {
    kind: "valid",
    record: {
      incidentId: value.incidentId,
      category: value.category as SupportCategory,
      openedAt,
      dueAt,
      firstResponseAt,
      closedAt,
      messagesCount: value.messagesCount,
      minutesSpent: value.minutesSpent,
      escalatedTo: value.escalatedTo as SupportEscalation,
      outcome: value.outcome as SupportOutcome,
      extraordinary: value.extraordinary,
      assetId: assetId as string | null,
    },
  };
}

export function aggregateSupportMetrics(
  records: readonly SupportRecord[],
  input: AggregateInput,
) {
  const periodStart = exactIso(input.periodStart);
  const periodEnd = exactIso(input.periodEnd);
  const asOf = exactIso(input.asOf);
  if (
    !periodStart ||
    !periodEnd ||
    !asOf ||
    Date.parse(periodEnd) <= Date.parse(periodStart) ||
    !Number.isInteger(input.activeStudents) ||
    input.activeStudents < 0
  ) {
    throw new TypeError("El periodo o el número de alumnos activos no es válido.");
  }

  const byCategory = Object.fromEntries(
    SUPPORT_CATEGORIES.map((category) => [
      category,
      { tickets: 0, messages: 0, minutes: 0, escalations: 0 },
    ]),
  ) as Record<
    SupportCategory,
    { tickets: number; messages: number; minutes: number; escalations: number }
  >;
  let messages = 0;
  let standardMinutes = 0;
  let extraordinaryMinutes = 0;
  let respondedOnTime = 0;
  let respondedLate = 0;
  let openOverdue = 0;
  let escalations = 0;
  const seenIncidentIds = new Set<string>();
  const scopedRecords = records.filter((record) => {
    if (seenIncidentIds.has(record.incidentId)) {
      throw new TypeError(`El incidentId ${record.incidentId} está duplicado.`);
    }
    seenIncidentIds.add(record.incidentId);
    return record.openedAt >= periodStart && record.openedAt < periodEnd;
  });

  for (const record of scopedRecords) {
    messages += record.messagesCount;
    if (record.extraordinary) extraordinaryMinutes += record.minutesSpent;
    else standardMinutes += record.minutesSpent;
    const category = byCategory[record.category];
    category.tickets += 1;
    category.messages += record.messagesCount;
    category.minutes += record.minutesSpent;
    if (record.escalatedTo !== "none") {
      escalations += 1;
      category.escalations += 1;
    }
    if (record.firstResponseAt !== null) {
      if (Date.parse(record.firstResponseAt) <= Date.parse(record.dueAt)) {
        respondedOnTime += 1;
      } else {
        respondedLate += 1;
      }
    } else if (Date.parse(asOf) > Date.parse(record.dueAt)) {
      openOverdue += 1;
    }
  }

  const hoursPer100ActiveStudents =
    input.activeStudents > 0
      ? Number(
          ((standardMinutes / 60 / input.activeStudents) * 100).toFixed(2),
        )
      : null;

  return {
    schemaVersion: "support-metrics-v1",
    periodStart,
    periodEnd,
    asOf,
    activeStudents: input.activeStudents,
    tickets: scopedRecords.length,
    messages,
    standardMinutes,
    extraordinaryMinutes,
    hoursPer100ActiveStudents,
    supportLimitHoursPer100: 4,
    supportLimitExceeded:
      hoursPer100ActiveStudents === null
        ? null
        : hoursPer100ActiveStudents > 4,
    sla: { respondedOnTime, respondedLate, openOverdue },
    escalations: { total: escalations },
    byCategory,
  };
}
