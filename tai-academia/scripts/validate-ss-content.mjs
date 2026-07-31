import { readdir, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const allowedStatuses = new Set([
  "pending",
  "draft",
  "reviewed",
  "external-review",
  "published",
  "retired",
]);
const allowedRisks = new Set([
  "low",
  "medium",
  "medium-high",
  "high",
  "very-high",
]);
const allowedLegalReviewStatuses = new Set([
  "not-required",
  "pending",
  "approved",
  "rejected",
]);
const allowedAcademicReviewStatuses = new Set([
  "pending",
  "approved",
  "rejected",
]);
const allowedClaimReviewStatuses = new Set([
  "pending",
  "reviewed",
  "approved",
  "retired",
]);
const programStreams = [
  { stream: "general", prefix: "g", modulePrefix: "G", annex: "I.A", count: 23 },
  {
    stream: "specific",
    prefix: "ss",
    modulePrefix: "S",
    annex: "I.B",
    count: 13,
  },
];

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function dateValue(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function semver(value) {
  return typeof value === "string" && /^\d+\.\d+\.\d+$/.test(value);
}

function nonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function unique(values) {
  return new Set(values).size === values.length;
}

function httpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function validateCatalog(catalog) {
  const errors = [];
  if (!/^\d+\.\d+\.\d+$/.test(catalog?.schemaVersion ?? "")) {
    errors.push("catalog.schemaVersion debe usar semver");
  }
  if (catalog?.product !== "ss-casolab") {
    errors.push("catalog.product debe ser ss-casolab");
  }
  if (catalog?.scope !== "turno-libre") {
    errors.push("catalog.scope debe ser turno-libre en V1");
  }
  if (!httpsUrl(catalog?.programSource)) {
    errors.push("catalog.programSource debe ser una URL HTTPS oficial");
  }
  if (!dateValue(catalog?.programReviewedAt)) {
    errors.push("catalog.programReviewedAt debe ser AAAA-MM-DD");
  }
  if (!Array.isArray(catalog?.themes) || catalog.themes.length !== 36) {
    errors.push(
      "catalog.themes debe contener exactamente 23 generales y 13 específicos",
    );
    return errors;
  }

  const ids = new Set();
  const expectedThemes = programStreams.flatMap((definition) =>
    Array.from({ length: definition.count }, (_, index) => ({
      ...definition,
      number: index + 1,
      id: `${definition.prefix}-${String(index + 1).padStart(2, "0")}`,
      moduleId: `${definition.modulePrefix}${String(index + 1).padStart(2, "0")}`,
    })),
  );

  for (const [index, theme] of catalog.themes.entries()) {
    const expected = expectedThemes[index];
    const themeLabel = expected?.id ?? `tema[${index}]`;
    if (
      theme.id !== expected.id ||
      theme.number !== expected.number ||
      theme.stream !== expected.stream ||
      theme.moduleId !== expected.moduleId ||
      theme.programAnnex !== expected.annex
    ) {
      errors.push(`${themeLabel}: identidad o posición fuera del programa oficial`);
    }
    if (ids.has(theme.id)) errors.push(`tema duplicado: ${theme.id}`);
    ids.add(theme.id);
    if (!nonEmpty(theme.title)) errors.push(`${themeLabel}: falta title`);
    if (!nonEmpty(theme.officialTitle)) {
      errors.push(`${themeLabel}: falta officialTitle`);
    }
    if (!nonEmpty(theme.sourceLocation)) {
      errors.push(`${themeLabel}: falta sourceLocation`);
    }
    if (!nonEmpty(theme.owner)) errors.push(`${themeLabel}: falta owner`);
    if (!allowedStatuses.has(theme.status)) {
      errors.push(`${themeLabel}: status no permitido`);
    }
    if (!allowedRisks.has(theme.updateRisk)) {
      errors.push(`${themeLabel}: updateRisk no permitido`);
    }
    if (!dateValue(theme.reviewedAt)) {
      errors.push(`${themeLabel}: reviewedAt debe ser AAAA-MM-DD`);
    }
  }
  return errors;
}

export function validateQuestion(question, catalog) {
  const errors = [];
  const prefix = nonEmpty(question?.id) ? question.id : "pregunta";
  const themeIds = new Set((catalog?.themes ?? []).map((theme) => theme.id));
  const errorTypes = new Set(catalog?.errorTypes ?? []);

  if (!/^(?:g|ss)-\d{2}-q\d{3}$/.test(question?.id ?? "")) {
    errors.push(`${prefix}: id debe usar g-NN-qNNN o ss-NN-qNNN`);
  }
  if (!semver(question?.version)) {
    errors.push(`${prefix}: version debe usar semver`);
  }
  if (!allowedStatuses.has(question?.status)) {
    errors.push(`${prefix}: status no permitido`);
  }
  if (
    !Array.isArray(question?.themes) ||
    question.themes.length === 0 ||
    question.themes.some((id) => !themeIds.has(id))
  ) {
    errors.push(`${prefix}: themes debe referenciar el catálogo`);
  }
  if (!unique(question?.themes ?? [])) {
    errors.push(`${prefix}: themes no puede contener duplicados`);
  }
  if (!nonEmpty(question?.epigraph)) errors.push(`${prefix}: falta epigraph`);
  if (!nonEmpty(question?.competency)) errors.push(`${prefix}: falta competency`);
  if (!new Set(["basic", "medium", "high"]).has(question?.difficulty)) {
    errors.push(`${prefix}: difficulty no permitida`);
  }
  if (!nonEmpty(question?.prompt)) errors.push(`${prefix}: falta prompt`);
  if (
    !nonEmptyArray(question?.normativeClaimIds) ||
    !unique(question?.normativeClaimIds ?? [])
  ) {
    errors.push(`${prefix}: normativeClaimIds debe contener valores únicos`);
  }
  if (!dateValue(question?.validFrom)) {
    errors.push(`${prefix}: falta validFrom válido`);
  }
  if (question?.validTo !== null && !dateValue(question?.validTo)) {
    errors.push(`${prefix}: validTo debe ser fecha o null`);
  }
  if (!dateValue(question?.legislationCutoffAt)) {
    errors.push(`${prefix}: falta legislationCutoffAt válido`);
  }
  if (!dateValue(question?.nextReviewAt)) {
    errors.push(`${prefix}: falta nextReviewAt válido`);
  }
  if (!new Set(["practice", "assessment-only"]).has(question?.visibility)) {
    errors.push(`${prefix}: visibility no permitida`);
  }
  if (!Array.isArray(question?.sources) || question.sources.length === 0) {
    errors.push(`${prefix}: falta una fuente oficial`);
  } else if (
    question.sources.some(
      (source) =>
        !httpsUrl(source.url) ||
        !nonEmpty(source.location) ||
        !dateValue(source.consultedAt),
    )
  ) {
    errors.push(`${prefix}: cada fuente requiere URL, localización y consulta`);
  }
  if (!Array.isArray(question?.options) || question.options.length !== 4) {
    errors.push(`${prefix}: debe tener exactamente cuatro opciones`);
    return errors;
  }
  if (question.options.filter((option) => option.isCorrect === true).length !== 1) {
    errors.push(`${prefix}: debe tener exactamente una opción correcta`);
  }
  for (const [index, option] of question.options.entries()) {
    const optionName = `${prefix}.options[${index}]`;
    if (!nonEmpty(option.text)) errors.push(`${optionName}: falta text`);
    if (!nonEmpty(option.feedback)) {
      errors.push(`${optionName}: falta feedback específico`);
    }
    if (typeof option.isCorrect !== "boolean") {
      errors.push(`${optionName}: isCorrect debe ser booleano`);
    }
    if (option.isCorrect === false) {
      if (!errorTypes.has(option.errorType)) {
        errors.push(`${optionName}: errorType no permitido`);
      }
      if (!nonEmpty(option.reviewTarget)) {
        errors.push(`${optionName}: falta reviewTarget`);
      }
    }
  }
  const requiresLegalApproval = (question?.themes ?? []).some((themeId) =>
    new Set(["high", "very-high"]).has(
      (catalog?.themes ?? []).find((theme) => theme.id === themeId)?.updateRisk,
    ),
  );
  errors.push(...validateAcademicReview(question, prefix));
  errors.push(
    ...validateLegalReview(question, prefix, {
      approvalRequired: requiresLegalApproval,
    }),
  );
  errors.push(...validateProvenance(question, prefix));
  return errors;
}

function sameSet(left, right) {
  const leftSet = new Set(left ?? []);
  const rightSet = new Set(right ?? []);
  return (
    leftSet.size === rightSet.size &&
    [...leftSet].every((value) => rightSet.has(value))
  );
}

function validateProvenance(asset, prefix) {
  const errors = [];
  const provenance = asset?.provenance;
  if (
    !provenance ||
    !nonEmpty(provenance.createdBy) ||
    !dateValue(provenance.createdAt) ||
    !nonEmptyArray(provenance.changeLog)
  ) {
    errors.push(`${prefix}: provenance debe identificar autor, fecha y cambios`);
    return errors;
  }

  const versions = [];
  for (const [index, change] of provenance.changeLog.entries()) {
    if (
      !semver(change?.version) ||
      !dateValue(change?.date) ||
      !nonEmpty(change?.changedBy) ||
      !nonEmpty(change?.summary)
    ) {
      errors.push(`${prefix}: provenance.changeLog[${index}] está incompleto`);
      continue;
    }
    versions.push(change.version);
  }
  if (!unique(versions)) {
    errors.push(`${prefix}: provenance no puede repetir versiones`);
  }
  if (versions.filter((version) => version === asset?.version).length !== 1) {
    errors.push(`${prefix}: provenance debe registrar exactamente una vez la versión actual`);
  }
  return errors;
}

function validateAcademicReview(asset, prefix) {
  const errors = [];
  if (!allowedAcademicReviewStatuses.has(asset?.academicReviewStatus)) {
    errors.push(`${prefix}: academicReviewStatus no permitido`);
    return errors;
  }
  if (
    asset.academicReviewStatus === "approved" &&
    (!nonEmpty(asset.academicReviewer) ||
      !dateValue(asset.academicReviewedAt ?? asset.reviewedAt))
  ) {
    errors.push(`${prefix}: aprobación académica requiere revisor y fecha`);
  }
  if (asset.status === "published" && asset.academicReviewStatus !== "approved") {
    errors.push(`${prefix}: publicación requiere revisión académica aprobada`);
  }
  return errors;
}

function validateLegalReview(asset, prefix, { approvalRequired = false } = {}) {
  const errors = [];
  if (!allowedLegalReviewStatuses.has(asset?.legalReviewStatus)) {
    errors.push(`${prefix}: legalReviewStatus no permitido`);
    return errors;
  }
  if (
    asset.legalReviewStatus === "approved" &&
    (!nonEmpty(asset.legalReviewer) || !dateValue(asset.legalReviewedAt))
  ) {
    errors.push(`${prefix}: aprobación jurídica requiere revisor y fecha`);
  }
  if (
    asset.status === "published" &&
    (approvalRequired
      ? asset.legalReviewStatus !== "approved"
      : !new Set(["approved", "not-required"]).has(asset.legalReviewStatus))
  ) {
    errors.push(
      `${prefix}: publicación requiere revisión jurídica ${approvalRequired ? "aprobada" : "aprobada o declarada no necesaria"}`,
    );
  }
  return errors;
}

export function validateModule(module, catalog) {
  const errors = [];
  const prefix = nonEmpty(module?.id) ? module.id : "módulo";
  const topic = (catalog?.themes ?? []).find(
    (candidate) => candidate.id === module?.themeId,
  );

  if (!topic || module?.id !== topic.moduleId) {
    errors.push(`${prefix}: id y themeId deben referenciar el catálogo`);
  }
  if (!semver(module?.version)) errors.push(`${prefix}: version debe usar semver`);
  if (!allowedStatuses.has(module?.status)) {
    errors.push(`${prefix}: status no permitido`);
  }
  if (!nonEmpty(module?.title)) errors.push(`${prefix}: falta title`);
  for (const field of ["learningOutcomes", "decisions", "normativeClaimIds"]) {
    if (!nonEmptyArray(module?.[field]) || module[field].some((item) => !nonEmpty(item))) {
      errors.push(`${prefix}: ${field} debe contener valores`);
    }
  }
  if (!nonEmptyArray(module?.coverage)) {
    errors.push(`${prefix}: coverage no puede estar vacío`);
  } else {
    for (const [index, item] of module.coverage.entries()) {
      if (
        !nonEmpty(item?.officialClause) ||
        !nonEmpty(item?.objective) ||
        !nonEmpty(item?.sectionId) ||
        !nonEmptyArray(item?.activityIds)
      ) {
        errors.push(`${prefix}: coverage[${index}] está incompleto`);
      }
    }
  }
  if (!nonEmpty(module?.lessonPath) || !module.lessonPath.endsWith(".md")) {
    errors.push(`${prefix}: lessonPath debe apuntar a Markdown`);
  }
  if (!nonEmpty(module?.reviewSheetPath) || !module.reviewSheetPath.endsWith(".md")) {
    errors.push(`${prefix}: reviewSheetPath debe apuntar a Markdown`);
  }
  if (!Array.isArray(module?.questionIds) || !unique(module.questionIds)) {
    errors.push(`${prefix}: questionIds debe ser una lista sin duplicados`);
  }
  if (!Array.isArray(module?.microcaseIds)) {
    errors.push(`${prefix}: microcaseIds debe ser una lista`);
  } else if (!unique(module.microcaseIds)) {
    errors.push(`${prefix}: microcaseIds no puede contener duplicados`);
  }
  for (const field of [
    "validFrom",
    "legislationCutoffAt",
    "nextReviewAt",
  ]) {
    if (!dateValue(module?.[field])) errors.push(`${prefix}: ${field} inválido`);
  }
  if (module?.validTo !== null && !dateValue(module?.validTo)) {
    errors.push(`${prefix}: validTo debe ser fecha o null`);
  }
  if (module?.status === "published") {
    if ((module.questionIds?.length ?? 0) < 8) {
      errors.push(`${prefix}: publicado requiere al menos ocho preguntas`);
    }
  }
  errors.push(...validateAcademicReview(module, prefix));
  errors.push(
    ...validateLegalReview(module, prefix, {
      approvalRequired:
        topic && new Set(["high", "very-high"]).has(topic.updateRisk),
    }),
  );
  errors.push(...validateProvenance(module, prefix));
  return errors;
}

export function validateNormativeClaim(claim) {
  const errors = [];
  const prefix = nonEmpty(claim?.claimId) ? claim.claimId : "afirmación";
  if (!/^clm-(?:g|ss)-\d{2}-\d{3}$/.test(claim?.claimId ?? "")) {
    errors.push(`${prefix}: claimId no válido`);
  }
  if (!nonEmpty(claim?.assetId)) errors.push(`${prefix}: falta assetId`);
  if (!semver(claim?.version)) errors.push(`${prefix}: version debe usar semver`);
  if (!nonEmpty(claim?.statement)) errors.push(`${prefix}: falta statement`);
  if (!httpsUrl(claim?.sourceUrl) || !nonEmpty(claim?.sourceLocation)) {
    errors.push(`${prefix}: fuente oficial y localización obligatorias`);
  }
  if (!nonEmpty(claim?.officialPublication)) {
    errors.push(`${prefix}: falta officialPublication`);
  }
  for (const field of [
    "validFrom",
    "legislationCutoffAt",
    "sourceCheckedAt",
    "nextReviewAt",
  ]) {
    if (!dateValue(claim?.[field])) errors.push(`${prefix}: ${field} inválido`);
  }
  if (claim?.validTo !== null && !dateValue(claim?.validTo)) {
    errors.push(`${prefix}: validTo debe ser fecha o null`);
  }
  if (!nonEmpty(claim?.owner)) errors.push(`${prefix}: falta owner`);
  if (!allowedClaimReviewStatuses.has(claim?.reviewStatus)) {
    errors.push(`${prefix}: reviewStatus no permitido`);
  }
  if (
    new Set(["reviewed", "approved"]).has(claim?.reviewStatus) &&
    !dateValue(claim?.reviewedAt)
  ) {
    errors.push(`${prefix}: reviewStatus requiere reviewedAt`);
  }
  if (
    !nonEmptyArray(claim?.dependentAssetIds) ||
    claim.dependentAssetIds.some((value) => !nonEmpty(value)) ||
    !unique(claim?.dependentAssetIds ?? [])
  ) {
    errors.push(`${prefix}: dependentAssetIds debe contener valores únicos`);
  }
  errors.push(...validateProvenance(claim, prefix));
  return errors;
}

export function validateCase(practicalCase, catalog) {
  const errors = [];
  const prefix = nonEmpty(practicalCase?.id) ? practicalCase.id : "caso";
  const themeIds = new Set((catalog?.themes ?? []).map((theme) => theme.id));
  const expected = {
    "microcase": { pattern: /^MC\d{2}$/, questionCount: 5 },
    "full-case": { pattern: /^CP\d{2}$/, questionCount: 18 },
    simulation: { pattern: /^SIM\d{2}$/ },
  }[practicalCase?.type];

  if (!expected || !expected.pattern.test(practicalCase?.id ?? "")) {
    errors.push(`${prefix}: id y type no coinciden`);
  }
  if (!semver(practicalCase?.version)) {
    errors.push(`${prefix}: version debe usar semver`);
  }
  if (!allowedStatuses.has(practicalCase?.status)) {
    errors.push(`${prefix}: status no permitido`);
  }
  if (!nonEmpty(practicalCase?.title)) errors.push(`${prefix}: falta title`);
  if (!nonEmpty(practicalCase?.scenario) || practicalCase?.originality !== "original") {
    errors.push(`${prefix}: escenario original obligatorio`);
  }
  for (const field of [
    "assumptions",
    "themes",
    "competencies",
    "consistencyRules",
    "normativeClaimIds",
  ]) {
    if (
      !nonEmptyArray(practicalCase?.[field]) ||
      practicalCase[field].some((value) => !nonEmpty(value)) ||
      !unique(practicalCase[field])
    ) {
      errors.push(`${prefix}: ${field} no puede estar vacío`);
    }
  }
  if (practicalCase?.themes?.some((id) => !themeIds.has(id))) {
    errors.push(`${prefix}: themes debe referenciar el catálogo`);
  }
  if (expected?.questionCount) {
    if (
      practicalCase?.questionIds?.length !== expected.questionCount ||
      !unique(practicalCase.questionIds)
    ) {
      errors.push(`${prefix}: ${practicalCase.type} requiere ${expected.questionCount} preguntas únicas`);
    }
  }
  if (practicalCase?.type === "full-case") {
    const mainQuestionIds = practicalCase?.mainQuestionIds ?? [];
    const reserveQuestionIds = practicalCase?.reserveQuestionIds ?? [];
    if (mainQuestionIds.length !== 15 || !unique(mainQuestionIds)) {
      errors.push(`${prefix}: full-case requiere 15 preguntas principales únicas`);
    }
    if (reserveQuestionIds.length !== 3 || !unique(reserveQuestionIds)) {
      errors.push(`${prefix}: full-case requiere 3 preguntas de reserva únicas`);
    }
    if (
      new Set([...mainQuestionIds, ...reserveQuestionIds]).size !== 18 ||
      JSON.stringify([ ...mainQuestionIds, ...reserveQuestionIds ]) !==
        JSON.stringify(practicalCase?.questionIds ?? [])
    ) {
      errors.push(
        `${prefix}: questionIds debe ordenar primero las 15 principales y después las 3 reservas`,
      );
    }
  }
  if (!nonEmptyArray(practicalCase?.coverage)) {
    errors.push(`${prefix}: coverage no puede estar vacío`);
  } else {
    const coverageThemes = [];
    const coverageCompetencies = [];
    const coverageQuestionIds = [];
    for (const [index, item] of practicalCase.coverage.entries()) {
      if (
        !nonEmpty(item?.themeId) ||
        !nonEmpty(item?.competency) ||
        !nonEmptyArray(item?.questionIds) ||
        !unique(item?.questionIds ?? [])
      ) {
        errors.push(`${prefix}: coverage[${index}] está incompleto`);
        continue;
      }
      coverageThemes.push(item.themeId);
      coverageCompetencies.push(item.competency);
      coverageQuestionIds.push(...item.questionIds);
    }
    if (!sameSet(coverageThemes, practicalCase?.themes ?? [])) {
      errors.push(`${prefix}: coverage debe cubrir exactamente todos los themes`);
    }
    if (!sameSet(coverageCompetencies, practicalCase?.competencies ?? [])) {
      errors.push(`${prefix}: coverage debe cubrir exactamente todas las competencies`);
    }
    const expectedCoverageQuestions =
      practicalCase?.type === "simulation"
        ? practicalCase?.generalQuestionIds ?? []
        : practicalCase?.questionIds ?? [];
    if (!sameSet(coverageQuestionIds, expectedCoverageQuestions)) {
      errors.push(`${prefix}: coverage debe cubrir exactamente todas las preguntas del caso`);
    }
  }
  if (practicalCase?.type === "simulation") {
    if (
      practicalCase?.generalQuestionIds?.length !== 73 ||
      !unique(practicalCase.generalQuestionIds) ||
      !/^CP\d{2}$/.test(practicalCase?.caseId ?? "") ||
      practicalCase?.durationMinutes !== 120
    ) {
      errors.push(`${prefix}: simulacro requiere 73 preguntas, caso completo y 120 minutos`);
    }
  } else if (
    !Number.isInteger(practicalCase?.durationMinutes) ||
    practicalCase.durationMinutes < 1
  ) {
    errors.push(`${prefix}: durationMinutes inválido`);
  }
  if (
    practicalCase?.scoring?.correct !== 1 ||
    practicalCase?.scoring?.wrong !== -0.25 ||
    practicalCase?.scoring?.blank !== 0
  ) {
    errors.push(`${prefix}: scoring debe ser +1/-0.25/0`);
  }
  if (!new Set(["basic", "medium", "high"]).has(practicalCase?.difficulty)) {
    errors.push(`${prefix}: difficulty no permitida`);
  }
  if (!new Set(["practice", "assessment-only"]).has(practicalCase?.visibility)) {
    errors.push(`${prefix}: visibility no permitida`);
  }
  if (!dateValue(practicalCase?.validFrom)) {
    errors.push(`${prefix}: validFrom inválido`);
  }
  if (practicalCase?.validTo !== null && !dateValue(practicalCase?.validTo)) {
    errors.push(`${prefix}: validTo debe ser fecha o null`);
  }
  if (!dateValue(practicalCase?.legislationCutoffAt)) {
    errors.push(`${prefix}: legislationCutoffAt inválido`);
  }
  if (!dateValue(practicalCase?.nextReviewAt)) {
    errors.push(`${prefix}: nextReviewAt inválido`);
  }
  errors.push(...validateAcademicReview(practicalCase, prefix));
  errors.push(
    ...validateLegalReview(practicalCase, prefix, { approvalRequired: true }),
  );
  errors.push(...validateProvenance(practicalCase, prefix));
  return errors;
}

function indexDocuments(documents, idField, label, errors) {
  const index = new Map();
  for (const document of documents ?? []) {
    const id = document?.value?.[idField];
    if (!nonEmpty(id)) continue;
    if (index.has(id)) {
      errors.push(
        `${label}: id duplicado ${id} en ${index.get(id).entry} y ${document.entry}`,
      );
      continue;
    }
    index.set(id, document);
  }
  return index;
}

function claimReferencesForAsset(asset) {
  return Array.isArray(asset?.normativeClaimIds) ? asset.normativeClaimIds : [];
}

export function validateContentGraph({
  modules = [],
  questions = [],
  claims = [],
  cases = [],
  availablePaths = new Set(),
  availableFileContents = new Map(),
}) {
  const errors = [];
  const moduleIndex = indexDocuments(modules, "id", "módulo", errors);
  const questionIndex = indexDocuments(questions, "id", "pregunta", errors);
  const claimIndex = indexDocuments(claims, "claimId", "afirmación", errors);
  const caseIndex = indexDocuments(cases, "id", "caso", errors);
  const requiredClaimDependents = new Map();
  const reviewedClaimDependents = new Map();

  const requireClaim = (claimId, assetId, mustBeReviewed = false) => {
    if (!claimIndex.has(claimId)) {
      errors.push(`${assetId}: afirmación ${claimId} no existe`);
      return;
    }
    const dependents = requiredClaimDependents.get(claimId) ?? new Set();
    dependents.add(assetId);
    requiredClaimDependents.set(claimId, dependents);
    if (mustBeReviewed) {
      const publicationDependents = reviewedClaimDependents.get(claimId) ?? new Set();
      publicationDependents.add(assetId);
      reviewedClaimDependents.set(claimId, publicationDependents);
    }
  };

  for (const { value: learningModule } of modules) {
    for (const path of [
      learningModule.lessonPath,
      learningModule.reviewSheetPath,
    ]) {
      if (nonEmpty(path) && !availablePaths.has(path)) {
        errors.push(`${learningModule.id}: archivo ${path} no existe`);
      }
    }

    const lessonContents = availableFileContents.get(learningModule.lessonPath);
    if (typeof lessonContents === "string") {
      for (const coverageItem of learningModule.coverage ?? []) {
        const markdownAnchor = `{#${coverageItem.sectionId}}`;
        const htmlAnchor = `id="${coverageItem.sectionId}"`;
        if (
          nonEmpty(coverageItem.sectionId) &&
          !lessonContents.includes(markdownAnchor) &&
          !lessonContents.includes(htmlAnchor)
        ) {
          errors.push(
            `${learningModule.id}: ancla ${coverageItem.sectionId} no existe en la lección`,
          );
        }
      }
    }

    for (const claimId of claimReferencesForAsset(learningModule)) {
      requireClaim(claimId, learningModule.id, learningModule.status === "published");
    }

    const coveredActivities = new Set(
      (learningModule.coverage ?? []).flatMap((item) => item.activityIds ?? []),
    );
    for (const questionId of learningModule.questionIds ?? []) {
      const question = questionIndex.get(questionId)?.value;
      if (!question) {
        errors.push(`${learningModule.id}: pregunta ${questionId} no existe`);
        continue;
      }
      if (!question.themes?.includes(learningModule.themeId)) {
        errors.push(
          `${learningModule.id}: ${questionId} no referencia el tema ${learningModule.themeId}`,
        );
      }
      if (
        learningModule.status === "published" &&
        question.status !== "published"
      ) {
        errors.push(
          `${learningModule.id}: publicado contiene pregunta no publicada ${questionId}`,
        );
      }
      if (
        learningModule.status === "published" &&
        !coveredActivities.has(questionId)
      ) {
        errors.push(`${learningModule.id}: ${questionId} no aparece en coverage`);
      }
    }

    for (const caseId of learningModule.microcaseIds ?? []) {
      const practicalCase = caseIndex.get(caseId)?.value;
      if (!practicalCase) {
        errors.push(`${learningModule.id}: caso ${caseId} no existe`);
      } else if (practicalCase.type !== "microcase") {
        errors.push(`${learningModule.id}: ${caseId} no es un microcaso`);
      } else if (
        learningModule.status === "published" &&
        practicalCase.status !== "published"
      ) {
        errors.push(
          `${learningModule.id}: publicado contiene microcaso no publicado ${caseId}`,
        );
      }
    }
  }

  for (const { value: question } of questions) {
    for (const claimId of claimReferencesForAsset(question)) {
      requireClaim(claimId, question.id, question.status === "published");
    }
  }

  for (const { value: practicalCase } of cases) {
    for (const claimId of claimReferencesForAsset(practicalCase)) {
      requireClaim(claimId, practicalCase.id, practicalCase.status === "published");
    }
    const referencedQuestions = [
      ...(practicalCase.questionIds ?? []),
      ...(practicalCase.generalQuestionIds ?? []),
    ];
    for (const questionId of referencedQuestions) {
      const question = questionIndex.get(questionId)?.value;
      if (!question) {
        errors.push(`${practicalCase.id}: pregunta ${questionId} no existe`);
      } else if (
        practicalCase.status === "published" &&
        question.status !== "published"
      ) {
        errors.push(
          `${practicalCase.id}: publicado contiene pregunta no publicada ${questionId}`,
        );
      }
    }
    if (practicalCase.type === "simulation") {
      const fullCase = caseIndex.get(practicalCase.caseId)?.value;
      if (!fullCase) {
        errors.push(`${practicalCase.id}: caso completo ${practicalCase.caseId} no existe`);
      } else if (fullCase.type !== "full-case") {
        errors.push(`${practicalCase.id}: ${practicalCase.caseId} no es un caso completo`);
      } else if (
        practicalCase.status === "published" &&
        fullCase.status !== "published"
      ) {
        errors.push(
          `${practicalCase.id}: publicado contiene caso no publicado ${practicalCase.caseId}`,
        );
      }
    }
  }

  for (const [claimId, dependents] of requiredClaimDependents) {
    const claim = claimIndex.get(claimId)?.value;
    const declaredDependents = new Set(claim?.dependentAssetIds ?? []);
    for (const assetId of dependents) {
      if (!declaredDependents.has(assetId)) {
        errors.push(`${claimId}: falta dependencia inversa ${assetId}`);
      }
    }
  }

  for (const [claimId, dependents] of reviewedClaimDependents) {
    const claim = claimIndex.get(claimId)?.value;
    if (
      claim &&
      (!new Set(["reviewed", "approved"]).has(claim.reviewStatus) ||
        !dateValue(claim.reviewedAt))
    ) {
      for (const assetId of dependents) {
        errors.push(`${claimId} sigue sin revisión para publicar ${assetId}`);
      }
    }
  }

  for (const { value: claim } of claims) {
    if (!moduleIndex.has(claim.assetId) && !caseIndex.has(claim.assetId)) {
      errors.push(
        `${claim.claimId}: assetId ${claim.assetId} no existe como módulo o caso`,
      );
    }
  }

  return errors;
}

async function readJsonDirectory(directory) {
  try {
    const entries = await readdir(directory, { recursive: true });
    const files = entries.filter((entry) => entry.endsWith(".json"));
    return Promise.all(
      files.map(async (entry) => {
        const source = await readFile(
          new URL(entry.replaceAll("\\", "/"), directory),
          "utf8",
        );
        return { entry, source, value: JSON.parse(source) };
      }),
    );
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

export async function validateRepositoryContent(projectRoot = root) {
  const catalogSource = await readFile(
    new URL("content-source/catalog.json", projectRoot),
    "utf8",
  );
  const catalog = JSON.parse(catalogSource);
  const errors = validateCatalog(catalog);
  const contentGroups = [
    ["questions", validateQuestion],
    ["modules", validateModule],
    ["claims", validateNormativeClaim],
    ["cases", validateCase],
  ];
  const counts = {};
  const documentsByType = {};

  for (const [directoryName, validator] of contentGroups) {
    const documents = await readJsonDirectory(
      new URL(`content-source/${directoryName}/`, projectRoot),
    );
    documentsByType[directoryName] = documents;
    counts[directoryName] = documents.length;
    for (const document of documents) {
      errors.push(...validator(document.value, catalog));
    }
  }

  const contentEntries = await readdir(new URL("content-source/", projectRoot), {
    recursive: true,
  });
  const availablePaths = new Set(
    contentEntries.map(
      (entry) => `content-source/${entry.replaceAll("\\", "/")}`,
    ),
  );
  const availableFileContents = new Map();
  for (const { value: learningModule } of documentsByType.modules ?? []) {
    if (
      nonEmpty(learningModule.lessonPath) &&
      availablePaths.has(learningModule.lessonPath)
    ) {
      availableFileContents.set(
        learningModule.lessonPath,
        await readFile(new URL(learningModule.lessonPath, projectRoot), "utf8"),
      );
    }
  }
  errors.push(
    ...validateContentGraph({
      ...documentsByType,
      availablePaths,
      availableFileContents,
    }),
  );

  return {
    catalog,
    catalogSource,
    counts,
    documentsByType,
    availablePaths,
    availableFileContents,
    errors,
  };
}

async function main() {
  const result = await validateRepositoryContent();
  const { catalog, counts, errors } = result;

  if (errors.length) {
    for (const error of errors) process.stderr.write(`- ${error}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(
    `SS content válido: ${catalog.themes.length} temas; ${counts.modules} módulos, ${counts.claims} afirmaciones, ${counts.questions} preguntas y ${counts.cases} casos estructurados.\n`,
  );
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}
