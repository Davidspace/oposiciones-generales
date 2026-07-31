export const BETA_MODULE_IDS = [
  "G01",
  "G13",
  "G14",
  "G15",
  "G16",
  "S01",
  "S02",
  "S03",
] as const;

export const BETA_CASE_REQUIREMENTS = {
  MC01: { questionCount: 5, mainCount: null, reserveCount: null },
  MC02: { questionCount: 5, mainCount: null, reserveCount: null },
  CP01: { questionCount: 18, mainCount: 15, reserveCount: 3 },
} as const;

type EditorialAsset = {
  id?: string;
  claimId?: string;
  status?: string;
  questionIds?: string[];
  mainQuestionIds?: string[];
  reserveQuestionIds?: string[];
  normativeClaimIds?: string[];
  academicReviewStatus?: string;
  legalReviewStatus?: string;
  reviewStatus?: string;
};

type GateInput = {
  modules: readonly EditorialAsset[];
  cases: readonly EditorialAsset[];
  questions: readonly EditorialAsset[];
  claims: readonly EditorialAsset[];
};

const REVIEWABLE_STATUSES = new Set([
  "reviewed",
  "external-review",
  "published",
]);
const REVIEWED_CLAIM_STATUSES = new Set(["reviewed", "approved"]);

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function publicationIssues(asset: EditorialAsset, label: string): string[] {
  const issues = [];
  if (!REVIEWABLE_STATUSES.has(asset.status ?? "")) {
    issues.push(`${label}: el estado editorial sigue antes de revisión.`);
  }
  if (asset.academicReviewStatus !== "approved") {
    issues.push(`${label}: falta revisión académica aprobada.`);
  }
  if (!new Set(["approved", "not-required"]).has(asset.legalReviewStatus ?? "")) {
    issues.push(`${label}: falta decisión jurídica válida.`);
  }
  return issues;
}

export function inspectBetaEditorialGate(input: GateInput) {
  const moduleById = new Map(input.modules.map((asset) => [asset.id, asset]));
  const caseById = new Map(input.cases.map((asset) => [asset.id, asset]));
  const questionById = new Map(input.questions.map((asset) => [asset.id, asset]));
  const claimById = new Map(input.claims.map((asset) => [asset.claimId, asset]));
  const structuralIssues: string[] = [];
  const reviewIssues: string[] = [];
  const relevantQuestionIds = new Set<string>();
  const relevantClaimIds = new Set<string>();

  for (const moduleId of BETA_MODULE_IDS) {
    const learningModule = moduleById.get(moduleId);
    if (!learningModule) {
      structuralIssues.push(`${moduleId}: falta el módulo beta.`);
      continue;
    }
    const questionIds = learningModule.questionIds ?? [];
    if (questionIds.length < 8 || !unique(questionIds)) {
      structuralIssues.push(`${moduleId}: requiere al menos 8 preguntas únicas.`);
    }
    for (const questionId of questionIds) relevantQuestionIds.add(questionId);
    for (const claimId of learningModule.normativeClaimIds ?? []) {
      relevantClaimIds.add(claimId);
    }
    reviewIssues.push(...publicationIssues(learningModule, moduleId));
  }

  for (const [caseId, requirement] of Object.entries(BETA_CASE_REQUIREMENTS)) {
    const practicalCase = caseById.get(caseId);
    if (!practicalCase) {
      structuralIssues.push(`${caseId}: falta el caso beta.`);
      continue;
    }
    const questionIds = practicalCase.questionIds ?? [];
    if (questionIds.length !== requirement.questionCount || !unique(questionIds)) {
      structuralIssues.push(
        `${caseId}: requiere ${requirement.questionCount} preguntas únicas.`,
      );
    }
    if (requirement.mainCount !== null && requirement.reserveCount !== null) {
      const mainQuestionIds = practicalCase.mainQuestionIds ?? [];
      const reserveQuestionIds = practicalCase.reserveQuestionIds ?? [];
      const ordered = [...mainQuestionIds, ...reserveQuestionIds];
      if (
        mainQuestionIds.length !== requirement.mainCount ||
        reserveQuestionIds.length !== requirement.reserveCount ||
        !unique(ordered) ||
        JSON.stringify(ordered) !== JSON.stringify(questionIds)
      ) {
        structuralIssues.push(
          `${caseId}: debe separar 15 preguntas principales y 3 reservas.`,
        );
      }
    }
    for (const questionId of questionIds) relevantQuestionIds.add(questionId);
    for (const claimId of practicalCase.normativeClaimIds ?? []) {
      relevantClaimIds.add(claimId);
    }
    reviewIssues.push(...publicationIssues(practicalCase, caseId));
  }

  for (const questionId of relevantQuestionIds) {
    const question = questionById.get(questionId);
    if (!question) {
      structuralIssues.push(`${questionId}: falta la pregunta referenciada.`);
      continue;
    }
    for (const claimId of question.normativeClaimIds ?? []) {
      relevantClaimIds.add(claimId);
    }
    reviewIssues.push(...publicationIssues(question, questionId));
  }

  for (const claimId of relevantClaimIds) {
    const claim = claimById.get(claimId);
    if (!claim) {
      structuralIssues.push(`${claimId}: falta la afirmación normativa.`);
    } else if (!REVIEWED_CLAIM_STATUSES.has(claim.reviewStatus ?? "")) {
      reviewIssues.push(`${claimId}: falta revisión normativa.`);
    }
  }

  const reviewIssueSummary = {
    editorialStatus: reviewIssues.filter((issue) =>
      issue.includes("estado editorial"),
    ).length,
    academic: reviewIssues.filter((issue) => issue.includes("académica")).length,
    legal: reviewIssues.filter((issue) => issue.includes("jurídica")).length,
    normative: reviewIssues.filter((issue) => issue.includes("normativa")).length,
  };
  const reviewIssueSampleLimit = 25;

  return {
    schemaVersion: "ss-beta-editorial-gate-v1",
    expected: {
      modules: BETA_MODULE_IDS.length,
      moduleQuestionsMinimum: BETA_MODULE_IDS.length * 8,
      microcases: 2,
      fullCases: 1,
      fullCaseMainQuestions: 15,
      fullCaseReserveQuestions: 3,
    },
    observed: {
      modules: BETA_MODULE_IDS.filter((id) => moduleById.has(id)).length,
      referencedQuestions: relevantQuestionIds.size,
      referencedClaims: relevantClaimIds.size,
      cases: Object.keys(BETA_CASE_REQUIREMENTS).filter((id) => caseById.has(id))
        .length,
    },
    structuralReady: structuralIssues.length === 0,
    publicationReady:
      structuralIssues.length === 0 && reviewIssues.length === 0,
    structuralIssues,
    reviewIssueCount: reviewIssues.length,
    reviewIssueSummary,
    reviewIssueSample: reviewIssues.slice(0, reviewIssueSampleLimit),
    reviewIssuesTruncated: reviewIssues.length > reviewIssueSampleLimit,
  };
}
