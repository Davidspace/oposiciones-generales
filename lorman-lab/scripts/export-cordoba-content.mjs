import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { metadata, questions } from "../private-content/cordoba/banco-100-preguntas.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const out = path.join(root, "private-content", "cordoba", "export");

const escapeGift = (value) => String(value)
  .replaceAll("\\", "\\\\")
  .replaceAll("~", "\\~")
  .replaceAll("=", "\\=")
  .replaceAll("#", "\\#")
  .replaceAll("{", "\\{")
  .replaceAll("}", "\\}");

const gift = questions.map((item) => {
  const answers = item.options.map((option, index) => {
    const marker = index === item.correctIndex ? "=" : "~";
    const feedback = index === item.correctIndex
      ? `${item.explanation} Fuente: ${item.source.locator}. Revisada: ${item.source.reviewedOn}.`
      : `Revisa ${item.source.locator}. ${item.explanation}`;
    return `${marker}${escapeGift(option)}#${escapeGift(feedback)}`;
  });
  return [
    `$CATEGORY: LORMAN/Córdoba/Tema ${String(item.topic).padStart(2, "0")}`,
    `::${item.id}::${escapeGift(item.stem)} {`,
    ...answers.map((answer) => `  ${answer}`),
    `}`,
    `// Fuente: ${item.source.title} | ${item.source.url} | ${item.source.locator}`,
  ].join("\n");
}).join("\n\n");

await mkdir(out, { recursive: true });
await writeFile(path.join(out, "banco-100-preguntas.json"), `${JSON.stringify({ metadata, questions }, null, 2)}\n`, "utf8");
await writeFile(path.join(out, "banco-100-preguntas.gift"), `${gift}\n`, "utf8");
console.log(`Exportadas ${questions.length} preguntas en ${out}`);
