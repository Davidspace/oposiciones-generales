import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildBetaReviewPack } from "../lib/beta-review-pack.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

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

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const outDirectory = resolve(
  projectRoot,
  argument("--out") ?? "outputs/review/beta",
);
const generatedAt = new Date().toISOString();
const [modules, cases, questions, claims] = await Promise.all([
  readJsonDirectory("modules"),
  readJsonDirectory("cases"),
  readJsonDirectory("questions"),
  readJsonDirectory("claims"),
]);
const markdown = buildBetaReviewPack({
  generatedAt,
  modules,
  cases,
  questions,
  claims,
});
const digest = createHash("sha256").update(markdown, "utf8").digest("hex");
await mkdir(outDirectory, { recursive: true });
await writeFile(resolve(outDirectory, "beta-review-pack.md"), markdown, "utf8");
await writeFile(
  resolve(outDirectory, "manifest.json"),
  `${JSON.stringify({ generatedAt, sha256: digest }, null, 2)}\n`,
  "utf8",
);
process.stdout.write(`Paquete beta privado: ${digest}\n`);
