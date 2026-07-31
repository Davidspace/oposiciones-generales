import { readFile } from "node:fs/promises";
import process from "node:process";

import {
  aggregateSupportMetrics,
  parseSupportRecord,
} from "../lib/support-metrics.ts";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const inputPath = argument("--input");
const periodStart = argument("--period-start");
const periodEnd = argument("--period-end");
const asOf = argument("--as-of") ?? new Date().toISOString();
const activeStudents = Number(argument("--active-students"));

if (!inputPath || !periodStart || !periodEnd || !Number.isInteger(activeStudents)) {
  throw new Error(
    "Uso: --input <jsonl> --period-start <ISO> --period-end <ISO> --active-students <n> [--as-of <ISO>]",
  );
}

const lines = (await readFile(inputPath, "utf8"))
  .split(/\r?\n/u)
  .map((line) => line.trim())
  .filter(Boolean);
const records = lines.map((line, index) => {
  let value;
  try {
    value = JSON.parse(line);
  } catch {
    throw new Error(`La línea ${index + 1} no contiene JSON válido.`);
  }
  const parsed = parseSupportRecord(value);
  if (parsed.kind === "invalid") {
    throw new Error(`Línea ${index + 1}: ${parsed.message}`);
  }
  return parsed.record;
});

const metrics = aggregateSupportMetrics(records, {
  periodStart,
  periodEnd,
  asOf,
  activeStudents,
});
process.stdout.write(`${JSON.stringify(metrics, null, 2)}\n`);
