import assert from "node:assert/strict";
import test from "node:test";

import {
  buildNormativeImpactIndex,
  collectEditorialProgress,
} from "../scripts/report-editorial-progress.mjs";
import {
  buildCurriculumAudit,
  renderCurriculumAudit,
} from "../scripts/report-curriculum-audit.mjs";

const catalog = {
  themes: [
    { id: "g-01", moduleId: "G01", stream: "general", status: "pending" },
    { id: "ss-01", moduleId: "S01", stream: "specific", status: "pending" },
  ],
};

test("editorial progress separates module questions from practical decisions", () => {
  const report = collectEditorialProgress({
    catalog,
    asOf: "2026-07-29",
    modules: [
      {
        id: "G01",
        themeId: "g-01",
        status: "draft",
        questionIds: ["g-01-q001"],
        nextReviewAt: "2026-07-29",
      },
    ],
    claims: [
      {
        claimId: "clm-g-01-001",
        assetId: "G01",
        sourceUrl: "https://www.boe.es/a",
        officialPublication: "BOE-A",
        sourceLocation: "art. 1",
        reviewStatus: "pending",
        nextReviewAt: "2026-07-28",
        dependentAssetIds: ["G01", "g-01-q001"],
      },
      {
        claimId: "clm-ss-01-001",
        assetId: "MC01",
        sourceUrl: "https://www.boe.es/b",
        officialPublication: "BOE-B",
        sourceLocation: "art. 2",
        reviewStatus: "pending",
        nextReviewAt: "2026-08-01",
        dependentAssetIds: ["MC01", "ss-01-q101"],
      },
    ],
    questions: [
      { id: "g-01-q001", themes: ["g-01"], status: "draft" },
      { id: "ss-01-q101", themes: ["ss-01"], status: "draft" },
      { id: "ss-01-q201", themes: ["ss-01"], status: "draft" },
    ],
    cases: [{ id: "MC01", type: "microcase", status: "draft", themes: ["ss-01"] }],
  });

  assert.equal(report.curriculum.modulesPresent, 1);
  assert.deepEqual(report.curriculum.modulesMissing, ["S01"]);
  assert.equal(report.bank.moduleQuestionTotal, 1);
  assert.equal(report.bank.practicalQuestionTotal, 2);
  assert.equal(report.minimums.moduleQuestions.current, 1);
  assert.deepEqual(report.reviewDue.modules, [
    { id: "G01", nextReviewAt: "2026-07-29" },
  ]);
  assert.deepEqual(report.reviewDue.claims, [
    { claimId: "clm-g-01-001", nextReviewAt: "2026-07-28" },
  ]);
  assert.equal(report.themes[1].claimCount, 1);
  assert.deepEqual(report.themes[1].caseIds, ["MC01"]);
});

test("the impact index groups one source without losing dependent assets", () => {
  const index = buildNormativeImpactIndex([
    {
      claimId: "clm-1",
      sourceUrl: "https://www.boe.es/rule",
      officialPublication: "BOE-X",
      sourceLocation: "art. 1",
      nextReviewAt: "2026-10-01",
      dependentAssetIds: ["G01", "g-01-q001"],
    },
    {
      claimId: "clm-2",
      sourceUrl: "https://www.boe.es/rule",
      officialPublication: "BOE-X",
      sourceLocation: "art. 2",
      nextReviewAt: "2026-09-01",
      dependentAssetIds: ["G01", "g-01-q002"],
    },
  ]);

  assert.equal(index.length, 1);
  assert.equal(index[0].nextReviewAt, "2026-09-01");
  assert.deepEqual(index[0].claimIds, ["clm-1", "clm-2"]);
  assert.deepEqual(index[0].dependentAssetIds, ["G01", "g-01-q001", "g-01-q002"]);
});

test("progress rejects an ambiguous report date", () => {
  assert.throws(
    () =>
      collectEditorialProgress({
        catalog,
        modules: [],
        claims: [],
        questions: [],
        cases: [],
        asOf: "29/07/2026",
      }),
    /AAAA-MM-DD/,
  );
});

test("curriculum audit detects structural gaps and keeps publication closed", () => {
  const audit = buildCurriculumAudit({
    catalog,
    asOf: "2026-07-30",
    modules: [
      {
        id: "G01",
        themeId: "g-01",
        status: "draft",
        academicReviewStatus: "pending",
        legalReviewStatus: "pending",
        questionIds: ["g-01-q001"],
        normativeClaimIds: ["clm-g-01-001", "clm-g-01-missing"],
        coverage: [{ sectionId: "section-1" }],
      },
    ],
    claims: [
      {
        claimId: "clm-g-01-001",
        assetId: "G01",
        sourceUrl: "https://www.boe.es/a",
        sourceLocation: "art. 1",
        reviewStatus: "pending",
        nextReviewAt: "2026-10-01",
      },
    ],
    questions: [{ id: "g-01-q001", themes: ["g-01"], status: "draft" }],
    cases: [],
  });

  assert.equal(audit.structuralReady, false);
  assert.equal(audit.publicationReady, false);
  assert.deepEqual(audit.structuralIssues[0].issues, [
    "module-question-count",
    "missing-claim-reference",
  ]);
  assert.match(renderCurriculumAudit(audit), /Gaps que todavía impiden cerrar/);
});
