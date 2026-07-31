function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function reportUrl(base, weekStart) {
  const url = new URL(base);
  const local = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
    throw new Error("La API administrativa debe usar HTTPS o localhost.");
  }
  url.pathname = `${url.pathname.replace(/\/$/u, "")}/api/admin/reports/weekly`;
  url.search = "";
  url.searchParams.set("weekStart", weekStart);
  url.hash = "";
  return url.toString();
}

const weekStart = argument("--week-start");
if (!weekStart) {
  throw new Error("Uso: npm.cmd run admin:export-weekly -- --week-start AAAA-MM-DD");
}
const actor = process.env.SS_CASOLAB_ADMIN_ACTOR?.trim();
if (actor !== "david" && actor !== "alba") {
  throw new Error("SS_CASOLAB_ADMIN_ACTOR debe ser david o alba.");
}
const secretName =
  actor === "david"
    ? "SS_CASOLAB_ADMIN_DAVID_SECRET"
    : "SS_CASOLAB_ADMIN_ALBA_SECRET";
const secret = process.env[secretName]?.trim() ?? "";
if (secret.length < 48) throw new Error(`${secretName} no está configurado.`);
const base = process.env.SS_CASOLAB_ADMIN_API_URL?.trim();
if (!base) throw new Error("Falta SS_CASOLAB_ADMIN_API_URL.");

const result = await fetch(reportUrl(base, weekStart), {
  headers: { Authorization: `Bearer ${secret}` },
});
const payload = await result.json();
process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
if (!result.ok) process.exitCode = 1;
