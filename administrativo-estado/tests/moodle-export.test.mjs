import assert from "node:assert/strict";
import test from "node:test";

import {
  createQuestionBankBundle,
  exportQuestionsToMoodleXml,
  questionToMoodleXml,
  verifyQuestionBankBundle,
} from "../scripts/export-moodle-questions.mjs";

const publishedQuestion = {
  id: "ss-03-q001",
  version: "1.2.0",
  status: "published",
  themes: ["ss-03"],
  epigraph: "Inscripción de empresas",
  competency: "Elegir el trámite aplicable",
  difficulty: "medium",
  prompt: "¿Qué actuación corresponde al inicio de la actividad?",
  options: [
    {
      text: "Solicitar la inscripción antes del inicio.",
      isCorrect: true,
      feedback: "Correcto: identifica el momento y el trámite.",
    },
    {
      text: "Esperar al primer recibo.",
      isCorrect: false,
      feedback: "No: confunde inscripción y recaudación.",
      errorType: "confusion-secuencia",
      reviewTarget: "S03, secuencia de inscripción",
    },
    {
      text: "Tramitar solo la baja.",
      isCorrect: false,
      feedback: "No: la baja no inicia la actividad.",
      errorType: "confusion-tramite",
      reviewTarget: "S03, mapa de trámites",
    },
    {
      text: "No realizar ninguna actuación.",
      isCorrect: false,
      feedback: "No: omite la obligación descrita.",
      errorType: "omision-regla",
      reviewTarget: "S03, regla principal",
    },
  ],
  normativeClaimIds: ["clm-ss-03-001"],
  sources: [
    {
      url: "https://www.boe.es/ejemplo?uno=1&dos=2",
      location: "artículo 138",
      consultedAt: "2026-07-29",
    },
  ],
  validFrom: "2026-07-29",
  validTo: null,
  legislationCutoffAt: "2026-07-29",
  visibility: "practice",
  academicReviewStatus: "approved",
  academicReviewer: "Revisión humana",
  reviewedAt: "2026-07-29",
  legalReviewStatus: "not-required",
};

test("a published question exports Moodle category, identity and four feedbacks", () => {
  const xml = exportQuestionsToMoodleXml([publishedQuestion]);

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /\$course\$\/top\/SS CasoLab\/S03/);
  assert.match(xml, /ss-03-q001 \| v1\.2\.0/);
  assert.match(xml, /¿Qué actuación corresponde al inicio de la actividad\?/);
  assert.equal((xml.match(/<answer fraction=/g) ?? []).length, 4);
  assert.equal((xml.match(/fraction="100"/g) ?? []).length, 1);
  assert.equal((xml.match(/fraction="-25"/g) ?? []).length, 3);
  assert.match(xml, /Correcto: identifica el momento y el trámite\./);
  assert.match(xml, /Error:<\/strong> confusion-secuencia/);
  assert.match(xml, /Repaso:<\/strong> S03, secuencia de inscripción/);
  assert.match(xml, /Corte normativo:<\/strong> 2026-07-29/);
  assert.match(xml, /https:\/\/www\.boe\.es\/ejemplo\?uno=1&amp;dos=2/);
});

test("the exporter rejects drafts and neutralizes a CDATA terminator", () => {
  assert.throws(
    () => questionToMoodleXml({ ...publishedQuestion, status: "draft" }),
    /no está publicada/,
  );

  const xml = questionToMoodleXml({
    ...publishedQuestion,
    prompt: "Texto ]]> todavía válido",
  });
  assert.doesNotMatch(xml, /Texto \]\]> todavía válido/);
  assert.match(xml, /Texto \]\]&gt; todavía válido/);

  assert.throws(
    () =>
      questionToMoodleXml({
        ...publishedQuestion,
        academicReviewStatus: "pending",
      }),
    /revisión académica aprobada/,
  );
});

test("the full export is deterministic and groups each theme once", () => {
  const second = {
    ...structuredClone(publishedQuestion),
    id: "g-01-q001",
    themes: ["g-01"],
  };
  const xml = exportQuestionsToMoodleXml([publishedQuestion, second]);

  assert.equal((xml.match(/question type="category"/g) ?? []).length, 2);
  assert.ok(xml.indexOf("/G01") < xml.indexOf("/S03"));
  assert.equal(xml, exportQuestionsToMoodleXml([second, publishedQuestion]));
});

test("the question bank manifest detects source and output drift", () => {
  const source = `${JSON.stringify(publishedQuestion, null, 2)}\n`;
  const bundle = createQuestionBankBundle({
    catalogSource: "{\"schemaVersion\":\"2.0.0\"}\n",
    questionDocuments: [
      { entry: "ss-03-q001.json", source, value: publishedQuestion },
    ],
    generatedAt: "2026-07-29T12:00:00.000Z",
  });

  assert.equal(bundle.manifest.questions[0].id, "ss-03-q001");
  assert.equal(bundle.manifest.questions[0].version, "1.2.0");
  assert.equal(bundle.manifest.sources.length, 2);
  assert.deepEqual(
    verifyQuestionBankBundle(bundle, {
      catalogSource: "{\"schemaVersion\":\"2.0.0\"}\n",
      questionDocuments: [
        { entry: "ss-03-q001.json", source, value: publishedQuestion },
      ],
    }),
    [],
  );

  const errors = verifyQuestionBankBundle(bundle, {
    catalogSource: "{\"schemaVersion\":\"2.0.0\"}\n",
    questionDocuments: [
      {
        entry: "ss-03-q001.json",
        source: `${source}\n`,
        value: publishedQuestion,
      },
    ],
  });
  assert.ok(
    errors.some((error) => error.includes("ss-03-q001.json ha cambiado")),
  );
});
