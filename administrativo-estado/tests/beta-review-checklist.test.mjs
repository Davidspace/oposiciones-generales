import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBetaReviewChecklist,
  renderBetaReviewChecklist,
} from "../scripts/build-beta-review-checklist.mjs";

test("beta checklist covers module and case references without approving them", () => {
  const checklist = buildBetaReviewChecklist({
    asOf: "2026-07-30",
    modules: [
      { id: "G01", questionIds: ["q1"], normativeClaimIds: ["c1"], academicReviewStatus: "pending", legalReviewStatus: "pending" },
      ...["G13", "G14", "G15", "G16", "S01", "S02", "S03"].map((id) => ({ id, questionIds: [], normativeClaimIds: [], academicReviewStatus: "pending", legalReviewStatus: "pending" })),
    ],
    cases: [
      { id: "MC01", type: "microcase", title: "Caso 1", questionIds: [], normativeClaimIds: [], academicReviewStatus: "pending", legalReviewStatus: "pending" },
      { id: "MC02", type: "microcase", title: "Caso 2", questionIds: [], normativeClaimIds: [], academicReviewStatus: "pending", legalReviewStatus: "pending" },
      { id: "CP01", type: "full-case", title: "Caso 3", questionIds: [], normativeClaimIds: [], academicReviewStatus: "pending", legalReviewStatus: "pending" },
    ],
    questions: [{ id: "q1" }],
    claims: [{ claimId: "c1" }],
  });
  assert.equal(checklist.structuralReady, true);
  assert.equal(checklist.questionCount, 1);
  assert.match(renderBetaReviewChecklist(checklist), /publicationReady: true/);
  assert.match(renderBetaReviewChecklist(checklist), /academicReviewStatus/);
});
