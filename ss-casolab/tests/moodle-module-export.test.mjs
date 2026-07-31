import assert from "node:assert/strict";
import test from "node:test";

import {
  createModuleBundle,
  markdownToMoodleHtml,
  verifyModuleBundle,
} from "../scripts/export-moodle-modules.mjs";

const learningModule = {
  id: "G01",
  themeId: "g-01",
  version: "1.0.0",
  status: "published",
  title: "Constitución y reforma",
  academicReviewStatus: "approved",
  academicReviewer: "Revisión humana",
  reviewedAt: "2026-07-29",
  legalReviewStatus: "not-required",
  legislationCutoffAt: "2026-07-29",
  questionIds: Array.from(
    { length: 8 },
    (_, index) => `g-01-q${String(index + 1).padStart(3, "0")}`,
  ),
  microcaseIds: [],
  coverage: [
    {
      officialClause: "Estructura y contenido",
      objective: "Localizar la materia.",
      sectionId: "g01-estructura",
      activityIds: ["g-01-q001"],
    },
  ],
};

const lessonMarkdown = `# Lección ágil

## Mapa {#g01-estructura}

Consulta la **Constitución** en el [BOE](https://www.boe.es/?a=1&b=2).

- Uno
- Dos

| Regla | Efecto |
|---|---|
| Art. 1 | Orienta |

\`\`\`text
si x < y
\`\`\`
`;

const reviewMarkdown = `# Repaso

1. Fecha
2. Materia
`;

test("the Markdown subset produces accessible Moodle HTML", () => {
  const html = markdownToMoodleHtml(lessonMarkdown);

  assert.match(html, /<h1>Lección ágil<\/h1>/);
  assert.match(html, /<h2 id="g01-estructura">Mapa<\/h2>/);
  assert.match(html, /<strong>Constitución<\/strong>/);
  assert.match(
    html,
    /href="https:\/\/www\.boe\.es\/\?a=1&amp;b=2" rel="noopener noreferrer"/,
  );
  assert.match(html, /<ul>[\s\S]*<li>Uno<\/li>[\s\S]*<li>Dos<\/li>/);
  assert.match(html, /<table>[\s\S]*<th scope="col">Regla<\/th>/);
  assert.match(html, /<pre><code class="language-text">si x &lt; y/);
});

test("a module bundle keeps versions, coverage and source/output hashes", () => {
  const moduleSource = `${JSON.stringify(learningModule, null, 2)}\n`;
  const bundle = createModuleBundle({
    learningModule,
    moduleSource,
    lessonMarkdown,
    reviewMarkdown,
    generatedAt: "2026-07-29T12:00:00.000Z",
  });

  assert.match(bundle.lessonHtml, /data-module-id="G01"/);
  assert.match(bundle.lessonHtml, /Corte normativo: 2026-07-29/);
  assert.equal(bundle.manifest.moduleId, "G01");
  assert.equal(bundle.manifest.version, "1.0.0");
  assert.deepEqual(bundle.manifest.coverage, learningModule.coverage);
  assert.equal(bundle.manifest.sources.length, 3);
  assert.equal(bundle.manifest.outputs.length, 2);
  assert.deepEqual(
    verifyModuleBundle(bundle, {
      moduleSource,
      lessonMarkdown,
      reviewMarkdown,
    }),
    [],
  );
});

test("draft modules cannot export and drift changes the verification result", () => {
  assert.throws(
    () =>
      createModuleBundle({
        learningModule: { ...learningModule, status: "draft" },
        moduleSource: "{}",
        lessonMarkdown,
        reviewMarkdown,
        generatedAt: "2026-07-29T12:00:00.000Z",
      }),
    /no está publicado/,
  );
  assert.throws(
    () =>
      createModuleBundle({
        learningModule: {
          ...learningModule,
          academicReviewStatus: "pending",
        },
        moduleSource: "{}",
        lessonMarkdown,
        reviewMarkdown,
        generatedAt: "2026-07-29T12:00:00.000Z",
      }),
    /revisión académica aprobada/,
  );

  const moduleSource = `${JSON.stringify(learningModule, null, 2)}\n`;
  const bundle = createModuleBundle({
    learningModule,
    moduleSource,
    lessonMarkdown,
    reviewMarkdown,
    generatedAt: "2026-07-29T12:00:00.000Z",
  });
  const errors = verifyModuleBundle(bundle, {
    moduleSource,
    lessonMarkdown: `${lessonMarkdown}\nCambio posterior.`,
    reviewMarkdown,
  });

  assert.ok(errors.some((error) => error.includes("lesson.md ha cambiado")));
});
