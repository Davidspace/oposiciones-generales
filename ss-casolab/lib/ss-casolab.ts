export const SS_ERROR_TYPES = [
  "regla-desconocida",
  "confusion-conceptos",
  "confusion-plazos",
  "confusion-sujetos",
  "confusion-requisitos",
  "confusion-competencias",
  "confusion-secuencia",
  "excepcion-ignorada",
  "lectura-incompleta",
  "distractor-absoluto",
  "calculo-incorrecto",
  "criterio-inconsistente",
  "exceso-duda",
  "gestion-riesgo",
] as const;

export type SsErrorType = (typeof SS_ERROR_TYPES)[number];

export const SS_ERROR_LABELS: Record<SsErrorType, string> = {
  "regla-desconocida": "Regla desconocida",
  "confusion-conceptos": "Confusión entre conceptos",
  "confusion-plazos": "Confusión de plazos",
  "confusion-sujetos": "Confusión de sujetos",
  "confusion-requisitos": "Confusión de requisitos",
  "confusion-competencias": "Confusión de competencias",
  "confusion-secuencia": "Confusión de secuencia",
  "excepcion-ignorada": "Excepción ignorada",
  "lectura-incompleta": "Lectura incompleta",
  "distractor-absoluto": "Distractor absoluto",
  "calculo-incorrecto": "Cálculo incorrecto",
  "criterio-inconsistente": "Cambio de criterio",
  "exceso-duda": "Exceso de duda",
  "gestion-riesgo": "Gestión del riesgo",
};

export type SsOption = {
  text: string;
  isCorrect: boolean;
  feedback: string;
  errorType: SsErrorType | null;
  review: string;
};

export type SsEditorialStatus =
  | "pending"
  | "draft"
  | "reviewed"
  | "external-review"
  | "published"
  | "retired";

export type SsQuestion = {
  id: string;
  canonicalId: string;
  version: string;
  status: SsEditorialStatus;
  themeId: string;
  competency: string;
  prompt: string;
  options: [SsOption, SsOption, SsOption, SsOption];
  sourceCheckedAt: string;
  legislationCutoffAt: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type SsCanonicalSource = {
  url: string;
  location: string;
  consultedAt: string;
};

export type SsCaseContext = {
  id: string;
  version: string;
  status: SsEditorialStatus;
  academicReviewStatus: string;
  legalReviewStatus: string;
  title: string;
  body: string;
  legislationCutoffAt: string;
  sourceCheckedAt?: string;
};

export type SsDiagnosticPayload = {
  publicable: true;
  caseContext: SsCaseContext;
  sources: SsCanonicalSource[];
  questions: SsQuestion[];
};

function selectedOption(question: SsQuestion, value: number | undefined) {
  return typeof value === "number" && Number.isInteger(value)
    ? question.options[value]
    : undefined;
}

export function scoreSsAttempt(
  answers: Record<string, number>,
  questions: SsQuestion[] = [],
) {
  const errorCounts = new Map<SsErrorType, number>();
  const weakThemes = new Set<string>();
  const reviewTargets = new Set<string>();
  let correct = 0;
  let answered = 0;

  for (const question of questions) {
    const option = selectedOption(question, answers[question.id]);
    if (!option) continue;

    answered += 1;
    if (option.isCorrect) {
      correct += 1;
      continue;
    }

    weakThemes.add(question.themeId);
    reviewTargets.add(option.review);
    if (option.errorType) {
      errorCounts.set(
        option.errorType,
        (errorCounts.get(option.errorType) ?? 0) + 1,
      );
    }
  }

  const incorrect = answered - correct;
  const unanswered = questions.length - answered;
  const raw = correct - incorrect * 0.25;
  const errors = SS_ERROR_TYPES.map((id) => ({
    id,
    label: SS_ERROR_LABELS[id],
    count: errorCounts.get(id) ?? 0,
  }))
    .filter((error) => error.count > 0)
    .sort((left, right) => right.count - left.count);
  const dominantError = errors[0] ?? null;

  const band =
    answered === 0
      ? {
          id: "no-data",
          title: "Sin datos suficientes",
          text: "Has entregado todas las decisiones en blanco. Revisa el caso y repite cuando puedas justificar al menos una opción.",
        }
      : raw >= 4
        ? {
            id: "solid",
            title: "Decisión sólida",
            text: "Distingues las obligaciones, los plazos y las vías de actuación de este bloque.",
          }
        : raw >= 2.5
          ? {
              id: "developing",
              title: "Base útil",
              text: "Reconoces la regla general, pero uno o dos distractores todavía pueden hacerte perder puntos.",
            }
          : {
              id: "priority",
              title: "Repaso prioritario",
              text: "Conviene separar afiliación, alta, baja y plazos antes de practicar un caso completo.",
            };

  return {
    correct,
    incorrect,
    unanswered,
    raw,
    band,
    errors,
    dominantError,
    weakThemes: [...weakThemes],
    reviewTargets: [...reviewTargets],
  };
}
