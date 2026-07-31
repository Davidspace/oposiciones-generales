export const OWNER_TIME_ACTORS = ["david", "alba"] as const;

export const OWNER_TIME_CATEGORIES = [
  "acquisition",
  "editorial",
  "sales_access",
  "platform",
  "legal_compliance",
  "administration",
  "research",
] as const;

export const OWNER_TIME_MODES = [
  "setup",
  "recurring",
  "extraordinary",
] as const;

export type OwnerTimeActor = (typeof OWNER_TIME_ACTORS)[number];
export type OwnerTimeCategory = (typeof OWNER_TIME_CATEGORIES)[number];
export type OwnerTimeMode = (typeof OWNER_TIME_MODES)[number];

export type OwnerTimeRecord = {
  workId: string;
  actor: OwnerTimeActor;
  category: OwnerTimeCategory;
  mode: OwnerTimeMode;
  occurredAt: string;
  minutesSpent: number;
  taskId: string;
};

type ParseResult =
  | { kind: "valid"; record: OwnerTimeRecord }
  | { kind: "invalid"; message: string };

const ALLOWED_KEYS = new Set([
  "workId",
  "actor",
  "category",
  "mode",
  "occurredAt",
  "minutesSpent",
  "taskId",
]);
const ACTOR_SET = new Set<string>(OWNER_TIME_ACTORS);
const CATEGORY_SET = new Set<string>(OWNER_TIME_CATEGORIES);
const MODE_SET = new Set<string>(OWNER_TIME_MODES);
const WORK_ID_PATTERN = /^WORK-[A-Z0-9]{10,40}$/;
const TASK_ID_PATTERN = /^[A-Z][A-Z0-9]{2,7}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactIso(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 40) return null;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  return parsed.toISOString() === value ? value : null;
}

export function parseOwnerTimeRecord(value: unknown): ParseResult {
  if (!isRecord(value) || Object.keys(value).some((key) => !ALLOWED_KEYS.has(key))) {
    return {
      kind: "invalid",
      message: "El registro contiene campos no admitidos.",
    };
  }

  const occurredAt = exactIso(value.occurredAt);
  const minutesSpent =
    typeof value.minutesSpent === "number" ? value.minutesSpent : null;
  if (
    typeof value.workId !== "string" ||
    !WORK_ID_PATTERN.test(value.workId) ||
    typeof value.actor !== "string" ||
    !ACTOR_SET.has(value.actor) ||
    typeof value.category !== "string" ||
    !CATEGORY_SET.has(value.category) ||
    typeof value.mode !== "string" ||
    !MODE_SET.has(value.mode) ||
    !occurredAt ||
    !Number.isInteger(minutesSpent) ||
    minutesSpent === null ||
    minutesSpent < 1 ||
    minutesSpent > 1_440 ||
    typeof value.taskId !== "string" ||
    !TASK_ID_PATTERN.test(value.taskId)
  ) {
    return { kind: "invalid", message: "El registro de horas no es válido." };
  }

  return {
    kind: "valid",
    record: {
      workId: value.workId,
      actor: value.actor as OwnerTimeActor,
      category: value.category as OwnerTimeCategory,
      mode: value.mode as OwnerTimeMode,
      occurredAt,
      minutesSpent,
      taskId: value.taskId,
    },
  };
}

export function aggregateOwnerTime(
  records: readonly OwnerTimeRecord[],
  period: { startAt: string; endAt: string },
) {
  const startAt = exactIso(period.startAt);
  const endAt = exactIso(period.endAt);
  if (!startAt || !endAt || Date.parse(endAt) <= Date.parse(startAt)) {
    throw new TypeError("El periodo de horas no es válido.");
  }

  const byActor = Object.fromEntries(
    OWNER_TIME_ACTORS.map((actor) => [actor, 0]),
  ) as Record<OwnerTimeActor, number>;
  const byCategory = Object.fromEntries(
    OWNER_TIME_CATEGORIES.map((category) => [category, 0]),
  ) as Record<OwnerTimeCategory, number>;
  const byMode = Object.fromEntries(
    OWNER_TIME_MODES.map((mode) => [mode, 0]),
  ) as Record<OwnerTimeMode, number>;
  const seen = new Set<string>();
  let entries = 0;
  let totalMinutes = 0;

  for (const record of records) {
    if (seen.has(record.workId)) {
      throw new TypeError(`El workId ${record.workId} está duplicado.`);
    }
    seen.add(record.workId);
    if (record.occurredAt < startAt || record.occurredAt >= endAt) continue;
    entries += 1;
    totalMinutes += record.minutesSpent;
    byActor[record.actor] += record.minutesSpent;
    byCategory[record.category] += record.minutesSpent;
    byMode[record.mode] += record.minutesSpent;
  }

  return {
    schemaVersion: "owner-time-metrics-v1",
    period: { startAt, endAt },
    entries,
    totalMinutes,
    totalHours: Number((totalMinutes / 60).toFixed(2)),
    byActor,
    byCategory,
    byMode,
  };
}
