import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  validateCase,
  validateCatalog,
  validateContentGraph,
  validateModule,
  validateNormativeClaim,
  validateQuestion,
  validateRepositoryContent,
} from "../scripts/validate-ss-content.mjs";

const catalog = JSON.parse(
  await readFile(new URL("../content-source/catalog.json", import.meta.url)),
);
const canonicalQuestion = JSON.parse(
  await readFile(
    new URL("../content-source/questions/ss-03-q101.json", import.meta.url),
  ),
);
const canonicalCase = JSON.parse(
  await readFile(new URL("../content-source/cases/MC01.json", import.meta.url)),
);

function provenance(version = "1.0.0") {
  return {
    createdBy: "test-editor",
    createdAt: "2026-07-29",
    changeLog: [
      {
        version,
        date: "2026-07-29",
        changedBy: "test-editor",
        summary: "Activo de prueba.",
      },
    ],
  };
}

test("the complete repository passes the executable editorial graph", async () => {
  const repository = await validateRepositoryContent();
  assert.deepEqual(repository.errors, []);
  assert.ok(repository.counts.modules >= 10);
  assert.ok(
    repository.counts.questions >= repository.counts.modules * 8 + 5,
  );
});

test("the SS catalog contains the exact 23 + 13 theme sequence", () => {
  assert.deepEqual(validateCatalog(catalog), []);
  assert.deepEqual(
    catalog.themes.map((theme) => theme.id),
    [
      ...Array.from({ length: 23 }, (_, index) =>
        `g-${String(index + 1).padStart(2, "0")}`,
      ),
      ...Array.from({ length: 13 }, (_, index) =>
        `ss-${String(index + 1).padStart(2, "0")}`,
      ),
    ],
  );
  assert.equal(
    catalog.themes.filter((theme) => theme.stream === "general").length,
    23,
  );
  assert.equal(
    catalog.themes.filter((theme) => theme.stream === "specific").length,
    13,
  );
});

test("the catalog validator rejects duplicate and incomplete programs", () => {
  const duplicate = structuredClone(catalog);
  duplicate.themes[1].id = duplicate.themes[0].id;
  assert.ok(
    validateCatalog(duplicate).some((error) => error.includes("duplicado")),
  );

  const incomplete = structuredClone(catalog);
  incomplete.themes.pop();
  assert.ok(
    validateCatalog(incomplete).some((error) =>
      error.includes("23 generales y 13 específicos"),
    ),
  );
});

test("the validator rejects a publishable question without option feedback", () => {
  const question = {
    id: "ss-03-q001",
    version: "1.0.0",
    status: "published",
    themes: ["ss-03"],
    prompt: "¿Qué sujeto debe actuar?",
    legislationCutoffAt: "2026-03-04",
    academicReviewer: "Alba",
    reviewedAt: "2026-07-29",
    sources: [
      {
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724",
        location: "artículo 139",
        consultedAt: "2026-07-29"
      }
    ],
    options: [
      { text: "A", isCorrect: true, feedback: "Explicación correcta." },
      {
        text: "B",
        isCorrect: false,
        feedback: "",
        errorType: "confusion-sujetos",
        reviewTarget: "Tema 3"
      },
      {
        text: "C",
        isCorrect: false,
        feedback: "Explicación C.",
        errorType: "confusion-sujetos",
        reviewTarget: "Tema 3"
      },
      {
        text: "D",
        isCorrect: false,
        feedback: "Explicación D.",
        errorType: "confusion-sujetos",
        reviewTarget: "Tema 3"
      }
    ]
  };

  assert.ok(
    validateQuestion(question, catalog).some((error) =>
      error.includes("falta feedback específico"),
    ),
  );
});

