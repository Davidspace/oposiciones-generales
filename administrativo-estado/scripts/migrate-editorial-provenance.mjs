import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = resolve(projectRoot, "content-source");
const attribution = "codex-assisted-editorial-draft";

const summaries = {
  modules: "Borrador inicial del módulo y su trazabilidad.",
  questions: "Borrador inicial de pregunta con feedback por alternativa.",
  claims: "Borrador inicial de afirmación normativa trazable.",
  cases: "Borrador inicial del caso práctico canónico.",
};

function nextReviewForRisk(risk) {
  if (risk === "high" || risk === "very-high") return "2026-08-29";
  if (risk === "medium-high") return "2026-09-29";
  return "2026-10-29";
}

function provenanceFor(document, summary) {
  const date =
    document.sourceCheckedAt ??
    document.legislationCutoffAt ??
    document.validFrom ??
    "2026-07-29";
  return {
    createdBy: attribution,
    createdAt: date,
    changeLog: [
      {
        version: document.version,
        date,
        changedBy: attribution,
        summary,
      },
    ],
  };
}

async function jsonFiles(directory) {
  const entries = await readdir(directory, { recursive: true });
  return entries
    .filter((entry) => entry.endsWith(".json"))
    .map((entry) => resolve(directory, entry));
}

async function main() {
  const catalog = JSON.parse(
    await readFile(resolve(sourceRoot, "catalog.json"), "utf8"),
  );
  const themes = new Map(catalog.themes.map((theme) => [theme.id, theme]));
  let changed = 0;

  for (const kind of ["modules", "questions", "claims", "cases"]) {
    for (const path of await jsonFiles(resolve(sourceRoot, kind))) {
      const document = JSON.parse(await readFile(path, "utf8"));
      const before = JSON.stringify(document);

      document.provenance ??= provenanceFor(document, summaries[kind]);

      if (kind === "modules") {
        document.academicReviewStatus ??= "pending";
      }

      if (kind === "questions") {
        const risks = (document.themes ?? [])
          .map((themeId) => themes.get(themeId)?.updateRisk)
          .filter(Boolean);
        const risk = risks.includes("very-high")
          ? "very-high"
          : risks.includes("high")
            ? "high"
            : risks.includes("medium-high")
              ? "medium-high"
              : risks.includes("medium")
                ? "medium"
                : "low";
        document.academicReviewStatus ??= "pending";
        document.legalReviewStatus ??= "pending";
        document.nextReviewAt ??= nextReviewForRisk(risk);
      }

      if (kind === "cases") {
        document.coverage ??= (document.themes ?? []).map(
          (themeId, index) => ({
            themeId,
            competency:
              document.competencies?.[index] ??
              document.competencies?.[0] ??
              "Resolver las decisiones del caso de forma coherente.",
            questionIds: [
              ...(document.questionIds ?? []),
              ...(document.generalQuestionIds ?? []),
            ],
          }),
        );
        document.difficulty ??= "basic";
        document.visibility ??= "practice";
        document.validFrom ??= document.legislationCutoffAt;
        document.validTo ??= null;
        document.nextReviewAt ??= nextReviewForRisk(
          (document.themes ?? [])
            .map((themeId) => themes.get(themeId)?.updateRisk)
            .find((risk) => risk === "high" || risk === "very-high") ??
            "medium",
        );
        document.academicReviewStatus ??= "pending";
      }

      if (JSON.stringify(document) !== before) {
        await writeFile(path, `${JSON.stringify(document, null, 2)}\n`, "utf8");
        changed += 1;
      }
    }
  }

  process.stdout.write(`Provenance migration updated ${changed} assets.\n`);
}

await main();
