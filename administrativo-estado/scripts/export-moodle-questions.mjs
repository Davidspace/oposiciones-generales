import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { validateRepositoryContent } from "./validate-ss-content.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cdata(value) {
  return `<![CDATA[${String(value).replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function moduleIdForTheme(themeId) {
  const match = /^(g|ss)-(\d{2})$/.exec(themeId ?? "");
  if (!match) throw new Error(`Tema no válido para Moodle: ${themeId}`);
  return `${match[1] === "g" ? "G" : "S"}${match[2]}`;
}

function sourceListHtml(question) {
  const items = question.sources
    .map(
      (source) =>
        `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.location)}</a> ` +
        `(consulta: ${escapeHtml(source.consultedAt)})</li>`,
    )
    .join("");
  return `<ul>${items}</ul>`;
}

function feedbackHtml(option) {
  const details = [escapeHtml(option.feedback)];
  if (!option.isCorrect) {
    details.push(`<strong>Error:</strong> ${escapeHtml(option.errorType)}`);
    details.push(`<strong>Repaso:</strong> ${escapeHtml(option.reviewTarget)}`);
  }
  return `<p>${details.join("</p><p>")}</p>`;
}

function tagsXml(question) {
  const values = [
    question.id,
    `version-${question.version}`,
    ...question.themes,
    question.visibility,
    question.difficulty,
    ...question.options
      .filter((option) => !option.isCorrect)
      .map((option) => option.errorType),
  ].filter(Boolean);
  return [...new Set(values)]
    .sort()
    .map((value) => `      <tag><text>${escapeXml(value)}</text></tag>`)
    .join("\n");
}

export function questionToMoodleXml(question) {
  if (question?.status !== "published") {
    throw new Error(`La pregunta ${question?.id ?? "sin ID"} no está publicada`);
  }
  if (
    question.academicReviewStatus !== "approved" ||
    !question.academicReviewer ||
    !question.reviewedAt
  ) {
    throw new Error(
      `La pregunta ${question.id} no tiene revisión académica aprobada y trazable`,
    );
  }
  if (
    !new Set(["approved", "not-required"]).has(question.legalReviewStatus) ||
    (question.legalReviewStatus === "approved" &&
      (!question.legalReviewer || !question.legalReviewedAt))
  ) {
    throw new Error(
      `La pregunta ${question.id} no tiene una decisión jurídica publicable`,
    );
  }
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    throw new Error(`La pregunta ${question.id} no tiene cuatro alternativas`);
  }

  const questionHtml = `<p>${escapeHtml(question.prompt)}</p>`;
  const generalFeedback = [
    `<p><strong>Epígrafe:</strong> ${escapeHtml(question.epigraph)}</p>`,
    `<p><strong>Competencia:</strong> ${escapeHtml(question.competency)}</p>`,
    `<p><strong>Corte normativo:</strong> ${escapeHtml(question.legislationCutoffAt)}</p>`,
    `<p><strong>Afirmaciones:</strong> ${escapeHtml(question.normativeClaimIds.join(", "))}</p>`,
    "<p><strong>Fuentes oficiales:</strong></p>",
    sourceListHtml(question),
  ].join("");
  const answers = question.options
    .map(
      (option) => `    <answer fraction="${option.isCorrect ? "100" : "-25"}" format="html">
      <text>${cdata(`<p>${escapeHtml(option.text)}</p>`)}</text>
      <feedback format="html"><text>${cdata(feedbackHtml(option))}</text></feedback>
    </answer>`,
    )
    .join("\n");

  return `  <question type="multichoice">
    <name><text>${escapeXml(`${question.id} | v${question.version}`)}</text></name>
    <idnumber>${escapeXml(`${question.id}@${question.version}`)}</idnumber>
    <questiontext format="html"><text>${cdata(questionHtml)}</text></questiontext>
    <generalfeedback format="html"><text>${cdata(generalFeedback)}</text></generalfeedback>
    <defaultgrade>1.0000000</defaultgrade>
    <penalty>0.2500000</penalty>
    <hidden>0</hidden>
    <single>true</single>
    <shuffleanswers>true</shuffleanswers>
    <answernumbering>ABCD</answernumbering>
${answers}
    <tags>
