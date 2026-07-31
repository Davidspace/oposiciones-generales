import { readdir, readFile } from "node:fs/promises";

import { inspectBetaEditorialGate } from "../lib/beta-editorial-gate.ts";

async function readJsonDirectory(name) {
  const directory = new URL(`../content-source/${name}/`, import.meta.url);
  const entries = await readdir(directory, { recursive: true });
  return Promise.all(
    entries
      .filter((entry) => entry.endsWith(".json"))
      .map(async (entry) =>
        JSON.parse(
          await readFile(new URL(entry.replaceAll("\\", "/"), directory), "utf8"),
        ),
      ),
  );
}

const [modules, cases, questions, claims] = await Promise.all([
  readJsonDirectory("modules"),
  readJsonDirectory("cases"),
  readJsonDirectory("questions"),
  readJsonDirectory("claims"),
]);
const report = inspectBetaEditorialGate({ modules, cases, questions, claims });
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (!report.structuralReady) process.exitCode = 2;
else if (!report.publicationReady) process.exitCode = 3;