test("publication requires traceable academic and legal decisions", () => {
  const question = structuredClone(canonicalQuestion);
  question.status = "published";
  let errors = validateQuestion(question, catalog);
  assert.ok(errors.some((error) => error.includes("revisión académica aprobada")));
  assert.ok(errors.some((error) => error.includes("revisión jurídica")));

  question.academicReviewStatus = "approved";
  question.academicReviewer = "Revisión humana";
  question.reviewedAt = "2026-07-29";
  question.legalReviewStatus = "not-required";
  errors = validateQuestion(question, catalog);
  assert.deepEqual(errors, []);

  const currentChange = question.provenance.changeLog.find(
    (change) => change.version === question.version,
  );
  assert.ok(currentChange);
  currentChange.version = "0.0.0";
  assert.ok(
    validateQuestion(question, catalog).some((error) =>
      error.includes("versión actual"),
    ),
  );

  const practicalCase = structuredClone(canonicalCase);
  practicalCase.status = "published";
  errors = validateCase(practicalCase, catalog);
  assert.ok(errors.some((error) => error.includes("revisión académica aprobada")));
  assert.ok(errors.some((error) => error.includes("revisión jurídica aprobada")));

  practicalCase.academicReviewStatus = "approved";
  practicalCase.academicReviewer = "Revisión académica humana";
  practicalCase.academicReviewedAt = "2026-07-29";
  practicalCase.legalReviewStatus = "approved";
  practicalCase.legalReviewer = "Revisión jurídica humana";
  practicalCase.legalReviewedAt = "2026-07-29";
  assert.deepEqual(validateCase(practicalCase, catalog), []);
});

test("a publishable module needs coverage, eight questions and required reviews", () => {
  const learningModule = {
    id: "G01",
    themeId: "g-01",
    version: "1.0.0",
    status: "published",
    title: "Constitución: estructura, contenido y reforma",
    learningOutcomes: ["Distinguir los procedimientos de reforma."],
    decisions: ["Seleccionar el procedimiento aplicable."],
    coverage: [
      {
        officialClause: "Estructura y contenido",
        objective: "Localizar la materia en la Constitución.",
        sectionId: "g01-estructura",
        activityIds: ["g-01-q001"]
      }
    ],
    lessonPath: "content-source/modules/G01/lesson.md",
    reviewSheetPath: "content-source/modules/G01/review.md",
    normativeClaimIds: ["clm-g-01-001"],
    questionIds: Array.from(
      { length: 8 },
      (_, index) => `g-01-q${String(index + 1).padStart(3, "0")}`,
    ),
    microcaseIds: [],
    academicReviewStatus: "approved",
    academicReviewer: "Alba",
    reviewedAt: "2026-07-29",
    legalReviewStatus: "not-required",
    validFrom: "2026-07-29",
    validTo: null,
    legislationCutoffAt: "2026-07-29",
    nextReviewAt: "2026-10-29",
    provenance: provenance(),
  };

  assert.deepEqual(validateModule(learningModule, catalog), []);

  const incomplete = structuredClone(learningModule);
  incomplete.coverage = [];
  incomplete.questionIds.pop();
  assert.ok(
    validateModule(incomplete, catalog).some((error) =>
      error.includes("coverage"),
    ),
  );
  assert.ok(
    validateModule(incomplete, catalog).some((error) => error.includes("ocho")),
  );

  const highRisk = structuredClone(learningModule);
  highRisk.id = "G12";
  highRisk.themeId = "g-12";
  assert.ok(
    validateModule(highRisk, catalog).some((error) =>
      error.includes("revisión jurídica aprobada"),
    ),
  );
});

test("normative claims require a pinpoint source and reverse dependencies", () => {
  const claim = {
    claimId: "clm-g-01-001",
    assetId: "G01",
    version: "1.0.0",
    statement: "La Constitución se estructura en un preámbulo y un articulado.",
    sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229",
    sourceLocation: "estructura del texto consolidado",
    officialPublication: "BOE-A-1978-31229",
    validFrom: "1978-12-29",
    validTo: null,
    legislationCutoffAt: "2026-07-29",
    owner: "Alba",
    reviewStatus: "reviewed",
    sourceCheckedAt: "2026-07-29",
    reviewedAt: "2026-07-29",
    nextReviewAt: "2026-10-29",
    dependentAssetIds: ["G01", "g-01-q001"],
    provenance: provenance(),
  };

  assert.deepEqual(validateNormativeClaim(claim), []);
  claim.dependentAssetIds = [];
  assert.ok(
    validateNormativeClaim(claim).some((error) =>
      error.includes("dependentAssetIds"),
    ),
  );
});

