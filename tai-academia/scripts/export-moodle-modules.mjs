import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { validateRepositoryContent } from "./validate-ss-content.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function renderInline(value) {
  const tokens = [];
  const token = (html) => {
    const index = tokens.push(html) - 1;
    return `\u0000INLINE${index}\u0000`;
  };

  let prepared = String(value).replace(/`([^`]+)`/g, (_, code) =>
    token(`<code>${escapeHtml(code)}</code>`),
  );
  prepared = prepared.replace(
    /\[([^\]]+)]\(([^)\s]+)\)/g,
    (_, label, href) => {
      if (!href.startsWith("https://")) {
        return token(`${escapeHtml(label)} (${escapeHtml(href)})`);
      }
      return token(
        `<a href="${escapeHtml(href)}" rel="noopener noreferrer">${escapeHtml(label)}</a>`,
      );
    },
  );

  let html = escapeHtml(prepared)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  html = html.replace(/\u0000INLINE(\d+)\u0000/g, (_, index) => tokens[Number(index)]);
  return html;
}

function tableCells(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDivider(line) {
  const cells = tableCells(line);
  return (
    cells.length > 0 &&
    cells.every((cell) => /^:?-{3,}:?$/.test(cell))
  );
}

function isBlockStart(lines, index) {
  const line = lines[index] ?? "";
  const next = lines[index + 1] ?? "";
  return (
    line.trim() === "" ||
    /^```/.test(line) ||
    /^#{1,6}\s+/.test(line) ||
    /^>\s?/.test(line) ||
    /^[-*]\s+/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    (line.includes("|") && isTableDivider(next))
  );
}