${tagsXml(question)}
    </tags>
  </question>`;
}

function categoryXml(moduleId) {
  return `  <question type="category">
    <category><text>$course$/top/SS CasoLab/${escapeXml(moduleId)}</text></category>
  </question>`;
}

export function exportQuestionsToMoodleXml(questions) {
  const ordered = [...questions].sort((left, right) => {
    const themeComparison = left.themes[0].localeCompare(right.themes[0]);
    return themeComparison || left.id.localeCompare(right.id);
  });
  const blocks = [];
  let previousModuleId = null;

  for (const question of ordered) {
    const moduleId = moduleIdForTheme(question.themes?.[0]);
    if (moduleId !== previousModuleId) {
      blocks.push(categoryXml(moduleId));
      previousModuleId = moduleId;
    }
    blocks.push(questionToMoodleXml(question));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
${blocks.join("\n")}
</quiz>
`;
}

export function createQuestionBankBundle({
  catalogSource,
  questionDocuments,
  generatedAt,
}) {
  const orderedDocuments = [...questionDocuments].sort((left, right) =>
    left.entry.localeCompare(right.entry),
  );
  const xml = exportQuestionsToMoodleXml(
    orderedDocuments.map((document) => document.value),
  );
  return {
    xml,
    manifest: {
      schemaVersion: "1.0.0",
      generatedAt,
      questions: orderedDocuments.map((document) => ({
        id: document.value.id,
        version: document.value.version,
        themes: document.value.themes,
      })),
      sources: [
        {
          path: "content-source/catalog.json",
          sha256: sha256(catalogSource),
        },
        ...orderedDocuments.map((document) => ({
          path: `content-source/questions/${document.entry}`,
          sha256: sha256(document.source),
        })),
      ],
      outputs: [
        {
          path: "ss-casolab-questions.xml",
          sha256: sha256(xml),
        },
      ],
    },
  };
}

export function verifyQuestionBankBundle(
  bundle,
  { catalogSource, questionDocuments },
) {
  const errors = [];
  const sourceValues = new Map([
    ["content-source/catalog.json", catalogSource],
    ...questionDocuments.map((document) => [
      `content-source/questions/${document.entry}`,
      document.source,
    ]),
  ]);
  for (const source of bundle.manifest.sources) {
    const currentValue = sourceValues.get(source.path);
    if (typeof currentValue !== "string" || sha256(currentValue) !== source.sha256) {
      errors.push(`${source.path.split("/").at(-1)} ha cambiado desde la exportación`);
    }
  }
  if (sha256(bundle.xml) !== bundle.manifest.outputs[0]?.sha256) {
    errors.push("ss-casolab-questions.xml no coincide con su manifiesto");
  }
  return errors;
}

async function readPublishedQuestions() {
  const repository = await validateRepositoryContent();
  if (repository.errors.length) {
    throw new Error(
      `El repositorio editorial no es publicable:\n- ${repository.errors.join("\n- ")}`,
    );
  }
  return {
    catalogSource: repository.catalogSource,
    questionDocuments: repository.documentsByType.questions.filter(
      (document) => document.value.status === "published",
    ),
  };
}

async function main() {
  const outIndex = process.argv.indexOf("--out");
  const outputPath = resolve(
    projectRoot,
    outIndex >= 0 && process.argv[outIndex + 1]
      ? process.argv[outIndex + 1]
      : "dist/moodle/ss-casolab-questions.xml",
  );
  const { catalogSource, questionDocuments } = await readPublishedQuestions();
  if (questionDocuments.length === 0) {
    throw new Error("No hay preguntas publicadas; no se genera un banco vacío.");
  }
  const bundle = createQuestionBankBundle({
    catalogSource,
    questionDocuments,
    generatedAt: new Date().toISOString(),
  });
  await mkdir(dirname(outputPath), { recursive: true });
  await Promise.all([
    writeFile(outputPath, bundle.xml, "utf8"),
    writeFile(
      `${outputPath}.manifest.json`,
      `${JSON.stringify(bundle.manifest, null, 2)}\n`,
      "utf8",
    ),
  ]);
  process.stdout.write(
    `Exportadas ${questionDocuments.length} preguntas publicadas a ${outputPath}\n`,
  );
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}
