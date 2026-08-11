import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("TAI integra prueba y muestra real sin una sección prematura de reseñas", async () => {
  const page = await source("app/tai/page.tsx");
  assert.match(page, /TaiDiagnostic/);
  assert.match(page, /TaiMaterialPreview/);
  assert.doesNotMatch(page, /TaiReviews|id="opiniones"/);
  assert.match(page, /Pago único de 69 €/);
});

test("el diagnóstico separa teoría y las dos rutas prácticas", async () => {
  const data = await source("data/tai-diagnostic.ts");
  assert.match(data, /generalQuestions/);
  assert.match(data, /developmentQuestions/);
  assert.match(data, /systemsQuestions/);
  assert.match(data, /BOE-A-2025-26262/);
  assert.doesNotMatch(data, /pregunta oficial/i);
});

test("la prueba declara su alcance y diferencia las rutas prácticas", async () => {
  const diagnostic = await source("components/TaiDiagnostic.tsx");
  assert.match(diagnostic, /muestra propia/i);
  assert.match(diagnostic, /no es un simulacro oficial/i);
  assert.match(diagnostic, /Ruta práctica · bloque III/);
  assert.match(diagnostic, /Ruta práctica · bloque IV/);
  assert.doesNotMatch(diagnostic, />Segunda parte</);
});

test("las cuatro páginas reales siguen disponibles a tamaño completo", async () => {
  const preview = await source("components/TaiMaterialPreview.tsx");
  for (let index = 1; index <= 4; index += 1) {
    assert.match(preview, new RegExp(`/muestras/tai-${index}\\.jpeg`));
  }
  assert.match(preview, /target="_blank"/);
});