test("case manifests enforce the size of each assessment type", () => {
  const practicalCase = {
    id: "CP01",
    version: "1.0.0",
    status: "draft",
    type: "full-case",
    title: "Alta y encuadramiento",
    scenario: "Una empresa inicia su actividad y tramita el alta de su plantilla.",
    originality: "original",
    assumptions: ["Todas las fechas se expresan en horario peninsular."],
    themes: ["ss-02", "ss-03", "ss-04"],
    competencies: ["encuadramiento", "secuencia", "cálculo"],
    questionIds: Array.from(
      { length: 18 },
      (_, index) => `ss-03-q${String(index + 1).padStart(3, "0")}`,
    ),
    mainQuestionIds: Array.from(
      { length: 15 },
      (_, index) => `ss-03-q${String(index + 1).padStart(3, "0")}`,
    ),
    reserveQuestionIds: Array.from(
      { length: 3 },
      (_, index) => `ss-03-q${String(index + 16).padStart(3, "0")}`,
    ),
    coverage: [
      {
        themeId: "ss-02",
        competency: "encuadramiento",
        questionIds: Array.from(
          { length: 6 },
          (_, index) => `ss-03-q${String(index + 1).padStart(3, "0")}`,
        ),
      },
      {
        themeId: "ss-03",
        competency: "secuencia",
        questionIds: Array.from(
          { length: 6 },
          (_, index) => `ss-03-q${String(index + 7).padStart(3, "0")}`,
        ),
      },
      {
        themeId: "ss-04",
        competency: "cálculo",
        questionIds: Array.from(
          { length: 6 },
          (_, index) => `ss-03-q${String(index + 13).padStart(3, "0")}`,
        ),
      },
    ],
    consistencyRules: ["La fecha de inicio se mantiene en todo el supuesto."],
    durationMinutes: 30,
    scoring: { correct: 1, wrong: -0.25, blank: 0 },
    normativeClaimIds: ["clm-ss-03-001"],
    difficulty: "medium",
    visibility: "practice",
    validFrom: "2026-07-29",
    validTo: null,
    legislationCutoffAt: "2026-07-29",
    nextReviewAt: "2026-10-29",
    academicReviewStatus: "pending",
    legalReviewStatus: "pending",
    provenance: provenance(),
  };

  assert.deepEqual(validateCase(practicalCase, catalog), []);
  practicalCase.questionIds.pop();
  assert.ok(
    validateCase(practicalCase, catalog).some((error) =>
      error.includes("18 preguntas"),
    ),
  );
  practicalCase.questionIds.push("ss-03-q018");
  practicalCase.reserveQuestionIds = [
    "ss-03-q015",
    "ss-03-q016",
    "ss-03-q017",
  ];
  assert.ok(
    validateCase(practicalCase, catalog).some((error) =>
      error.includes("15 principales"),
    ),
  );
});

test("the content graph resolves module assets and reverse claim dependencies", () => {
  const question = {
    id: "g-01-q001",
    status: "draft",
    themes: ["g-01"],
    normativeClaimIds: ["clm-g-01-001"],
  };
  const learningModule = {
    id: "G01",
    themeId: "g-01",
    status: "draft",
    lessonPath: "content-source/modules/G01/lesson.md",
    reviewSheetPath: "content-source/modules/G01/review.md",
    normativeClaimIds: ["clm-g-01-001"],
    questionIds: ["g-01-q001"],
    microcaseIds: [],
    coverage: [
      {
        officialClause: "Estructura y contenido",
        activityIds: ["g-01-q001"],
      },
    ],
  };
  const claim = {
    claimId: "clm-g-01-001",
    assetId: "G01",
    dependentAssetIds: ["G01", "g-01-q001"],
  };

  const documents = {
    modules: [{ entry: "G01/module.json", value: learningModule }],
    questions: [{ entry: "g-01-q001.json", value: question }],
    claims: [{ entry: "clm-g-01-001.json", value: claim }],
    cases: [],
    availablePaths: new Set([
      "content-source/modules/G01/lesson.md",
      "content-source/modules/G01/review.md",
    ]),
  };

  assert.deepEqual(validateContentGraph(documents), []);

  const broken = structuredClone({
    modules: documents.modules,
    questions: documents.questions,
    claims: documents.claims,
    cases: documents.cases,
  });
  broken.modules[0].value.questionIds.push("g-01-q999");
  broken.claims[0].value.dependentAssetIds = ["G01"];

  const errors = validateContentGraph({
    ...broken,
    availablePaths: documents.availablePaths,
  });
  assert.ok(errors.some((error) => error.includes("g-01-q999 no existe")));
  assert.ok(
    errors.some((error) =>
      error.includes("clm-g-01-001: falta dependencia inversa g-01-q001"),
    ),
  );
});

