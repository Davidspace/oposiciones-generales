import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("la landing describe el inventario de Auxilio Judicial y no mezcla otros productos", async () => {
  const [source, html, config, diagnostic, diagnosticComponent, analytics, sitemap] = await Promise.all([
    readFile(new URL("src/main.tsx", root), "utf8"),
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
    readFile(new URL("src/data/diagnostico.ts", root), "utf8"),
    readFile(new URL("src/components/DiagnosticoAuxilio.tsx", root), "utf8"),
    readFile(new URL("src/lib/analytics.ts", root), "utf8"),
    readFile(new URL("public/sitemap.xml", root), "utf8"),
  ]);

  assert.match(source, /Auxilio Judicial/);
  assert.match(source, /TOPICS = \[/);
  assert.match(source, /course\/view\.php\?id=11/);
  assert.match(source, /Practica los 26 temas/);
  assert.match(source, /Deja de dar vueltas/);
  assert.match(source, /29 € en un único pago/);
  assert.match(source, /Lleves meses o empieces hoy/);
  assert.match(source, /¿Me sirve si acabo de empezar?/);
  assert.match(diagnosticComponent, /tanto si empiezas hoy como si ya estás repasando/);
  assert.match(source, /no incluye temario teórico/i);
  assert.match(source, /Cuestionarios por tema, repasos, supuestos prácticos, simulacros y modelos de examen/);
  assert.doesNotMatch(source, /90\s+(?:cuestionarios|tests)/i);
  assert.doesNotMatch(html, /90\s+(?:cuestionarios|tests)/i);
  assert.doesNotMatch(source, /gsi-casos-practicos|Forja TIC|sslip\.io|lorman-academia\.vercel\.app/i);
  assert.match(html, /Auxilio Judicial 2026/);
  assert.match(html, /Tests Auxilio Judicial 2026 por 29 €/);
  assert.match(html, /FAQPage/);
  assert.match(html, /https:\/\/auxiliojudicial\.academialorman\.es\//);
  assert.doesNotMatch(html, /auxiliar-juridico\.vercel\.app/);
  assert.equal((diagnostic.match(/id: "/g) || []).length, 20);
  assert.match(diagnostic, /Constitución Española/);
  assert.match(diagnostic, /Funciones de Auxilio Judicial/);
  assert.match(diagnostic, /Actos de comunicación civil/);
  assert.match(diagnostic, /Actos de comunicación penal/);
  assert.doesNotMatch(diagnostic, /bloque:/);
  assert.doesNotMatch(source, /Cuatro bloques|Resultado por bloques|Poder Judicial · Proceso civil/);
  assert.match(analytics, /VITE_GA4_MEASUREMENT_ID/);
  assert.match(analytics, /VITE_CLARITY_PROJECT_ID/);
  assert.match(analytics, /analytics_storage/);
  assert.match(sitemap, /2026-08-09/);
  assert.match(sitemap, /https:\/\/auxiliojudicial\.academialorman\.es\//);
  assert.match(config, /"outputDirectory": "dist"/);
  assert.match(config, /"type": "host"/);
  assert.match(config, /"value": "auxiliar-juridico\.vercel\.app"/);
  assert.match(config, /https:\/\/auxiliojudicial\.academialorman\.es\/:path\*/);
});
