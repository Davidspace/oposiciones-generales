import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { collectEditorialProgress } from "./report-editorial-progress.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const assetGroups = ["modules", "claims", "questions", "cases"];

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function readJsonDirectory(directoryName) {
  const directory = new URL(`../content-source/${directoryName}/`, import.meta.url);
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

function statusLabel(value) {
  return value === "published" ? "publicable" : value ?? "missing";
}

function escapeTable(value) {
  return String(value ?? "—").replaceAll("|", "\\|").replaceAll("\n", " ");
}

export function buildCurriculumAudit({ catalog, modules, claims, questions, cases, asOf }) {
  const progress = collectEditorialProgress({
    catalog,
    modules,
    claims,
    questions,
    cases,
    asOf,
  });
  const moduleByTheme = new Map(modules.map((module) => [module.themeId, module]));
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const claimById = new Map(claims.map((claim) => [claim.claimId, claim]));

  const themes = catalog.themes.map((theme) => {
    const learningModule = moduleByTheme.get(theme.id);
    const moduleQuestionIds = learningModule?.questionIds ?? [];
    const missingQuestionIds = moduleQuestionIds.filter(
      (questionId) => !questionById.has(questionId),
    );
    const missingClaimIds = (learningModule?.normativeClaimIds ?? []).filter(
      (claimId) => !claimById.has(claimId),
    );
    const coverageCount = learningModule?.coverage?.length ?? 0;
    const caseIds = cases
      .filter((practicalCase) => practicalCase.themes?.includes(theme.id))
      .map(({ id }) => id)
      .sort();
    const issues = [];

    if (!learningModule) issues.push("missing-module");
    if (learningModule && moduleQuestionIds.length !== 8) {
      issues.push("module-question-count");
    }
    if (missingQuestionIds.length > 0) issues.push("missing-question-reference");
    if (coverageCount === 0) issues.push("empty-coverage");
    if (missingClaimIds.length > 0) issues.push("missing-claim-reference");

    return {
      themeId: theme.id,
      moduleId: theme.moduleId,
      number: theme.number,
      stream: theme.stream,
      title: theme.title,
      moduleStatus: learningModule?.status ?? "missing",
      academicReviewStatus: learningModule?.academicReviewStatus ?? "missing",
      legalReviewStatus: learningModule?.legalReviewStatus ?? "missing",
      questionCount: moduleQuestionIds.length,
      missingQuestionIds,
      coverageCount,
      claimCount: learningModule?.normativeClaimIds?.length ?? 0,
      missingClaimIds,
      caseIds,
      issues,
    };
  });

  const blockingReviewCount = modules.filter(
    (module) =>
      module.status !== "published" ||
      module.academicReviewStatus !== "approved" ||
      module.legalReviewStatus !== "approved",
  ).length;
  const structuralIssues = themes.filter(({ issues }) => issues.length > 0);
  const targetGaps = [
    {
      asset: "microcases",
      current: progress.minimums.microcases.current,
      target: progress.minimums.microcases.target,
    },
    {
      asset: "fullCases",
      current: progress.minimums.fullCases.current,
      target: progress.minimums.fullCases.target,
    },
    {
      asset: "simulations",
      current: progress.minimums.simulations.current,
      target: progress.minimums.simulations.target,
    },
  ].map((item) => ({ ...item, missing: Math.max(item.target - item.current, 0) }));

  return {
    asOf,
    structuralReady:
      progress.curriculum.modulesMissing.length === 0 && structuralIssues.length === 0,
    publicationReady: blockingReviewCount === 0,
    blockingReviewCount,
    structuralIssues,
    targetGaps,
    progress,
    themes,
  };
}

function renderThemeRow(theme) {
  const review = `${statusLabel(theme.academicReviewStatus)} / ${statusLabel(theme.legalReviewStatus)}`;
  const issues = theme.issues.length > 0 ? theme.issues.join(", ") : "—";
  return `| ${theme.moduleId} | ${escapeTable(theme.title)} | ${theme.questionCount}/8 | ${theme.coverageCount} | ${theme.claimCount} | ${theme.caseIds.join(", ") || "—"} | ${review} | ${issues} |`;
}

export function renderCurriculumAudit(audit) {
  const { progress } = audit;
  const general = audit.themes.filter(({ stream }) => stream === "general");
  const specific = audit.themes.filter(({ stream }) => stream === "specific");
  const missingTargetText = audit.targetGaps
    .map(({ asset, current, target, missing }) => `${asset}: ${current}/${target} (faltan ${missing})`)
    .join("; ");
  const structuralStatus = audit.structuralReady ? "VERDE" : "ROJO";
  const publicationStatus = audit.publicationReady ? "VERDE" : "ROJO — revisión pendiente";

  return `# Auditoría del currículo SS C1

Fecha de corte: ${audit.asOf}. Este documento es un informe de cobertura. No autoriza por sí mismo la publicación de ningún contenido.

## Resultado ejecutivo

| Gate | Resultado | Evidencia |
|---|---|---|
| Cobertura del programa | **${structuralStatus}** | ${progress.curriculum.modulesPresent}/${progress.curriculum.themeTotal} módulos; ${progress.bank.moduleQuestionTotal}/${progress.minimums.moduleQuestions.target} preguntas de módulo |
| Trazabilidad | **${structuralStatus}** | ${progress.bank.claimTotal} afirmaciones normativas; las referencias ausentes se detallan por tema |
| Revisión humana | **${publicationStatus}** | ${audit.blockingReviewCount} módulos no tienen estado académico, jurídico y de publicación aprobado |
| Banco práctico | **INCOMPLETO** | ${missingTargetText} |

## Inventario global

- Programa: ${progress.curriculum.generalThemes} temas generales + ${progress.curriculum.specificThemes} temas específicos.
- Módulos: ${progress.curriculum.modulesPresent}/${progress.curriculum.themeTotal}; faltantes: ${progress.curriculum.modulesMissing.join(", ") || "ninguno"}.
- Preguntas: ${progress.bank.questionTotal} (${progress.bank.moduleQuestionTotal} de módulo y ${progress.bank.practicalQuestionTotal} prácticas).
- Casos: ${progress.bank.caseTotal} (${progress.bank.caseTypeCounts.microcase ?? 0} microcasos, ${progress.bank.caseTypeCounts["full-case"] ?? 0} supuestos completos y ${progress.bank.caseTypeCounts.simulation ?? 0} simulacros).
- Todos los módulos, preguntas, afirmaciones y casos siguen en estado de borrador o revisión pendiente.

## Bloque general — G01 a G23

| Módulo | Tema | Preguntas | Cobertura | Afirmaciones | Casos | Revisión | Incidencias |
|---|---|---:|---:|---:|---|---|---|
${general.map(renderThemeRow).join("\n")}

## Bloque específico — S01 a S13

| Módulo | Tema | Preguntas | Cobertura | Afirmaciones | Casos | Revisión | Incidencias |
|---|---|---:|---:|---:|---|---|---|
${specific.map(renderThemeRow).join("\n")}

## Gaps que todavía impiden cerrar el producto

${audit.targetGaps.map(({ asset, current, target, missing }) => `- **${asset}**: ${current}/${target}; faltan ${missing}.`).join("\n")}
- Auditar que los epígrafes del programa estén cubiertos por las lecciones, no solo por el título del módulo.
- Revisar académica y jurídicamente las fuentes, afirmaciones, preguntas y explicaciones.
- Confirmar el inventario y la exportación del Moodle de Alba. En este repositorio no hay todavía un archivo MBZ ni una URL de aula pública.

## Orden recomendado de revisión humana

1. **S01–S03, MC01, MC02 y CP01**: son la ruta práctica visible y concentran el diagnóstico inicial.
2. **S04–S07**: cotización, recaudación y acción protectora; revisar cálculos, plazos y efectos.
3. **S08–S13**: prestaciones y recursos; revisar fechas de corte, requisitos y cuantías.
4. **G01, G13–G16**: núcleo administrativo y de decisión reutilizable en los casos.
5. **G17–G23**: procedimiento, empleo público, igualdad, datos y administración electrónica.
6. Tras cada lote: actualizar los estados del módulo, revisión académica, revisión jurídica y próxima revisión, junto con el changelog, antes de abrir el gate.

## Evidencia técnica para repetir la auditoría

\`\`\`powershell
npm run content:validate
npm run content:report
npm run content:audit
npm run content:gate-beta
\`\`\`

El gate beta debe permanecer cerrado hasta que la revisión humana y la infraestructura de Moodle estén acreditadas.
`;
}

async function main() {
  const asOf = argumentValue("--as-of") ?? new Date().toISOString().slice(0, 10);
  const outPath = resolve(
    projectRoot,
    argumentValue("--out") ?? "docs/aegis/work/2026-07-29-ss-academy-full/94-curriculum-audit.md",
  );
  const catalog = JSON.parse(
    await readFile(new URL("../content-source/catalog.json", import.meta.url), "utf8"),
  );
  const loaded = Object.fromEntries(
    await Promise.all(
      assetGroups.map(async (group) => [group, await readJsonDirectory(group)]),
    ),
  );
  const audit = buildCurriculumAudit({ catalog, ...loaded, asOf });
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, renderCurriculumAudit(audit), "utf8");
  process.stdout.write(
    `Auditoría curricular: ${audit.themes.length} temas; estructural=${audit.structuralReady ? "verde" : "rojo"}; publicación=${audit.publicationReady ? "verde" : "cerrada"}.\n`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
