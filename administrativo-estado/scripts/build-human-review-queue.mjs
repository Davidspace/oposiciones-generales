import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const groups = ["modules", "claims", "questions", "cases"];
const riskWeight = { "very-high": 4, "medium-high": 3, high: 3, medium: 2, low: 1 };

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

function maxRisk(values) {
  return values
    .filter(Boolean)
    .sort((a, b) => (riskWeight[b] ?? 0) - (riskWeight[a] ?? 0))[0] ?? "medium";
}

function sorted(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function sourceLink(path) {
  return path ? `../../../../${path}` : "#missing";
}

export function buildHumanReviewQueue({ catalog, modules, claims, questions, cases, asOf }) {
  const modulesByTheme = new Map(modules.map((module) => [module.themeId, module]));
  const questionsByTheme = new Map();
  for (const question of questions) {
    for (const themeId of question.themes ?? []) {
      const list = questionsByTheme.get(themeId) ?? [];
      list.push(question);
      questionsByTheme.set(themeId, list);
    }
  }

  const themeRows = catalog.themes.map((theme) => {
    const learningModule = modulesByTheme.get(theme.id);
    const themeClaims = claims.filter((claim) =>
      claim.assetId === theme.moduleId || claim.assetId === theme.id,
    );
    const themeQuestions = questionsByTheme.get(theme.id) ?? [];
    const themeCases = cases.filter((practicalCase) =>
      practicalCase.themes?.includes(theme.id),
    );
    return {
      themeId: theme.id,
      moduleId: theme.moduleId,
      stream: theme.stream,
      number: theme.number,
      title: theme.title,
      updateRisk: theme.updateRisk ?? "medium",
      moduleStatus: learningModule?.status ?? "missing",
      academicReviewStatus: learningModule?.academicReviewStatus ?? "missing",
      legalReviewStatus: learningModule?.legalReviewStatus ?? "missing",
      nextReviewAt: learningModule?.nextReviewAt ?? null,
      claimCount: themeClaims.length || learningModule?.normativeClaimIds?.length || 0,
      questionIds: sorted(themeQuestions.map(({ id }) => id)),
      caseIds: sorted(themeCases.map(({ id }) => id)),
      lessonPath: learningModule?.lessonPath ?? null,
      reviewSheetPath: learningModule?.reviewSheetPath ?? null,
    };
  });

  const caseRows = cases.map((practicalCase) => {
    const themeRisks = (practicalCase.themes ?? []).map((themeId) =>
      catalog.themes.find((theme) => theme.id === themeId)?.updateRisk,
    );
    const assessmentQuestionIds = practicalCase.questionIds ?? practicalCase.generalQuestionIds ?? [];
    return {
      id: practicalCase.id,
      type: practicalCase.type,
      title: practicalCase.title,
      status: practicalCase.status,
      risk: maxRisk(themeRisks),
      themeIds: sorted(practicalCase.themes ?? []),
      questionCount: assessmentQuestionIds.length,
      mainQuestionCount: practicalCase.mainQuestionIds?.length ?? null,
      reserveQuestionCount: practicalCase.reserveQuestionIds?.length ?? null,
      questionIds: assessmentQuestionIds,
      associatedCaseId: practicalCase.caseId ?? null,
      legalReviewStatus: practicalCase.legalReviewStatus ?? "missing",
      academicReviewStatus: practicalCase.academicReviewStatus ?? "missing",
      nextReviewAt: practicalCase.nextReviewAt ?? null,
    };
  });

  const questionPositionCounts = [0, 0, 0, 0];
  for (const question of questions) {
    const position = question.options?.findIndex((option) => option.isCorrect);
    if (position >= 0 && position < 4) questionPositionCounts[position] += 1;
  }
  const highRiskThemeIds = themeRows
    .filter(({ updateRisk }) => (riskWeight[updateRisk] ?? 0) >= 3)
    .sort((a, b) => (riskWeight[b.updateRisk] ?? 0) - (riskWeight[a.updateRisk] ?? 0))
    .map(({ themeId }) => themeId);

  return {
    schemaVersion: "ss-human-review-queue-v1",
    asOf,
    publicationStatus: "closed-until-human-review",
    totals: { themes: themeRows.length, modules: modules.length, claims: claims.length, questions: questions.length, cases: cases.length },
    reviewStatus: {
      moduleAcademic: modules.filter((module) => module.academicReviewStatus === "approved").length,
      moduleLegal: modules.filter((module) => ["approved", "not-required"].includes(module.legalReviewStatus)).length,
      claimNormative: claims.filter((claim) => ["reviewed", "approved"].includes(claim.reviewStatus)).length,
      questionAcademic: questions.filter((question) => question.academicReviewStatus === "approved").length,
      questionLegal: questions.filter((question) => ["approved", "not-required"].includes(question.legalReviewStatus)).length,
      caseAcademic: cases.filter((practicalCase) => practicalCase.academicReviewStatus === "approved").length,
      caseLegal: cases.filter((practicalCase) => ["approved", "not-required"].includes(practicalCase.legalReviewStatus)).length,
    },
    questionPositionCounts,
    highRiskThemeIds,
    themes: themeRows.sort((a, b) => {
      const riskDifference = (riskWeight[b.updateRisk] ?? 0) - (riskWeight[a.updateRisk] ?? 0);
      return riskDifference || a.moduleId.localeCompare(b.moduleId);
    }),
    cases: caseRows.sort((a, b) => {
      const riskDifference = (riskWeight[b.risk] ?? 0) - (riskWeight[a.risk] ?? 0);
      return riskDifference || a.id.localeCompare(b.id);
    }),
    sourceAssets: {
      modules: "content-source/modules/",
      claims: "content-source/claims/",
      questions: "content-source/questions/",
      cases: "content-source/cases/",
    },
    reviewProtocol: [
      "Leer la hoja de repaso y la lección del módulo antes de revisar sus preguntas.",
      "Comprobar el epígrafe oficial, la fuente BOE y el corte normativo declarado.",
      "Validar cada afirmación: texto, localizador, vigencia y dependencia de activos.",
      "Resolver cada pregunta sin mirar la clave; confirmar clave, distractores y feedback.",
      "Marcar dificultad y tipo de error; registrar toda modificación en changeLog.",
      "Revisar los casos completos como una única cadena de hechos y decisiones.",
      "No cambiar a aprobado hasta cerrar revisión académica, jurídica y normativa.",
    ],
  };
}

function renderChecklist() {
  return [
    "### Checklist por módulo",
    "",
    "- [ ] Epígrafe y alcance coinciden con el programa oficial.",
    "- [ ] La hoja de repaso no introduce reglas sin fuente trazable.",
    "- [ ] Cada afirmación tiene localizador concreto y fecha de corte correcta.",
    "- [ ] Las ocho preguntas tienen una sola respuesta defendible.",
    "- [ ] Los distractores representan errores plausibles y tienen feedback útil.",
    "- [ ] La dificultad y el tipo de error son razonables para C1.",
    "- [ ] Cambios registrados en la procedencia y revisión marcada.",
    "",
    "### Checklist por caso práctico",
    "",
    "- [ ] Los hechos son suficientes y no contienen ambigüedades no declaradas.",
    "- [ ] Todas las preguntas parten de los mismos hechos y supuestos.",
    "- [ ] El orden mide decisiones y no memoria accidental del enunciado.",
    "- [ ] La puntuación, reservas y duración son coherentes con el diseño.",
    "- [ ] Las referencias normativas cubren cada decisión relevante.",
    "- [ ] El caso no copia un enunciado protegido ni promete equivalencia con el tribunal.",
    "",
  ].join("\n");
}

export function renderHumanReviewQueue(queue) {
  const lines = [
    `# Cola de revisión humana SS CasoLab — ${queue.asOf}`,
    "",
    "> Estado: publicación cerrada hasta completar revisión académica, jurídica y normativa. Este documento es una guía operativa para Alba y David; no convierte ningún borrador en material publicable.",
    "",
    `**Inventario:** ${queue.totals.themes} temas · ${queue.totals.modules} módulos · ${queue.totals.claims} afirmaciones · ${queue.totals.questions} preguntas · ${queue.totals.cases} casos.`,
    `**Distribución de la respuesta correcta:** A ${queue.questionPositionCounts[0]} · B ${queue.questionPositionCounts[1]} · C ${queue.questionPositionCounts[2]} · D ${queue.questionPositionCounts[3]}.`,
    `**Revisión aprobada:** módulos académica ${queue.reviewStatus.moduleAcademic}/${queue.totals.modules}; módulos jurídica ${queue.reviewStatus.moduleLegal}/${queue.totals.modules}; afirmaciones normativas ${queue.reviewStatus.claimNormative}/${queue.totals.claims}.`,
    "",
    "## Orden de trabajo recomendado",
    "",
    "1. Revisar primero los temas de riesgo `very-high` y `high`, en el orden de la tabla.",
    "2. Completar un bloque por sesión: una hoja de repaso, sus afirmaciones y sus preguntas.",
    "3. Revisar MC01–MC08 después de cerrar sus temas fuente; revisar CP01–CP04 al final de cada grupo.",
    "4. Registrar cambios en los JSON y conservar la fecha de corte. No exportar a Moodle mientras exista un estado `pending`.",
    "",
    `**Temas prioritarios:** ${queue.highRiskThemeIds.join(", ")}.`,
    "",
    "## Primer lote beta ya preparado",
    "",
    "El gate estructural del lote beta está verde: 8 módulos (`G01`, `G13`–`G16`, `S01`–`S03`), 92 preguntas referenciadas, 120 afirmaciones y 3 casos (`MC01`, `MC02`, `CP01`). El paquete privado de revisión se genera con `npm run content:review-pack-beta` en `outputs/review/beta/`. La publicación sigue cerrada: el último gate registra 429 incidencias de revisión (estado editorial, académica, jurídica y normativa).",
    "",
    "## Cola por tema",
    "",
    "| Prioridad | Módulo | Bloque | Tema | Riesgo | Claims | Preguntas | Casos | Revisión | Archivos |",
    "|---|---|---|---|---|---:|---:|---|---|---|",
  ];
  for (const theme of queue.themes) {
    lines.push(`| ${queue.highRiskThemeIds.includes(theme.themeId) ? "1" : "2"} | ${theme.moduleId} | ${theme.stream === "specific" ? "Específico" : "General"} | ${theme.title} | ${theme.updateRisk} | ${theme.claimCount} | ${theme.questionIds.length} | ${theme.caseIds.join(", ") || "—"} | académica ${theme.academicReviewStatus}; jurídica ${theme.legalReviewStatus} | [repaso](${sourceLink(theme.reviewSheetPath)}); [lección](${sourceLink(theme.lessonPath)}) |`);
  }
  lines.push("", "## Cola por caso práctico", "", "| Prioridad | ID | Tipo | Título | Riesgo | Temas | Preguntas | Revisión |", "|---|---|---|---|---|---|---:|---|");
  for (const practicalCase of queue.cases) {
    const count = practicalCase.reserveQuestionCount === null ? `${practicalCase.questionCount}` : `${practicalCase.questionCount} (${practicalCase.mainQuestionCount} + ${practicalCase.reserveQuestionCount} reservas)`;
    const associatedCase = practicalCase.associatedCaseId ? `; caso ${practicalCase.associatedCaseId}` : "";
    lines.push(`| ${practicalCase.risk === "very-high" || practicalCase.risk === "high" ? "1" : "2"} | ${practicalCase.id} | ${practicalCase.type} | ${practicalCase.title} | ${practicalCase.risk} | ${practicalCase.themeIds.join(", ") || "—"} | ${count}${associatedCase} | académica ${practicalCase.academicReviewStatus}; jurídica ${practicalCase.legalReviewStatus} |`);
  }
  lines.push("", "## Protocolo de revisión", "", ...queue.reviewProtocol.map((item) => `- [ ] ${item}`), "", renderChecklist(), "## Archivos fuente", "", "- Módulos: `content-source/modules/`.", "- Afirmaciones: `content-source/claims/`.", "- Preguntas: `content-source/questions/`.", "- Casos: `content-source/cases/`.", "- Validador: `npm run content:validate`.", "- Gate de publicación: `npm run content:gate-beta` (debe seguir cerrado hasta aprobar revisiones).");
  return `${lines.join("\n")}\n`;
}

async function main() {
  const asOf = process.argv.includes("--as-of") ? process.argv[process.argv.indexOf("--as-of") + 1] : new Date().toISOString().slice(0, 10);
  const outPath = resolve(projectRoot, process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : "docs/aegis/work/2026-07-29-ss-academy-full/96-human-review-queue.md");
  const catalog = JSON.parse(await readFile(new URL("../content-source/catalog.json", import.meta.url), "utf8"));
  const loaded = Object.fromEntries(await Promise.all(groups.map(async (group) => [group, await readJsonDirectory(group)])));
  const queue = buildHumanReviewQueue({ catalog, ...loaded, asOf });
  await mkdir(resolve(outPath, ".."), { recursive: true });
  await writeFile(outPath, renderHumanReviewQueue(queue), "utf8");
  process.stdout.write(`Cola de revisión humana: ${queue.totals.themes} temas; ${queue.totals.questions} preguntas; ${queue.totals.cases} casos.\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
