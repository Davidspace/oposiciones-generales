import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const AS_OF = "2026-07-30";
const NEXT_REVIEW = "2026-08-30";
const CREATED_BY = "codex-assisted-simulation-draft";
const TRLGSS = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724";

const SIMULATIONS = [
  {
    id: "SIM01",
    caseId: "CP01",
    extraQuestionId: "g-01-q003",
    title: "Simulacro de consolidaciÃ³n",
    scenario:
      "ConfiguraciÃ³n de consolidaciÃ³n con 73 preguntas de los 36 mÃ³dulos y un supuesto completo asociado. La selecciÃ³n busca cubrir el programa completo y medir errores de regla, concepto, plazo y secuencia.",
    difficulty: "high",
    summary: "Banco de prÃ¡ctica reutilizable antes de la configuraciÃ³n final de Moodle.",
  },
  {
    id: "SIM02",
    caseId: "CP03",
    extraQuestionId: "g-01-q004",
    title: "Simulacro final con banco reservado",
    scenario:
      "ConfiguraciÃ³n final de 73 preguntas de los 36 mÃ³dulos y un supuesto de accidente, incapacidad y protecciÃ³n familiar. La selecciÃ³n queda pendiente de calibrar y de sustituir los Ã­tems de prÃ¡ctica por el banco assessment-only revisado.",
    difficulty: "high",
    summary: "Borrador de simulacro final; requiere banco reservado y revisiÃ³n de dificultad.",
  },
];

function provenance(summary) {
  return {
    createdBy: CREATED_BY,
    createdAt: AS_OF,
    changeLog: [{ version: "0.1.0", date: AS_OF, changedBy: CREATED_BY, summary }],
  };
}

function writeJson(path, value) {
  return writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function generate() {
  const catalog = await readJson(resolve(projectRoot, "content-source/catalog.json"));
  const questionDirectory = resolve(projectRoot, "content-source/questions");
  const caseDirectory = resolve(projectRoot, "content-source/cases");
  const claimDirectory = resolve(projectRoot, "content-source/claims");
  await mkdir(caseDirectory, { recursive: true });
  await mkdir(claimDirectory, { recursive: true });

  const moduleQuestionIds = [];
  for (const theme of catalog.themes) {
    const learningModule = await readJson(
      resolve(projectRoot, `content-source/modules/${theme.moduleId}/module.json`),
    );
    moduleQuestionIds.push(...(learningModule.questionIds ?? []).slice(0, 2));
  }
  if (moduleQuestionIds.length !== 72) {
    throw new Error(`La selección de dos preguntas por módulo produjo ${moduleQuestionIds.length} preguntas.`);
  }

  for (const simulation of SIMULATIONS) {
    const generalQuestionIds = [...moduleQuestionIds, simulation.extraQuestionId];
    if (new Set(generalQuestionIds).size !== 73) {
      throw new Error(`${simulation.id}: la selección no contiene 73 preguntas únicas.`);
    }
    const questions = await Promise.all(
      generalQuestionIds.map((questionId) => readJson(resolve(questionDirectory, `${questionId}.json`))),
    );
    const competencies = [...new Set(questions.map((question) => question.competency))];
    const coverage = questions.map((question, index) => ({
      themeId: question.themes[0],
      competency: question.competency,
      questionIds: [generalQuestionIds[index]],
    }));
    const claimId = `clm-ss-01-${simulation.id === "SIM01" ? "701" : "702"}`;
    const claim = {
      claimId,
      assetId: simulation.id,
      version: "0.1.0",
      statement: simulation.summary,
      sourceUrl: TRLGSS,
      sourceLocation: "Configuración editorial del simulacro; cada ítem conserva su propia fuente normativa.",
      officialPublication: "BOE-A-2015-11724",
      validFrom: AS_OF,
      validTo: null,
      legislationCutoffAt: AS_OF,
      owner: "equipo-editorial-ss-casolab",
      reviewStatus: "pending",
      sourceCheckedAt: AS_OF,
      reviewedAt: null,
      nextReviewAt: NEXT_REVIEW,
      dependentAssetIds: [simulation.id, simulation.caseId, ...generalQuestionIds],
      provenance: provenance(`Afirmación de configuración de borrador para ${simulation.id}.`),
    };
    await writeJson(resolve(claimDirectory, `${claimId}.json`), claim);
    await writeJson(resolve(caseDirectory, `${simulation.id}.json`), {
      id: simulation.id,
      version: "0.1.0",
      status: "draft",
      type: "simulation",
      title: simulation.title,
      scenario: simulation.scenario,
      originality: "original",
      assumptions: [
        "La selección de 73 preguntas se utiliza como configuración inicial y no como banco definitivo.",
        "El supuesto completo asociado conserva sus 15 preguntas principales y 3 reservas en un activo separado.",
        "La duración objetivo es de 120 minutos y la puntuación es directa +1/-0,25/0.",
        "Los hechos se revisarán con la normativa vigente antes de cualquier publicación.",
      ],
      themes: catalog.themes.map((theme) => theme.id),
      competencies,
      coverage,
      generalQuestionIds,
      caseId: simulation.caseId,
      consistencyRules: [
        "La selección debe cubrir los 36 temas y mantener 73 preguntas generales únicas.",
        "El supuesto completo se resuelve con su propia secuencia y sus reservas declaradas.",
        "El simulacro informa puntuación directa, cobertura y rutas de repaso; no declara apto o no apto.",
        "SIM02 requiere sustituir o etiquetar el banco assessment-only antes de la publicación.",
      ],
      durationMinutes: 120,
      scoring: { correct: 1, wrong: -0.25, blank: 0 },
      difficulty: simulation.difficulty,
      visibility: "assessment-only",
      normativeClaimIds: [claimId],
      validFrom: AS_OF,
      validTo: null,
      legislationCutoffAt: AS_OF,
      nextReviewAt: NEXT_REVIEW,
      academicReviewStatus: "pending",
      legalReviewStatus: "pending",
      provenance: provenance(`Borrador de ${simulation.id} con 73 preguntas y ${simulation.caseId}.`),
    });
  }
  process.stdout.write("Generados SIM01 y SIM02 como configuraciones de borrador.\n");
}

await generate();
