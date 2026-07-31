import assert from "node:assert/strict";
import test from "node:test";

import {
  BETA_MODULE_IDS,
  inspectBetaEditorialGate,
} from "../lib/beta-editorial-gate.ts";

function fixture({ reviewed = false } = {}) {
  const status = reviewed ? "reviewed" : "draft";
  const academicReviewStatus = reviewed ? "approved" : "pending";
  const legalReviewStatus = reviewed ? "approved" : "pending";
  const modules = BETA_MODULE_IDS.map((id) => ({
    id,
    status,
    academicReviewStatus,
    legalReviewStatus,
    questionIds: Array.from({ length: 8 }, (_, index) =>
      `${id.toLowerCase()}-q${String(index + 1).padStart(3, "0")}`,
    ),
    normativeClaimIds: [`clm-${id.toLowerCase()}-001`],
  }));
  const cases = [
    { id: "MC01", count: 5 },
    { id: "MC02", count: 5 },
    { id: "CP01", count: 18 },
  ].map(({ id, count }) => {
    const questionIds = Array.from({ length: count }, (_, index) =>
      `${id.toLowerCase()}-q${String(index + 1).padStart(3, "0")}`,
    );
    return {
      id,
      status,
      academicReviewStatus,
      legalReviewStatus,
      questionIds,
      mainQuestionIds: id === "CP01" ? questionIds.slice(0, 15) : undefined,
      reserveQuestionIds: id === "CP01" ? questionIds.slice(15) : undefined,
      normativeClaimIds: [`clm-${id.toLowerCase()}-001`],
    };
  });
  const questionIds = [
    ...modules.flatMap((module) => module.questionIds),
    ...cases.flatMap((practicalCase) => practicalCase.questionIds),
  ];
  const questions = questionIds.map((id) => ({
    id,
    status,
    academicReviewStatus,
    legalReviewStatus,
    normativeClaimIds: [],
  }));
  const claimIds = [
    ...modules.flatMap((module) => module.normativeClaimIds),
    ...cases.flatMap((practicalCase) => practicalCase.normativeClaimIds),
  ];
  const claims = claimIds.map((claimId) => ({
    claimId,
    reviewStatus: reviewed ? "reviewed" : "pending",
  }));
  return { modules, cases, questions, claims };
}

test("the beta gate distinguishes complete drafts from reviewed content", () => {
  const draft = inspectBetaEditorialGate(fixture());
  assert.equal(draft.structuralReady, true);
  assert.equal(draft.publicationReady, false);
  assert.ok(draft.reviewIssueCount > 0);
  assert.ok(draft.reviewIssueSummary.normative > 0);
  assert.equal(draft.reviewIssuesTruncated, true);

  const reviewed = inspectBetaEditorialGate(fixture({ reviewed: true }));
  assert.equal(reviewed.structuralReady, true);
  assert.equal(reviewed.publicationReady, true);
  assert.deepEqual(reviewed.structuralIssues, []);
  assert.equal(reviewed.reviewIssueCount, 0);
  assert.deepEqual(reviewed.reviewIssueSample, []);
});

test("the beta gate fails closed for missing questions and malformed reserves", () => {
  const input = fixture({ reviewed: true });
  input.questions.pop();
  const cp01 = input.cases.find(({ id }) => id === "CP01");
  cp01.reserveQuestionIds = cp01.reserveQuestionIds.slice(0, 2);

  const report = inspectBetaEditorialGate(input);
  assert.equal(report.structuralReady, false);
  assert.equal(report.publicationReady, false);
  assert.ok(report.structuralIssues.some((issue) => issue.includes("3 reservas")));
  assert.ok(
    report.structuralIssues.some((issue) => issue.includes("falta la pregunta")),
  );
});
