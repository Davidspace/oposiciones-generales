import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const betaModuleIds = ["G01", "G13", "G14", "G15", "G16", "S01", "S02", "S03"];
const betaCaseIds = ["MC01", "MC02", "CP01"];

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

export function buildBetaReviewChecklist({ modules, cases, questions, claims, asOf }) {
  const moduleById = new Map(modules.map((module) => [module.id, module]));
  const caseById = new Map(cases.map((practicalCase) => [practicalCase.id, practicalCase]));
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const claimById = new Map(claims.map((claim) => [claim.claimId, claim]));
  const moduleRows = betaModuleIds.map((id) => {
    const learningModule = moduleById.get(id);
    const questionIds = learningModule?.questionIds ?? [];
    const claimIds = learningModule?.normativeClaimIds ?? [];
    return {
      id,
      title: learningModule?.title ?? "Módulo ausente",
      questionIds,
      claimIds,
      missingQuestions: questionIds.filter((questionId) => !questionById.has(questionId)),
      missingClaims: claimIds.filter((claimId) => !claimById.has(claimId)),
      academicReviewStatus: learningModule?.academicReviewStatus ?? "missing",
      legalReviewStatus: learningModule?.legalReviewStatus ?? "missing",
    };
  });
  const caseRows = betaCaseIds.map((id) => {
    const practicalCase = caseById.get(id);
    const questionIds = practicalCase?.questionIds ?? [];
    const claimIds = practicalCase?.normativeClaimIds ?? [];
    return {
      id,
      title: practicalCase?.title ?? "Caso ausente",
      type: practicalCase?.type ?? "missing",
      questionIds,
      claimIds,
      missingQuestions: questionIds.filter((questionId) => !questionById.has(questionId)),
      missingClaims: claimIds.filter((claimId) => !claimById.has(claimId)),
      academicReviewStatus: practicalCase?.academicReviewStatus ?? "missing",
      legalReviewStatus: practicalCase?.legalReviewStatus ?? "missing",
    };
  });
  return {
    schemaVersion: "ss-beta-review-checklist-v1",
    asOf,
    moduleRows,
    caseRows,
    questionCount: new Set([...moduleRows.flatMap((row) => row.questionIds), ...caseRows.flatMap((row) => row.questionIds)]).size,
    claimCount: new Set([...moduleRows.flatMap((row) => row.claimIds), ...caseRows.flatMap((row) => row.claimIds)]).size,
    structuralReady: [...moduleRows, ...caseRows].every((row) => row.missingQuestions.length === 0 && row.missingClaims.length === 0),
  };
}

export function renderBetaReviewChecklist(checklist) {
  const lines = [
    `# Checklist de revisión — lote beta SS CasoLab (${checklist.asOf})`,
    "",
    "> Uso interno. Esta lista no aprueba contenido. El lote solo puede publicarse cuando cada módulo, pregunta, afirmación y caso tenga revisión académica, jurídica y normativa registrada.",
    "",
    `**Estructura:** ${checklist.moduleRows.length} módulos · ${checklist.questionCount} preguntas referenciadas · ${checklist.claimCount} afirmaciones referenciadas · ${checklist.caseRows.length} casos.`,
    `**Integridad de referencias:** ${checklist.structuralReady ? "verde" : "roja"}.`,
    "",
    "## Criterio de cierre por módulo",
    "",
    "- [ ] Programa y epígrafe comprobados.",
    "- [ ] Lección y hoja de repaso leídas completas.",
    "- [ ] Afirmaciones: texto, localizador BOE, vigencia y fecha de corte comprobados.",
    "- [ ] Preguntas: una respuesta defendible, distractores plausibles, feedback y dificultad comprobados.",
    "- [ ] Cambios registrados en `provenance.changeLog`.",
    "- [ ] `academicReviewStatus` y `legalReviewStatus` actualizados por la persona responsable.",
    "",
    "## Módulos",
    "",
    "| Módulo | Título | Afirmaciones | Preguntas | Estado académico | Estado jurídico | Cierre |",
    "|---|---|---:|---:|---|---|---|",
  ];
  for (const row of checklist.moduleRows) {
    lines.push(`| ${row.id} | ${row.title} | ${row.claimIds.length} | ${row.questionIds.length} | ${row.academicReviewStatus} | ${row.legalReviewStatus} | [ ] |`);
    lines.push(`\n**${row.id} — afirmaciones**\n\n${row.claimIds.map((id) => `- [ ] \`${id}\``).join("\n") || "- [ ] Falta el módulo"}`);
    lines.push(`\n**${row.id} — preguntas**\n\n${row.questionIds.map((id) => `- [ ] \`${id}\``).join("\n") || "- [ ] Falta el módulo"}`);
    lines.push("");
  }
  lines.push("## Casos prácticos", "", "| Caso | Tipo | Título | Afirmaciones | Preguntas | Estado académico | Estado jurídico | Cierre |", "|---|---|---|---:|---:|---|---|---|");
  for (const row of checklist.caseRows) {
    lines.push(`| ${row.id} | ${row.type} | ${row.title} | ${row.claimIds.length} | ${row.questionIds.length} | ${row.academicReviewStatus} | ${row.legalReviewStatus} | [ ] |`);
    lines.push(`\n**${row.id} — afirmaciones**\n\n${row.claimIds.map((id) => `- [ ] \`${id}\``).join("\n") || "- [ ] Falta el caso"}`);
    lines.push(`\n**${row.id} — preguntas**\n\n${row.questionIds.map((id) => `- [ ] \`${id}\``).join("\n") || "- [ ] Falta el caso"}`);
    lines.push("");
  }
  lines.push(
    "## Criterio de cierre del lote",
    "",
    "- [ ] No hay referencias ausentes ni duplicadas.",
    "- [ ] Las preguntas de caso usan los mismos hechos y supuestos.",
    "- [ ] Las reservas de CP01 están separadas de las 15 preguntas principales.",
    "- [ ] Se ha revisado la originalidad de los casos y no se han copiado enunciados protegidos.",
    "- [ ] Se han resuelto las incidencias del gate beta.",
    "- [ ] El gate de publicación devuelve `publicationReady: true`.",
    "",
    "## Comandos",
    "",
    "```text",
    "npm run content:validate",
    "npm run content:review-pack-beta",
    "npm run content:gate-beta",
    "```",
    "",
  );
  return `${lines.join("\n")}\n`;
}

async function main() {
  const asOf = process.argv.includes("--as-of") ? process.argv[process.argv.indexOf("--as-of") + 1] : new Date().toISOString().slice(0, 10);
  const outPath = resolve(projectRoot, process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : "docs/aegis/work/2026-07-29-ss-academy-full/97-beta-review-checklist.md");
  const [modules, cases, questions, claims] = await Promise.all([
    readJsonDirectory("modules"),
    readJsonDirectory("cases"),
    readJsonDirectory("questions"),
    readJsonDirectory("claims"),
  ]);
  const checklist = buildBetaReviewChecklist({ modules, cases, questions, claims, asOf });
  await mkdir(resolve(outPath, ".."), { recursive: true });
  await writeFile(outPath, renderBetaReviewChecklist(checklist), "utf8");
  process.stdout.write(`Checklist beta: ${checklist.moduleRows.length} módulos; ${checklist.questionCount} preguntas; ${checklist.claimCount} afirmaciones.\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
