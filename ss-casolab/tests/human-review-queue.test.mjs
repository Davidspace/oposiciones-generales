import assert from "node:assert/strict";
import test from "node:test";

import {
  buildHumanReviewQueue,
  renderHumanReviewQueue,
} from "../scripts/build-human-review-queue.mjs";

test("human review queue prioritizes risk and exposes the review contract", () => {
  const queue = buildHumanReviewQueue({
    asOf: "2026-07-30",
    catalog: {
      themes: [
        { id: "g-01", moduleId: "G01", stream: "general", number: 1, title: "General", updateRisk: "medium" },
        { id: "ss-01", moduleId: "S01", stream: "specific", number: 1, title: "Específico", updateRisk: "very-high" },
      ],
    },
    modules: [
      { id: "G01", themeId: "g-01", status: "draft", academicReviewStatus: "pending", legalReviewStatus: "pending", questionIds: ["g-01-q001"], normativeClaimIds: ["clm-g-01-001"], nextReviewAt: "2026-10-29" },
      { id: "S01", themeId: "ss-01", status: "draft", academicReviewStatus: "pending", legalReviewStatus: "pending", questionIds: ["ss-01-q001"], normativeClaimIds: ["clm-ss-01-001"], nextReviewAt: "2026-10-29" },
    ],
    claims: [
      { claimId: "clm-g-01-001", assetId: "G01", reviewStatus: "pending" },
      { claimId: "clm-ss-01-001", assetId: "S01", reviewStatus: "pending" },
    ],
    questions: [
      { id: "g-01-q001", themes: ["g-01"], options: [{ isCorrect: true }, { isCorrect: false }] },
      { id: "ss-01-q001", themes: ["ss-01"], options: [{ isCorrect: false }, { isCorrect: true }] },
    ],
    cases: [{ id: "MC01", type: "microcase", title: "Caso", status: "draft", themes: ["ss-01"], questionIds: ["ss-01-q101"], academicReviewStatus: "pending", legalReviewStatus: "pending" }],
  });

  assert.deepEqual(queue.highRiskThemeIds, ["ss-01"]);
  assert.deepEqual(queue.questionPositionCounts, [1, 1, 0, 0]);
  assert.equal(queue.themes[0].moduleId, "S01");
  assert.match(renderHumanReviewQueue(queue), /No exportar a Moodle/);
});
