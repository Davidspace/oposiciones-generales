import { readFile } from "node:fs/promises";

import {
  aggregateOwnerTime,
  parseOwnerTimeRecord,
} from "../lib/owner-time.ts";
import {
  buildWeeklyDashboard,
  renderWeeklyDashboardMarkdown,
} from "../lib/weekly-dashboard.ts";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function json(path, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    throw new Error(`No se pudo leer ${label} como JSON válido.`);
  }
}

const weeklyPath = argument("--weekly-report");
const supportPath = argument("--support-report");
const timePath = argument("--time-log");
const format = argument("--format") ?? "markdown";
if (!weeklyPath || !supportPath || !timePath || !["json", "markdown"].includes(format)) {
  throw new Error(
    "Uso: --weekly-report <json> --support-report <json> --time-log <jsonl> [--format json|markdown]",
  );
}

const weeklyPayload = await json(weeklyPath, "el informe semanal");
const weekly = weeklyPayload?.ok === true ? weeklyPayload.report : weeklyPayload;
if (
  weekly?.schemaVersion !== "ss-weekly-report-v1" ||
  typeof weekly?.period?.startAt !== "string" ||
  typeof weekly?.period?.endAt !== "string"
) {
  throw new Error("El informe semanal no usa el esquema esperado.");
}

const support = await json(supportPath, "el informe de soporte");
if (support?.schemaVersion !== "support-metrics-v1") {
  throw new Error("El informe de soporte no usa el esquema esperado.");
}

const lines = (await readFile(timePath, "utf8"))
  .split(/\r?\n/u)
  .map((line) => line.trim())
  .filter(Boolean);
const timeRecords = lines.map((line, index) => {
  let value;
  try {
    value = JSON.parse(line);
  } catch {
    throw new Error(`La línea ${index + 1} del registro de horas no contiene JSON válido.`);
  }
  const parsed = parseOwnerTimeRecord(value);
  if (parsed.kind === "invalid") {
    throw new Error(`Línea ${index + 1}: ${parsed.message}`);
  }
  return parsed.record;
});
const time = aggregateOwnerTime(timeRecords, {
  startAt: weekly.period.startAt,
  endAt: weekly.period.endAt,
});
const dashboard = buildWeeklyDashboard(weekly, time, support);
const output =
  format === "json"
    ? `${JSON.stringify(dashboard, null, 2)}\n`
    : renderWeeklyDashboardMarkdown(dashboard);
process.stdout.write(output);
