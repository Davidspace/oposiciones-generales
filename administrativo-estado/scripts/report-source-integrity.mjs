import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const allowedHosts = new Set([
  "www.boe.es",
  "eur-lex.europa.eu",
  "www.seg-social.es",
]);
const requiredFields = [
  "claimId",
  "assetId",
  "statement",
  "sourceUrl",
  "sourceLocation",
  "officialPublication",
  "validFrom",
  "legislationCutoffAt",
  "reviewStatus",
  "sourceCheckedAt",
  "nextReviewAt",
];

function isDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function canonicalSourceUrl(value) {
  const url = new URL(value);
  url.hash = "";
  return url.toString();
}

export function inspectSourceIntegrity(claims, { asOf = "2026-07-30" } = {}) {
  if (!isDate(asOf)) throw new Error("asOf debe usar AAAA-MM-DD");

  const issues = [];
  const hosts = new Map();
  const sourceUrls = new Set();
  const canonicalUrls = new Set();

  for (const claim of claims) {
    const claimId = claim?.claimId ?? "unknown";
    for (const field of requiredFields) {
      if (claim?.[field] === undefined || claim[field] === null || claim[field] === "") {
        issues.push({ claimId, code: "missing-field", field });
      }
    }

    let parsed;
    try {
      parsed = new URL(claim.sourceUrl);
    } catch {
      issues.push({ claimId, code: "invalid-source-url", value: claim.sourceUrl ?? null });
      continue;
    }

    if (parsed.protocol !== "https:") {
      issues.push({ claimId, code: "source-url-not-https", value: claim.sourceUrl });
    }
    if (!allowedHosts.has(parsed.hostname)) {
      issues.push({ claimId, code: "source-host-not-allowlisted", value: parsed.hostname });
    }
    for (const field of ["validFrom", "legislationCutoffAt", "sourceCheckedAt", "nextReviewAt"]) {
      if (!isDate(claim[field])) {
        issues.push({ claimId, code: "invalid-date", field, value: claim[field] ?? null });
      } else if (claim[field] > asOf && field !== "nextReviewAt") {
        issues.push({ claimId, code: "date-after-cutoff", field, value: claim[field] });
      }
    }

    sourceUrls.add(claim.sourceUrl);
    canonicalUrls.add(canonicalSourceUrl(claim.sourceUrl));
    hosts.set(parsed.hostname, (hosts.get(parsed.hostname) ?? 0) + 1);
  }

  return {
    asOf,
    claimTotal: claims.length,
    sourceUrlTotal: sourceUrls.size,
    canonicalSourceTotal: canonicalUrls.size,
    hostCounts: Object.fromEntries([...hosts.entries()].sort(([a], [b]) => a.localeCompare(b))),
    issueTotal: issues.length,
    issues,
    reviewStatusCounts: Object.fromEntries(
      [...claims.reduce((counts, claim) => {
        const status = claim.reviewStatus ?? "missing";
        counts.set(status, (counts.get(status) ?? 0) + 1);
        return counts;
      }, new Map()).entries()].sort(([a], [b]) => a.localeCompare(b)),
    ),
  };
}

async function readClaims() {
  const directory = new URL("../content-source/claims/", import.meta.url);
  const entries = await readdir(directory, { recursive: true });
  return Promise.all(
    entries
      .filter((entry) => entry.endsWith(".json"))
      .map(async (entry) => JSON.parse(await readFile(new URL(entry.replaceAll("\\", "/"), directory), "utf8"))),
  );
}

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const asOf = argumentValue("--as-of") ?? new Date().toISOString().slice(0, 10);
  const report = inspectSourceIntegrity(await readClaims(), { asOf });
  process.stdout.write(
    `Auditoría de fuentes: ${report.claimTotal} afirmaciones; ${report.canonicalSourceTotal} fuentes canónicas; incidencias=${report.issueTotal}.\n`,
  );
  if (report.issueTotal > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
