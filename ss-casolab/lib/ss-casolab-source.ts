import microcase from "../content-source/cases/MC01.json" with { type: "json" };
import question101 from "../content-source/questions/ss-03-q101.json" with {
  type: "json",
};
import question102 from "../content-source/questions/ss-03-q102.json" with {
  type: "json",
};
import question103 from "../content-source/questions/ss-03-q103.json" with {
  type: "json",
};
import question104 from "../content-source/questions/ss-03-q104.json" with {
  type: "json",
};
import question105 from "../content-source/questions/ss-03-q105.json" with {
  type: "json",
};

import {
  SS_ERROR_TYPES,
  type SsCanonicalSource,
  type SsDiagnosticPayload,
  type SsEditorialStatus,
  type SsErrorType,
  type SsQuestion,
} from "./ss-casolab.ts";

type CanonicalOption = {
  text: string;
  isCorrect: boolean;
  feedback: string;
  errorType?: string;
  reviewTarget?: string;
};

type CanonicalQuestion = {
  id: string;
  version: string;
  status: string;
  themes: string[];
  competency: string;
  prompt: string;
  options: CanonicalOption[];
  sources: SsCanonicalSource[];
  legislationCutoffAt: string;
  academicReviewStatus: string;
  academicReviewer?: string;
  reviewedAt?: string;
  legalReviewStatus: string;
  legalReviewer?: string;
  legalReviewedAt?: string;
};

type CanonicalCase = {
  id: string;
  version: string;
  status: string;
  title: string;
  scenario: string;
  questionIds: string[];
  legislationCutoffAt: string;
  academicReviewStatus: string;
  academicReviewer?: string;
  academicReviewedAt?: string;
  legalReviewStatus: string;
  legalReviewer?: string;
  legalReviewedAt?: string;
};

const canonicalMicrocase = microcase as CanonicalCase;
const canonicalQuestionsById: Record<string, CanonicalQuestion> = {
  [question101.id]: question101,
  [question102.id]: question102,
  [question103.id]: question103,
  [question104.id]: question104,
  [question105.id]: question105,
};

function isSsErrorType(value: string): value is SsErrorType {
  return (SS_ERROR_TYPES as readonly string[]).includes(value);
}

function adaptQuestion(question: CanonicalQuestion, position: number): SsQuestion {
  if (
    question.themes.length !== 1 ||
    question.options.length !== 4 ||
    question.sources.length === 0
  ) {
    throw new Error(`Pregunta canónica no compatible con el diagnóstico: ${question.id}`);
  }

  const options = question.options.map((option) => {
    const errorType = option.errorType ?? null;
    if (errorType !== null && !isSsErrorType(errorType)) {
      throw new Error(`Tipo de error no compatible en ${question.id}: ${errorType}`);
    }
    return {
      text: option.text,
      isCorrect: option.isCorrect,
      feedback: option.feedback,
      errorType,
      review: option.reviewTarget ?? "",
    };
  }) as SsQuestion["options"];

  return {
    id: `q${position + 1}`,
    canonicalId: question.id,
    version: question.version,
    status: question.status as SsEditorialStatus,
    themeId: question.themes[0],
    competency: question.competency,
    prompt: question.prompt,
    options,
    sourceCheckedAt: question.sources[0].consultedAt,
    legislationCutoffAt: question.legislationCutoffAt,
    sourceLabel: question.sources[0].location,
    sourceUrl: question.sources[0].url,
  };
}

const canonicalCaseQuestions = canonicalMicrocase.questionIds.map((questionId) => {
  const question = canonicalQuestionsById[questionId];
  if (!question) {
    throw new Error(`MC01 referencia una pregunta inexistente: ${questionId}`);
  }
  return question;
});

export const SS_CASE_SOURCES: SsCanonicalSource[] = [
  ...new Map(
    canonicalCaseQuestions
      .flatMap((question) => question.sources)
      .map((source) => [`${source.url}|${source.location}`, source]),
  ).values(),
].sort(
  (left, right) =>
    left.url.localeCompare(right.url) ||
    left.location.localeCompare(right.location),
);

export const SS_CASE_CONTEXT = {
  id: canonicalMicrocase.id,
  version: canonicalMicrocase.version,
  status: canonicalMicrocase.status as SsEditorialStatus,
  academicReviewStatus: canonicalMicrocase.academicReviewStatus,
  legalReviewStatus: canonicalMicrocase.legalReviewStatus,
  title: canonicalMicrocase.title,
  body: canonicalMicrocase.scenario,
  legislationCutoffAt: canonicalMicrocase.legislationCutoffAt,
  sourceCheckedAt: SS_CASE_SOURCES.map((source) => source.consultedAt).sort().at(
    -1,
  ),
};

export const SS_QUESTIONS: SsQuestion[] = canonicalCaseQuestions.map(
  (question, position) => adaptQuestion(question, position),
);

function questionHasPublicationEvidence(question: CanonicalQuestion) {
  return (
    question.status === "published" &&
    question.academicReviewStatus === "approved" &&
    Boolean(question.academicReviewer && question.reviewedAt) &&
    new Set(["approved", "not-required"]).has(question.legalReviewStatus) &&
    (question.legalReviewStatus !== "approved" ||
      Boolean(question.legalReviewer && question.legalReviewedAt))
  );
}

export const SS_DIAGNOSTIC_PUBLICABLE =
  canonicalMicrocase.status === "published" &&
  canonicalMicrocase.academicReviewStatus === "approved" &&
  Boolean(
    canonicalMicrocase.academicReviewer &&
      canonicalMicrocase.academicReviewedAt,
  ) &&
  canonicalMicrocase.legalReviewStatus === "approved" &&
  Boolean(
    canonicalMicrocase.legalReviewer && canonicalMicrocase.legalReviewedAt,
  ) &&
  canonicalCaseQuestions.every(questionHasPublicationEvidence);

export function readPublicSsDiagnostic(): SsDiagnosticPayload | null {
  if (!SS_DIAGNOSTIC_PUBLICABLE) return null;
  return {
    publicable: true,
    caseContext: SS_CASE_CONTEXT,
    sources: SS_CASE_SOURCES,
    questions: SS_QUESTIONS,
  };
}
