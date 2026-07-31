import assert from "node:assert/strict";
import test from "node:test";

import { inspectSourceIntegrity } from "../scripts/report-source-integrity.mjs";

const claim = (overrides = {}) => ({
  claimId: "clm-g-01-001",
  assetId: "G01",
  statement: "Afirmación de prueba.",
  sourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724#a1",
  sourceLocation: "TRLGSS, artículo 1",
  officialPublication: "BOE-A-2015-11724",
  validFrom: "2016-01-02",
  legislationCutoffAt: "2026-07-30",
  reviewStatus: "pending",
  sourceCheckedAt: "2026-07-30",
  nextReviewAt: "2026-10-30",
  ...overrides,
});

test("source integrity accepts official BOE, EU and Seguridad Social hosts", () => {
  const report = inspectSourceIntegrity([
    claim(),
    claim({ claimId: "clm-g-10-001", sourceUrl: "https://eur-lex.europa.eu/eli/treaty/teu_2016/art_16/oj/spa" }),
    claim({ claimId: "clm-g-01-011", sourceUrl: "https://www.seg-social.es/descarga/es/NIAFCL_Administrativos_2025" }),
  ]);

  assert.equal(report.claimTotal, 3);
  assert.equal(report.sourceUrlTotal, 3);
  assert.equal(report.canonicalSourceTotal, 3);
  assert.equal(report.issueTotal, 0);
  assert.deepEqual(report.reviewStatusCounts, { pending: 3 });
});

test("source integrity reports missing metadata and non-official hosts", () => {
  const report = inspectSourceIntegrity([
    claim({ sourceUrl: "http://example.com/source", sourceLocation: "" }),
  ]);

  assert.ok(report.issues.some((issue) => issue.code === "source-url-not-https"));
  assert.ok(report.issues.some((issue) => issue.code === "source-host-not-allowlisted"));
  assert.ok(report.issues.some((issue) => issue.code === "missing-field" && issue.field === "sourceLocation"));
});

test("source integrity rejects dates after the declared cutoff", () => {
  const report = inspectSourceIntegrity([
    claim({ legislationCutoffAt: "2026-07-31" }),
  ], { asOf: "2026-07-30" });

  assert.ok(report.issues.some((issue) => issue.code === "date-after-cutoff"));
});
