import {
  BETA_CASE_REQUIREMENTS,
  BETA_MODULE_IDS,
} from "./beta-editorial-gate.ts";

type Option = {
  text?: string;
  isCorrect?: boolean;
  feedback?: string;
  errorType?: string;
  reviewTarget?: string;
};

type Source = { url?: string; location?: string; consultedAt?: string };

type Asset = {
  id?: string;
  claimId?: string;
  version?: string;
  status?: string;
  title?: string;
  scenario?: string;
  assumptions?: string[];
  lessonPath?: string;
  reviewSheetPath?: string;
  questionIds?: string[];
  mainQuestionIds?: string[];
  reserveQuestionIds?: string[];
  normativeClaimIds?: string[];
  legislationCutoffAt?: string;
  prompt?: string;
  options?: Option[];
  sources?: Source[];
  statement?: string;
  sourceUrl?: string;
  sourceLocation?: string;
};

type Input = {
  generatedAt: string;
  modules: readonly Asset[];
  cases: readonly Asset[];
  questions: readonly Asset[];
  claims: readonly Asset[];
};

function line(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "—";
}

function renderQuestion(question: Asset, role: string): string[] {
  const output = [
    `### ${line(question.id)} · ${role}`,
    "",
    `**Enunciado:** ${line(question.prompt)}`,
    "",
  ];
  for (const [index, option] of (question.options ?? []).entries()) {
    const letter = String.fromCharCode(65 + index);
    output.push(
      `- ${option.isCorrect === true ? "**[CORRECTA]** " : ""}${letter}. ${line(option.text)}`,
      `  - Feedback: ${line(option.feedback)}`,
      `  - Error: ${line(option.errorType)} · Repaso: ${line(option.reviewTarget)}`,
    );
  }
  output.push("", "Fuentes:", "");
  for (const source of question.sources ?? []) {
    output.push(
      `- [${line(source.location)}](${line(source.url)}) · consulta ${line(source.consultedAt)}`,
    );
  }
  output.push(
    "",
    "- [ ] Clave inequívoca.",
    "- [ ] Cuatro feedbacks correctos y útiles.",
    "- [ ] Fuente, corte y repaso verificados.",
    "",
  );
  return output;
}

export function buildBetaReviewPack(input: Input): string {
  const generatedAt = new Date(input.generatedAt);
  if (
    !Number.isFinite(generatedAt.getTime()) ||
    generatedAt.toISOString() !== input.generatedAt
  ) {
    throw new TypeError("generatedAt debe ser una fecha ISO exacta.");
  }
  const moduleById = new Map(input.modules.map((asset) => [asset.id, asset]));
  const caseById = new Map(input.cases.map((asset) => [asset.id, asset]));
  const questionById = new Map(input.questions.map((asset) => [asset.id, asset]));
  const claimById = new Map(input.claims.map((asset) => [asset.claimId, asset]));
  const usedClaimIds = new Set<string>();
  const output = [
    "# Paquete de revisión humana — Lote beta SS CasoLab",
    "",
    `Generado: ${input.generatedAt}`,
    "",
    "> Documento privado de revisión. No aprueba ni publica activos y no sustituye la fuente JSON.",
    "",
    "## Checklist del lote",
    "",
    "- [ ] Cobertura de los ocho módulos confirmada.",
    "- [ ] MC01, MC02 y CP01 son originales, coherentes y no ambiguos.",
    "- [ ] CP01 conserva 15 principales y 3 reservas separadas.",
    "- [ ] Claves y feedback revisados por Alba.",
    "- [ ] Fuentes, vigencia y excepciones revisadas.",
    "- [ ] Decisión jurídica registrada donde corresponda.",
    "",
  ];

  for (const moduleId of BETA_MODULE_IDS) {
    const learningModule = moduleById.get(moduleId);
    output.push(
      `## Módulo ${moduleId} · ${line(learningModule?.title)}`,
      "",
      `- Versión/estado: ${line(learningModule?.version)} · ${line(learningModule?.status)}`,
      `- Corte: ${line(learningModule?.legislationCutoffAt)}`,
      `- Lección: ${line(learningModule?.lessonPath)}`,
      `- Repaso: ${line(learningModule?.reviewSheetPath)}`,
      "- [ ] Cobertura y profundidad adecuadas.",
      "- [ ] Lección y hoja de repaso coherentes.",
      "",
    );
    for (const claimId of learningModule?.normativeClaimIds ?? []) {
      usedClaimIds.add(claimId);
    }
    for (const questionId of learningModule?.questionIds ?? []) {
      const question = questionById.get(questionId);
      if (question) {
        for (const claimId of question.normativeClaimIds ?? []) {
          usedClaimIds.add(claimId);
        }
        output.push(...renderQuestion(question, "pregunta de módulo"));
      } else {
        output.push(`### ${questionId} · FALTA EN LA FUENTE`, "");
      }
    }
  }

  for (const caseId of Object.keys(BETA_CASE_REQUIREMENTS)) {
    const practicalCase = caseById.get(caseId);
    const mainIds = new Set(practicalCase?.mainQuestionIds ?? []);
    const reserveIds = new Set(practicalCase?.reserveQuestionIds ?? []);
    output.push(
      `## Caso ${caseId} · ${line(practicalCase?.title)}`,
      "",
      `**Escenario:** ${line(practicalCase?.scenario)}`,
      "",
      "Supuestos declarados:",
      "",
      ...(practicalCase?.assumptions ?? []).map((assumption) => `- ${assumption}`),
      "",
      "- [ ] Relato y fechas coherentes.",
      "- [ ] No falta una excepción que cambie la respuesta.",
      "- [ ] Dificultad y tiempo adecuados.",
      "",
    );
    for (const claimId of practicalCase?.normativeClaimIds ?? []) {
      usedClaimIds.add(claimId);
    }
    for (const questionId of practicalCase?.questionIds ?? []) {
      const question = questionById.get(questionId);
      const role = reserveIds.has(questionId)
        ? "reserva"
        : mainIds.has(questionId)
          ? "principal"
          : "microcaso";
      if (question) {
        for (const claimId of question.normativeClaimIds ?? []) {
          usedClaimIds.add(claimId);
        }
        output.push(...renderQuestion(question, role));
      } else {
        output.push(`### ${questionId} · FALTA EN LA FUENTE`, "");
      }
    }
  }

  output.push("## Afirmaciones normativas utilizadas", "");
  for (const claimId of [...usedClaimIds].sort()) {
    const claim = claimById.get(claimId);
    output.push(
      `### ${claimId}`,
      "",
      `${line(claim?.statement)}`,
      "",
      `Fuente: [${line(claim?.sourceLocation)}](${line(claim?.sourceUrl)})`,
      "",
      "- [ ] Regla, localización, vigencia y dependencias verificadas.",
      "",
    );
  }
  return `${output.join("\n")}\n`;
}
