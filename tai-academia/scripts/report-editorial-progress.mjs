import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const assetGroups = ["modules", "claims", "questions", "cases"];

function countBy(values, selector) {
  return values.reduce((counts, value) => {
    const key = selector(value) ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function sortedUnique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function dateIsDue(value, asOf) {
  return typeof value === "string" && value <= asOf;
}

function themeIdsForAsset(asset, caseById) {
  if (Array.isArray(asset.themes)) return asset.themes;
  if (typeof asset.themeId === "string") return [asset.themeId];
  if (typeof asset.assetId === "string" && /^MC|^CP|^SIM/.test(asset.assetId)) {
    return caseById.get(asset.assetId)?.themes ?? [];
  }
  const moduleMatch = /^(G|S)(\d{2})$/.exec(asset.assetId ?? asset.id ?? "");
  if (!moduleMatch) return [];
  return [`${moduleMatch[1] === "G" ? "g" : "ss"}-${moduleMatch[2]}`];
}

export function buildNormativeImpactIndex(claims) {
  const sources = new Map();

  for (const claim of claims) {
    const source = sources.get(claim.sourceUrl) ?? {
      sourceUrl: claim.sourceUrl,
      officialPublications: [],
      sourceLocations: [],
      claimIds: [],
      dependentAssetIds: [],
      nextReviewDates: [],
    };
    source.officialPublications.push(claim.officialPublication);
    source.sourceLocations.push(claim.sourceLocation);
    source.claimIds.push(claim.claimId);
    source.dependentAssetIds.push(...(claim.dependentAssetIds ?? []));
    source.nextReviewDates.push(claim.nextReviewAt);
    sources.set(claim.sourceUrl, source);
  }

  return [...sources.values()]
    .map((source) => ({
      sourceUrl: source.sourceUrl,
      officialPublications: sortedUnique(source.officialPublications),
      sourceLocations: sortedUnique(source.sourceLocations),
      claimIds: sortedUnique(source.claimIds),
      dependentAssetIds: sortedUnique(source.dependentAssetIds),
      nextReviewAt: sortedUnique(source.nextReviewDates)[0] ?? null,
    }))
    .sort((a, b) => a.sourceUrl.localeCompare(b.sourceUrl));
}

export function collectEditorialProgress({
  catalog,
  modules,
  claims,
  questions,
  cases,
  asOf,
}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf ?? "")) {
    throw new Error("asOf debe usar AAAA-MM-DD");
  }

  const moduleByTheme = new Map(modules.map((module) => [module.themeId, module]));
  const caseById = new Map(cases.map((practicalCase) => [practicalCase.id, practicalCase]));

  const themes = catalog.themes.map((theme) => {
    const learningModule = moduleByTheme.get(theme.id);
    const themeQuestions = questions.filter((question) =>
      question.themes?.includes(theme.id),
    );
    const themeCases = cases.filter((practicalCase) =>
      practicalCase.themes?.includes(theme.id),
    );
    const themeClaims = claims.filter((claim) =>
      themeIdsForAsset(claim, caseById).includes(theme.id),
    );

    return {
      themeId: theme.id,
      moduleId: theme.moduleId,
      stream: theme.stream,
      catalogStatus: theme.status,
      moduleStatus: learningModule?.status ?? "missing",
      claimCount: themeClaims.length,
      questionCount: themeQuestions.length,
      caseIds: themeCases.map(({ id }) => id).sort(),
      nextReviewAt: learningModule?.nextReviewAt ?? null,
    };
  });

  const dueClaims = claims
    .filter((claim) => dateIsDue(claim.nextReviewAt, asOf))
    .map(({ claimId, nextReviewAt }) => ({ claimId, nextReviewAt }))
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
  const dueModules = modules
    .filter((module) => dateIsDue(module.nextReviewAt, asOf))
    .map(({ id, nextReviewAt }) => ({ id, nextReviewAt }))
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));

  return {
    asOf,
    curriculum: {
      themeTotal: catalog.themes.length,
      generalThemes: catalog.themes.filter(({ stream }) => stream === "general")
        .length,
      specificThemes: catalog.themes.filter(({ stream }) => stream === "specific")
        .length,
      modulesPresent: modules.length,
      modulesMissing: themes
        .filter(({ moduleStatus }) => moduleStatus === "missing")
        .map(({ moduleId }) => moduleId),
      moduleStatusCounts: countBy(modules, ({ status }) => status),
    },
    bank: {
      claimTotal: claims.length,
      claimReviewCounts: countBy(claims, ({ reviewStatus }) => reviewStatus),
      questionTotal: questions.length,
      moduleQuestionTotal: questions.filter(({ id }) => /-q0\d{2}$/.test(id)).length,
      practicalQuestionTotal: questions.filter(({ id }) => /-q[1-9]\d{2}$/.test(id)).length,
      questionStatusCounts: countBy(questions, ({ status }) => status),
      caseTotal: cases.length,
      caseTypeCounts: countBy(cases, ({ type }) => type),
      caseStatusCounts: countBy(cases, ({ status }) => status),
    },
    minimums: {
      moduleQuestions: { current: modules.reduce((sum, module) => sum + (module.questionIds?.length ?? 0), 0), target: 288 },
      microcases: { current: cases.filter(({ type }) => type === "microcase").length, target: 8 },
      fullCases: { current: cases.filter(({ type }) => type === "full-case").length, target: 4 },
      simulations: { current: cases.filter(({ type }) => type === "simulation").length, target: 2 },
    },
    reviewDue: { modules: dueModules, claims: dueClaims },
    themes,
  };
}

async function readJsonDirectory(directoryName) {
  const directory = new URL(`../content-source/${directoryName}/`, import.meta.url);
  let entries;
  try {
    entries = await readdir(directory, { recursive: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  return Promise.all(
    entries
      .filter((entry) => entry.endsWith(".json"))
      .map(async (entry) =>
        JSON.parse(
          await readFile(new URL(entry.replaceAll("\\", "/"), directory), "utf8"),
        ),
      ),
  );
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const asOf = argumentValue("--as-of") ?? new Date().toISOString().slice(0, 10);
  const outDirectory = resolve(
    projectRoot,
    argumentValue("--out") ?? "outputs/editorial",
  );
  const catalog = JSON.parse(
    await readFile(new URL("../content-source/catalog.json", import.meta.url), "utf8"),
  );
  const loaded = Object.fromEntries(
    await Promise.all(
      assetGroups.map(async (group) => [group, await readJsonDirectory(group)]),
    ),
  );
  const progress = collectEditorialProgress({ catalog, ...loaded, asOf });
  const impact = buildNormativeImpactIndex(loaded.claims);
  const outputs = {
    "progress.json": `${JSON.stringify(progress, null, 2)}\n`,
    "normative-impact.json": `${JSON.stringify({ asOf, sources: impact }, null, 2)}\n`,
  };

  await mkdir(outDirectory, { recursive: true });
  for (const [name, contents] of Object.entries(outputs)) {
    await writeFile(resolve(outDirectory, name), contents, "utf8");
  }
  const manifest = {
    asOf,
    files: Object.fromEntries(
      Object.entries(outputs).map(([name, contents]) => [name, sha256(contents)]),
    ),
  };
  await writeFile(
    resolve(outDirectory, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  process.stdout.write(
    `Informe editorial: ${progress.curriculum.modulesPresent}/${progress.curriculum.themeTotal} módulos; ${progress.bank.questionTotal} preguntas; ${progress.bank.caseTotal} casos.\n`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