export function markdownToMoodleHtml(markdown) {
  const lines = String(markdown).replaceAll("\r\n", "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const fence = /^```([A-Za-z0-9_-]*)\s*$/.exec(line);
    if (fence) {
      const code = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const language = fence[1]
        ? ` class="language-${escapeHtml(fence[1])}"`
        : "";
      blocks.push(`<pre><code${language}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = /^(#{1,6})\s+(.+?)(?:\s+\{#([A-Za-z][A-Za-z0-9_-]*)\})?\s*$/.exec(
      line,
    );
    if (heading) {
      const level = heading[1].length;
      const id = heading[3] ? ` id="${escapeHtml(heading[3])}"` : "";
      blocks.push(`<h${level}${id}>${renderInline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.includes("|") && isTableDivider(lines[index + 1] ?? "")) {
      const headers = tableCells(line);
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].includes("|")) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      const headerHtml = headers
        .map((cell) => `<th scope="col">${renderInline(cell)}</th>`)
        .join("");
      const bodyHtml = rows
        .map(
          (row) =>
            `<tr>${headers
              .map((_, cellIndex) => `<td>${renderInline(row[cellIndex] ?? "")}</td>`)
              .join("")}</tr>`,
        )
        .join("");
      blocks.push(
        `<div class="table-responsive"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`,
      );
      continue;
    }

    const unordered = /^[-*]\s+(.+)$/.exec(line);
    if (unordered) {
      const items = [];
      while (index < lines.length) {
        const match = /^[-*]\s+(.+)$/.exec(lines[index]);
        if (!match) break;
        items.push(`<li>${renderInline(match[1])}</li>`);
        index += 1;
      }
      blocks.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    const ordered = /^\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      const items = [];
      while (index < lines.length) {
        const match = /^\d+\.\s+(.+)$/.exec(lines[index]);
        if (!match) break;
        items.push(`<li>${renderInline(match[1])}</li>`);
        index += 1;
      }
      blocks.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length) {
        const match = /^>\s?(.*)$/.exec(lines[index]);
        if (!match) break;
        quote.push(match[1]);
        index += 1;
      }
      blocks.push(`<blockquote><p>${renderInline(quote.join(" "))}</p></blockquote>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && !isBlockStart(lines, index)) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
  }

  return blocks.join("\n");
}

function wrapModuleHtml(learningModule, kind, content) {
  const label = kind === "lesson" ? "Lección" : "Hoja de repaso";
  return `<article class="ss-casolab-module" data-module-id="${escapeHtml(learningModule.id)}" data-version="${escapeHtml(learningModule.version)}">
  <header class="ss-casolab-module-meta">
    <p><strong>${label} · ${escapeHtml(learningModule.id)} · versión ${escapeHtml(learningModule.version)}</strong></p>
    <p><strong>Corte normativo: ${escapeHtml(learningModule.legislationCutoffAt)}</strong></p>
  </header>
${content}
</article>
`;
}

export function createModuleBundle({
  learningModule,
  moduleSource,
  lessonMarkdown,
  reviewMarkdown,
  generatedAt,
}) {
  if (learningModule?.status !== "published") {
    throw new Error(`El módulo ${learningModule?.id ?? "sin ID"} no está publicado`);
  }
  if (
    learningModule.academicReviewStatus !== "approved" ||
    !learningModule.academicReviewer ||
    !learningModule.reviewedAt
  ) {
    throw new Error(
      `El módulo ${learningModule.id} no tiene revisión académica aprobada y trazable`,
    );
  }
  if (
    !new Set(["approved", "not-required"]).has(
      learningModule.legalReviewStatus,
    ) ||
    (learningModule.legalReviewStatus === "approved" &&
      (!learningModule.legalReviewer || !learningModule.legalReviewedAt))
  ) {
    throw new Error(
      `El módulo ${learningModule.id} no tiene una decisión jurídica publicable`,
    );
  }

  const lessonHtml = wrapModuleHtml(
    learningModule,
    "lesson",
    markdownToMoodleHtml(lessonMarkdown),
  );
  const reviewHtml = wrapModuleHtml(
    learningModule,
    "review",
    markdownToMoodleHtml(reviewMarkdown),
  );
  const basePath = `content-source/modules/${learningModule.id}`;
  const manifest = {
    schemaVersion: "1.0.0",
    moduleId: learningModule.id,
    themeId: learningModule.themeId,
    version: learningModule.version,
    legislationCutoffAt: learningModule.legislationCutoffAt,
    generatedAt,
    coverage: learningModule.coverage,
    questionIds: learningModule.questionIds,
    microcaseIds: learningModule.microcaseIds,
    sources: [
      { path: `${basePath}/module.json`, sha256: sha256(moduleSource) },
      { path: `${basePath}/lesson.md`, sha256: sha256(lessonMarkdown) },
      { path: `${basePath}/review.md`, sha256: sha256(reviewMarkdown) },
    ],
    outputs: [
      { path: "lesson.html", sha256: sha256(lessonHtml) },
      { path: "review.html", sha256: sha256(reviewHtml) },
    ],
  };
  return { lessonHtml, reviewHtml, manifest };
}

export function verifyModuleBundle(
  bundle,
  { moduleSource, lessonMarkdown, reviewMarkdown },
) {
  const errors = [];
  const sourceValues = {
    "module.json": moduleSource,
    "lesson.md": lessonMarkdown,
    "review.md": reviewMarkdown,
  };
  for (const source of bundle.manifest.sources) {
    const filename = source.path.split("/").at(-1);
    if (sha256(sourceValues[filename]) !== source.sha256) {
      errors.push(`${filename} ha cambiado desde la exportación`);
    }
  }
  const outputValues = {
    "lesson.html": bundle.lessonHtml,
    "review.html": bundle.reviewHtml,
  };
  for (const output of bundle.manifest.outputs) {
    if (sha256(outputValues[output.path]) !== output.sha256) {
      errors.push(`${output.path} no coincide con su manifiesto`);
    }
  }
  return errors;
}

async function main() {
  const repository = await validateRepositoryContent();
  if (repository.errors.length) {
    throw new Error(
      `El repositorio editorial no es publicable:\n- ${repository.errors.join("\n- ")}`,
    );
  }
  const outIndex = process.argv.indexOf("--out");
  const outputRoot = resolve(
    projectRoot,
    outIndex >= 0 && process.argv[outIndex + 1]
      ? process.argv[outIndex + 1]
      : "dist/moodle/modules",
  );
  const modulesRoot = resolve(projectRoot, "content-source/modules");
  const publishedModules = repository.documentsByType.modules
    .filter((document) => document.value.status === "published")
    .sort((left, right) => left.value.id.localeCompare(right.value.id));
  const generatedAt = new Date().toISOString();
  let exported = 0;

  for (const document of publishedModules) {
    const learningModule = document.value;
    const moduleSource = document.source;
    const sourceRoot = resolve(modulesRoot, learningModule.id);
    const lessonMarkdown = await readFile(resolve(sourceRoot, "lesson.md"), "utf8");
    const reviewMarkdown = await readFile(resolve(sourceRoot, "review.md"), "utf8");
    const bundle = createModuleBundle({
      learningModule,
      moduleSource,
      lessonMarkdown,
      reviewMarkdown,
      generatedAt,
    });
    const destination = resolve(outputRoot, learningModule.id);
    await mkdir(destination, { recursive: true });
    await Promise.all([
      writeFile(resolve(destination, "lesson.html"), bundle.lessonHtml, "utf8"),
      writeFile(resolve(destination, "review.html"), bundle.reviewHtml, "utf8"),
      writeFile(
        resolve(destination, "manifest.json"),
        `${JSON.stringify(bundle.manifest, null, 2)}\n`,
        "utf8",
      ),
    ]);
    exported += 1;
  }

  if (exported === 0) {
    throw new Error("No hay módulos publicados; no se genera una exportación vacía.");
  }
  process.stdout.write(`Exportados ${exported} módulos a ${outputRoot}\n`);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}
