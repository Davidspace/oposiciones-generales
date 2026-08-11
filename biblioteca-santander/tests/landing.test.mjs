import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("la landing de Santander conserva el alcance oficial y no hereda Auxilio", async () => {
  const [source, html, config, data, product, notice, robots, sitemap] = await Promise.all([
    readFile(new URL("src/main.tsx", root), "utf8"),
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
    readFile(new URL("src/data/diagnostico.ts", root), "utf8"),
    readFile(new URL("src/components/PruebaProducto.tsx", root), "utf8"),
    readFile(new URL("src/components/AvisoComun.tsx", root), "utf8"),
    readFile(new URL("public/robots.txt", root), "utf8"),
    readFile(new URL("public/sitemap.xml", root), "utf8"),
  ]);

  assert.match(source, /Auxiliar de Biblioteca/);
  assert.match(source, /Ayuntamiento de Santander/);
  assert.match(source, /9 plazas/);
  assert.match(source, /20 temas/);
  assert.match(source, /cuatro supuestos prácticos/);
  assert.match(source, /50 preguntas/);
  assert.match(source, /DiagnosticoBiblioteca/);
  assert.doesNotMatch(source, /Auxilio Judicial|auxiliojudicial|29 €/);
  assert.doesNotMatch(source, /GSI|Forja TIC|sslip\.io/);

  assert.match(data, /PREGUNTAS_MINI/);
  assert.match(data, /catálogo|catalogo/i);
  assert.match(data, /obra de referencia/);
  assert.equal((data.match(/reserva: true/g) || []).length, 2);
  assert.equal((data.match(/ejercicio: "teorico"/g) || []).length, 11);
  assert.equal((data.match(/ejercicio: "practico"/g) || []).length, 5);

  assert.match(product, /20 temas exactos/);
  assert.match(product, /Laboratorio práctico/);
  assert.match(product, /cuatro supuestos/);
  assert.match(notice, /AVISO_BIBLIOTECA/);
  assert.match(html, /biblioteca-santander\.academialorman\.es/);
  assert.match(html, /"numberOfQuestions": 16/);
  assert.match(config, /biblioteca-santander\.vercel\.app/);
  assert.match(config, /biblioteca-santander\.academialorman\.es/);
  assert.match(robots, /biblioteca-santander\.academialorman\.es\/sitemap\.xml/);
  assert.match(sitemap, /biblioteca-santander\.academialorman\.es/);
  assert.doesNotMatch(html, /auxiliojudicial\.academialorman\.es|auxiliar-juridico\.vercel\.app/);
});
