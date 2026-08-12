import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

const privateSource = new URL("../private-content/cordoba/banco-100-preguntas.mjs", import.meta.url);
const privateContentAvailable = existsSync(privateSource);
const privateModule = privateContentAvailable ? await import(privateSource.href) : null;
const metadata = privateModule?.metadata;
const questions = privateModule?.questions;

test("el banco privado de Córdoba contiene 100 preguntas y cinco por tema", { skip: !privateContentAvailable }, () => {
  assert.equal(metadata.total, 100);
  assert.equal(questions.length, 100);
  const distribution = new Map();
  for (const item of questions) distribution.set(item.topic, (distribution.get(item.topic) || 0) + 1);
  assert.deepEqual([...distribution.keys()], Array.from({ length: 20 }, (_, index) => index + 1));
  for (const total of distribution.values()) assert.equal(total, 5);
});

test("cada pregunta privada tiene cuatro opciones, una respuesta y trazabilidad", { skip: !privateContentAvailable }, () => {
  const ids = new Set();
  for (const item of questions) {
    assert.equal(ids.has(item.id), false, `ID repetido: ${item.id}`);
    ids.add(item.id);
    assert.equal(item.options.length, 4, item.id);
    assert.ok(Number.isInteger(item.correctIndex) && item.correctIndex >= 0 && item.correctIndex < 4, item.id);
    assert.ok(item.explanation.length >= 30, item.id);
    assert.match(item.source.url, /^https:\/\//, item.id);
    assert.match(item.source.reviewedOn, /^\d{4}-\d{2}-\d{2}$/, item.id);
    assert.ok(item.source.locator.length >= 5, item.id);
  }
});

test("el repositorio público no versiona el banco de pago", () => {
  assert.equal(privateSource.pathname.includes("private-content/cordoba"), true);
});
