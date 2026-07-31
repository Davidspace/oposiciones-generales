import assert from "node:assert/strict";
import test from "node:test";

import { BETA_MODULE_IDS } from "../lib/beta-editorial-gate.ts";
import { buildBetaReviewPack } from "../lib/beta-review-pack.ts";

test("the review pack exposes keys and feedback without approving assets", () => {
  const modules = BETA_MODULE_IDS.map((id) => ({
    id,
    version: "0.1.0",
    status: "draft",
    title: `Tema ${id}`,
    lessonPath: `${id}/lesson.md`,
    reviewSheetPath: `${id}/review.md`,
    questionIds: id === "G01" ? ["g-01-q001"] : [],
    normativeClaimIds: id === "G01" ? ["clm-g-01-001"] : [],
  }));
  const cases = ["MC01", "MC02", "CP01"].map((id) => ({
    id,
    status: "draft",
    title: id,
    scenario: "Caso original.",
    assumptions: ["No hay excepciones."],
    questionIds: [],
    mainQuestionIds: [],
    reserveQuestionIds: [],
    normativeClaimIds: [],
  }));
  const markdown = buildBetaReviewPack({
    generatedAt: "2026-07-30T12:00:00.000Z",
    modules,
    cases,
    questions: [
      {
        id: "g-01-q001",
        prompt: "¿Qué opción es correcta?",
        options: [
          { text: "A", isCorrect: false, feedback: "No.", errorType: "rule" },
          { text: "B", isCorrect: true, feedback: "Sí." },
        ],
        sources: [
          {
            url: "https://www.boe.es/example",
            location: "art. 1",
            consultedAt: "2026-07-30",
          },
        ],
        normativeClaimIds: ["clm-g-01-001"],
      },
    ],
    claims: [
      {
        claimId: "clm-g-01-001",
        statement: "Regla de prueba.",
        sourceUrl: "https://www.boe.es/example",
        sourceLocation: "art. 1",
      },
    ],
  });

  assert.match(markdown, /\*\*\[CORRECTA\]\*\* B\. B/);
  assert.match(markdown, /Feedback: Sí\./);
  assert.match(markdown, /Regla de prueba/);
  assert.match(markdown, /Documento privado de revisión/);
  assert.doesNotMatch(markdown, /revisión aprobada|publicado por Alba/i);
});
