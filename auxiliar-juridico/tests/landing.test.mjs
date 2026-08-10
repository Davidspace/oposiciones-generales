import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("la landing presenta el mini simulacro 20+8 y conserva la separación editorial", async () => {
  const [source, html, config, diagnostic, diagnosticComponent, productProof, whatsapp, analytics, sitemap, cases, labels, revision] = await Promise.all([
    readFile(new URL("src/main.tsx", root), "utf8"),
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
    readFile(new URL("src/data/diagnostico.ts", root), "utf8"),
    readFile(new URL("src/components/DiagnosticoAuxilio.tsx", root), "utf8"),
    readFile(new URL("src/components/PruebaProducto.tsx", root), "utf8"),
    readFile(new URL("src/components/WhatsApp.tsx", root), "utf8"),
    readFile(new URL("src/lib/analytics.ts", root), "utf8"),
    readFile(new URL("public/sitemap.xml", root), "utf8"),
    readFile(new URL("docs/casos-simulacro-2.md", root), "utf8"),
    readFile(new URL("docs/moodle-etiquetado.md", root), "utf8"),
    readFile(new URL("docs/revision-juridica-mini-simulacro.md", root), "utf8"),
  ]);

  assert.match(source, /Auxilio Judicial/);
  assert.match(source, /TOPICS = \[/);
  assert.match(source, /course\/view\.php\?id=11/);
  assert.match(source, /Practica los 26 temas/);
  assert.match(source, /Deja de dar vueltas/);
  assert.match(source, /29 € en un único pago/);
  assert.match(source, /Probar el mini simulacro/);
  assert.match(source, /20 preguntas teóricas, 8 prácticas/);
  assert.match(source, /¿Me sirve si acabo de empezar\?/);
  assert.match(source, /no incluye el temario teórico completo/i);
  assert.match(source, /Tres formas de practicar\. Un mismo objetivo\./);
  assert.match(source, /Tests por tema/);
  assert.match(source, /infografía y un esquema breve/i);
  assert.match(source, /Supuestos prácticos/);
  assert.match(source, /Simulacros/);
  assert.doesNotMatch(source, /90\s+(?:cuestionarios|tests)/i);
  assert.doesNotMatch(source, /gsi-casos-practicos|Forja TIC|sslip\.io|lorman-academia\.vercel\.app/i);

  assert.match(productProof, /Práctica guiada de los 26 temas/);
  assert.match(productProof, /Repasos acumulativos/);
  assert.match(productProof, /Supuestos prácticos/);
  assert.match(productProof, /Simulacros teóricos y prácticos/);
  assert.match(productProof, /Modelos de estructura oficial/);
  assert.match(productProof, /10 agosto 2026/);
  assert.match(productProof, /revisión editorial interna, no un dictamen jurídico externo/i);
  assert.match(productProof, /Acceso al aula Moodle/);
  assert.match(productProof, /no incluye el desarrollo teórico completo/i);
  assert.doesNotMatch(productProof, /Mira el aula\. Mira cómo corrige\./);
  assert.doesNotMatch(productProof, /No vamos a inventarnos reseñas\./);
  assert.doesNotMatch(productProof, /\/muestras\//);

  assert.match(html, /Mini simulacro gratuito de Auxilio Judicial 2026/);
  assert.match(html, /"numberOfQuestions": 30/);
  assert.match(html, /FAQPage/);
  assert.match(html, /https:\/\/auxiliojudicial\.academialorman\.es\//);
  assert.doesNotMatch(html, /auxiliar-juridico\.vercel\.app/);

  assert.equal((diagnostic.match(/^    id: "/gm) || []).length, 30);
  assert.equal((diagnostic.match(/reserva: true/g) || []).length, 2);
  assert.equal((diagnostic.match(/ejercicio: "teorico"/g) || []).length, 21);
  assert.equal((diagnostic.match(/ejercicio: "practico"/g) || []).length, 9);
  assert.match(diagnostic, /CASOS_PRACTICOS/);
  assert.match(diagnostic, /BOE-A-1978-31229/);
  assert.match(diagnostic, /BOE-A-2000-323/);
  assert.match(diagnostic, /BOE-A-1882-6036/);
  assert.match(diagnostic, /reserva-prac-habilitacion/);

  assert.match(diagnosticComponent, /20 teóricas \+ 8 prácticas/);
  assert.match(diagnosticComponent, /CASOS_PRACTICOS\[question\.caso\]/);
  assert.match(diagnosticComponent, /Dejar en blanco/);
  assert.match(diagnosticComponent, /mini_simulacro_auxilio_20_8/);
  assert.match(diagnosticComponent, /THEORY_SECONDS/);
  assert.match(diagnosticComponent, /PRACTICAL_SECONDS/);
  assert.match(diagnosticComponent, /−0,15/);
  assert.match(diagnosticComponent, /20 min para teoría · 12 min para práctica/);
  assert.doesNotMatch(diagnosticComponent, /32 min aprox\./);
  assert.match(whatsapp, /fill="currentColor"/);
  assert.match(whatsapp, /lm-wa-icon/);

  assert.match(analytics, /VITE_GA4_MEASUREMENT_ID/);
  assert.match(analytics, /VITE_CLARITY_PROJECT_ID/);
  assert.match(analytics, /analytics_storage/);
  assert.match(analytics, /ga_debug/);
  assert.match(analytics, /ga_debug_probe/);
  assert.match(analytics, /debug_mode: true/);
  assert.match(analytics, /GA4 transporte/);
  assert.match(sitemap, /2026-08-10/);
  assert.match(sitemap, /https:\/\/auxiliojudicial\.academialorman\.es\//);
  assert.match(config, /"outputDirectory": "dist"/);
  assert.match(config, /"type": "host"/);
  assert.match(config, /"value": "auxiliar-juridico\.vercel\.app"/);
  assert.match(config, /https:\/\/auxiliojudicial\.academialorman\.es\/:path\*/);

  assert.match(cases, /Caso A/);
  assert.match(cases, /Caso B/);
  assert.match(cases, /40 preguntas ordinarias/);
  assert.match(labels, /ENTRENAMIENTO/);
  assert.match(labels, /SIMULACRO/);
  assert.match(labels, /CUESTIONARIO OFICIAL/);
  assert.match(revision, /20 preguntas teóricas/);
  assert.match(revision, /28 preguntas puntuables/);
});
