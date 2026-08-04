import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const files = [
  "entrega/lorman-industry.css",
  "lorman-lab/client/src/lorman-industry.css",
  "tai-academia/app/lorman-industry.css",
  "ss-casolab/app/lorman-industry.css",
  "administrativo-estado/app/lorman-industry.css",
  "auxiliar-juridico/src/lorman-industry.css",
];

const contents = await Promise.all(
  files.map(async (file) => [file, await readFile(resolve(root, file), "utf8")]),
);
const hashes = new Map(
  contents.map(([file, content]) => [
    file,
    createHash("sha256").update(content).digest("hex"),
  ]),
);
const uniqueHashes = new Set(hashes.values());

if (uniqueHashes.size !== 1) {
  console.error("Industry CSS copies are not identical:");
  for (const [file, hash] of hashes) console.error(`- ${file}: ${hash}`);
  process.exit(1);
}

const css = contents[0][1];
const requiredMarkers = [
  "body .lm-page:not(.lm-hub) .lm-nav a:not(.lm-nav-back):not(.tai-nav-home)",
  "body .lm-page .lm-footer {",
  "body .lm-page .lm-pregunta > summary::after",
  "body .lm-page .lm-options input[type=\"radio\"]",
  "@media (max-width: 900px)",
  "@media (max-width: 600px)",
];
const missing = requiredMarkers.filter((marker) => !css.includes(marker));

if (missing.length > 0) {
  console.error("Industry CSS is missing required safeguards:");
  for (const marker of missing) console.error(`- ${marker}`);
  process.exit(1);
}

if (css.includes("width: min(100%, 680px)")) {
  console.error("Industry CSS still contains the fixed 680px page width.");
  process.exit(1);
}

console.log(`Industry CSS OK: ${files.length} identical copies (${[...uniqueHashes][0]}).`);