test("the content graph rejects duplicate ids and incomplete published modules", () => {
  const question = {
    id: "g-01-q001",
    status: "draft",
    themes: ["g-01"],
    normativeClaimIds: ["clm-g-01-001"],
  };
  const learningModule = {
    id: "G01",
    themeId: "g-01",
    status: "published",
    lessonPath: "content-source/modules/G01/lesson.md",
    reviewSheetPath: "content-source/modules/G01/review.md",
    normativeClaimIds: ["clm-g-01-001"],
    questionIds: ["g-01-q001"],
    microcaseIds: [],
    coverage: [{ activityIds: [] }],
  };
  const claim = {
    claimId: "clm-g-01-001",
    assetId: "G01",
    reviewStatus: "pending",
    dependentAssetIds: ["G01", "g-01-q001"],
  };

  const errors = validateContentGraph({
    modules: [{ entry: "G01/module.json", value: learningModule }],
    questions: [
      { entry: "first.json", value: question },
      { entry: "duplicate.json", value: structuredClone(question) },
    ],
    claims: [{ entry: "claim.json", value: claim }],
    cases: [],
    availablePaths: new Set([
      "content-source/modules/G01/lesson.md",
      "content-source/modules/G01/review.md",
    ]),
  });

  assert.ok(errors.some((error) => error.includes("id duplicado g-01-q001")));
  assert.ok(
    errors.some((error) =>
      error.includes("publicado contiene pregunta no publicada g-01-q001"),
    ),
  );
  assert.ok(
    errors.some((error) =>
      error.includes("g-01-q001 no aparece en coverage"),
    ),
  );
  assert.ok(
    errors.some((error) =>
      error.includes("clm-g-01-001 sigue sin revisión para publicar G01"),
    ),
  );
});

test("published graph nodes cannot depend on draft cases or questions", () => {
  const errors = validateContentGraph({
    modules: [
      {
        entry: "G01/module.json",
        value: {
          id: "G01",
          themeId: "g-01",
          status: "published",
          lessonPath: "content-source/modules/G01/lesson.md",
          reviewSheetPath: "content-source/modules/G01/review.md",
          normativeClaimIds: [],
          questionIds: [],
          microcaseIds: ["MC01"],
          coverage: [],
        },
      },
    ],
    questions: [
      {
        entry: "ss-03-q101.json",
        value: {
          id: "ss-03-q101",
          status: "draft",
          themes: ["ss-03"],
          normativeClaimIds: [],
        },
      },
    ],
    claims: [],
    cases: [
      {
        entry: "MC01.json",
        value: {
          id: "MC01",
          type: "microcase",
          status: "draft",
          questionIds: ["ss-03-q101"],
          normativeClaimIds: [],
        },
      },
      {
        entry: "MC02.json",
        value: {
          id: "MC02",
          type: "microcase",
          status: "published",
          questionIds: ["ss-03-q101"],
          normativeClaimIds: [],
        },
      },
    ],
    availablePaths: new Set([
      "content-source/modules/G01/lesson.md",
      "content-source/modules/G01/review.md",
    ]),
  });

  assert.ok(
    errors.some((error) =>
      error.includes("publicado contiene microcaso no publicado MC01"),
    ),
  );
  assert.ok(
    errors.some((error) =>
      error.includes("MC02: publicado contiene pregunta no publicada"),
    ),
  );
});

test("coverage section ids must resolve to stable lesson anchors", () => {
  const errors = validateContentGraph({
    modules: [
      {
        entry: "S01/module.json",
        value: {
          id: "S01",
          themeId: "ss-01",
          status: "draft",
          lessonPath: "content-source/modules/S01/lesson.md",
          reviewSheetPath: "content-source/modules/S01/review.md",
          normativeClaimIds: [],
          questionIds: [],
          microcaseIds: [],
          coverage: [{ sectionId: "s01-missing", activityIds: [] }],
        },
      },
    ],
    questions: [],
    claims: [],
    cases: [],
    availablePaths: new Set([
      "content-source/modules/S01/lesson.md",
      "content-source/modules/S01/review.md",
    ]),
    availableFileContents: new Map([
      ["content-source/modules/S01/lesson.md", "## Apartado {#s01-existing}"],
    ]),
  });

  assert.ok(
    errors.some((error) =>
      error.includes("ancla s01-missing no existe en la lección"),
    ),
  );
});
