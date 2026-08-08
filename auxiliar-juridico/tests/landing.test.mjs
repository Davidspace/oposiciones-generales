import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("la landing describe el inventario de Auxilio Judicial y no mezcla otros productos", async () => {
  const [source, html, config, diagnostic, analytics, sitemap] = await Promise.all([
    readFile(new URL("src/main.tsx", root), "utf8"),
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
    readFile(new URL("src/data/diagnostico.ts", root), "utf8"),
    readFile(new URL("src/lib/analytics.ts", root), "utf8"),
    readFile(new URL("public/sitemap.xml", root), "utf8"),
  ]);

  assert.match(source, /Auxilio Judicial/);
  assert.match(source, /TOPICS = \[/);
  assert.match(source, /course\/view\.php\?id=11/);
  assert.match(source, /cubren los 26 temas de Auxilio Judicial/);
  assert.match(source, /no incluye temario teórico/i);
  assert.match(source, /Cuestionarios por tema, repasos, supuestos prácticos, simulacros y modelos de examen/);
  assert.doesNotMatch(source, /90\s+(?:cuestionarios|tests)/i);
  assert.doesNotMatch(html, /90\s+(?:cuestionarios|tests)/i);
  assert.doesNotMatch(source, /gsi-casos-practicos|Forja TIC|sslip\.io|lorman-academia\.vercel\.app/i);
  assert.match(html, /Auxilio Judicial 2026/);
  assert.match(html, /Test Auxilio Judicial gratis 2026/);
  assert.match(html, /FAQPage/);
  assert.equal((diagnostic.match(/id: "/g) || []).length, 20);
  assert.match(analytics, /VITE_GA4_MEASUREMENT_ID/);
  assert.match(analytics, /VITE_CLARITY_PROJECT_ID/);
  assert.match(analytics, /analytics_storage/);
  assert.match(sitemap, /2026-08-08/);
  assert.match(config, /"outputDirectory": "dist"/);
});
