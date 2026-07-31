import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  scoreSsAttempt,
} from "../lib/ss-casolab.ts";
import {
  SS_CASE_CONTEXT,
  SS_CASE_SOURCES,
  SS_DIAGNOSTIC_PUBLICABLE,
  SS_QUESTIONS,
  readPublicSsDiagnostic,
} from "../lib/ss-casolab-source.ts";

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
}

const canonicalCase = await readJson("../content-source/cases/MC01.json");
const canonicalQuestions = await Promise.all(
  canonicalCase.questionIds.map((questionId) =>
    readJson(`../content-source/questions/${questionId}.json`),
  ),
);
const canonicalClaims = await Promise.all(
  canonicalCase.normativeClaimIds.map((claimId) =>
    readJson(`../content-source/claims/${claimId}.json`),
  ),
);

test("every microcase alternative has specific feedback and traceability", () => {
  assert.equal(SS_QUESTIONS.length, 5);

  for (const question of SS_QUESTIONS) {
    assert.equal(question.options.length, 4);
    assert.equal(
      question.options.filter((option) => option.isCorrect).length,
      1,
    );
    assert.match(question.themeId, /^ss-\d{2}$/);
    assert.match(question.version, /^\d+\.\d+\.\d+$/);
    assert.equal(question.status, "draft");
    assert.match(question.sourceCheckedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(question.sourceUrl, /^https:\/\//);

    for (const option of question.options) {
      assert.ok(option.feedback.length >= 20);
      if (option.isCorrect) {
        assert.equal(option.errorType, null);
      } else {
        assert.ok(option.errorType);
        assert.ok(option.review.length >= 10);
      }
    }
  }
});

test("the runtime diagnostic is an adapter over the canonical draft microcase", () => {
  assert.equal(canonicalCase.status, "draft");
  assert.equal(canonicalCase.legalReviewStatus, "pending");
  assert.equal("reviewedAt" in canonicalCase, false);
  assert.equal(SS_CASE_CONTEXT.id, canonicalCase.id);
  assert.equal(SS_CASE_CONTEXT.title, canonicalCase.title);
  assert.equal(SS_CASE_CONTEXT.body, canonicalCase.scenario);
  assert.equal(SS_CASE_CONTEXT.status, canonicalCase.status);
  assert.equal(SS_DIAGNOSTIC_PUBLICABLE, false);
  assert.equal(readPublicSsDiagnostic(), null);
  assert.equal(
    SS_CASE_CONTEXT.legislationCutoffAt,
    canonicalCase.legislationCutoffAt,
  );
  const expectedSources = new Set(
    canonicalQuestions.flatMap((question) =>
      question.sources.map((source) => `${source.url}|${source.location}`),
    ),
  );
  assert.deepEqual(
    new Set(SS_CASE_SOURCES.map((source) => `${source.url}|${source.location}`)),
    expectedSources,
  );
  assert.equal(
    SS_CASE_CONTEXT.legalReviewStatus,
    canonicalCase.legalReviewStatus,
  );
  for (const claim of canonicalClaims) {
    assert.equal(claim.assetId, canonicalCase.id);
    assert.equal(claim.reviewStatus, "pending");
    assert.equal("reviewedAt" in claim, false);
  }

  assert.deepEqual(
    SS_QUESTIONS.map((question) => question.id),
    ["q1", "q2", "q3", "q4", "q5"],
  );
  assert.deepEqual(
    SS_QUESTIONS.map((question) => question.canonicalId),
    canonicalCase.questionIds,
  );

  for (const [index, question] of SS_QUESTIONS.entries()) {
    const canonical = canonicalQuestions[index];
    assert.equal(canonical.status, "draft");
    assert.equal("reviewedAt" in canonical, false);
    assert.equal(question.prompt, canonical.prompt);
    assert.equal(question.competency, canonical.competency);
    assert.equal(question.sourceCheckedAt, canonical.sources[0].consultedAt);
    assert.equal(question.sourceLabel, canonical.sources[0].location);
    assert.equal(question.sourceUrl, canonical.sources[0].url);
    assert.deepEqual(
      question.options.map(({ text, isCorrect, feedback, errorType, review }) => ({
        text,
        isCorrect,
        feedback,
        errorType,
        review,
      })),
      canonical.options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect,
        feedback: option.feedback,
        errorType: option.errorType ?? null,
        review: option.reviewTarget ?? "",
      })),
    );
  }
});

test("score separates blanks from errors and reports a dominant error", () => {
  const answers = {
    q1: 0,
    q2: 1,
    q3: 1,
  };

  const result = scoreSsAttempt(answers, SS_QUESTIONS);

  assert.equal(result.correct, 2);
  assert.equal(result.incorrect, 1);
  assert.equal(result.unanswered, 2);
  assert.equal(result.raw, 1.75);
  assert.equal(result.dominantError?.id, "confusion-sujetos");
  assert.deepEqual(result.weakThemes, ["ss-03"]);
  assert.equal(result.reviewTargets.length, 1);
});

test("a perfect attempt has no weak theme or invented error", () => {
  const answers = Object.fromEntries(
    SS_QUESTIONS.map((question) => [
      question.id,
      question.options.findIndex((option) => option.isCorrect),
    ]),
  );

  const result = scoreSsAttempt(answers, SS_QUESTIONS);

  assert.equal(result.correct, 5);
  assert.equal(result.raw, 5);
  assert.equal(result.dominantError, null);
  assert.deepEqual(result.weakThemes, []);
  assert.deepEqual(result.reviewTargets, []);
});
