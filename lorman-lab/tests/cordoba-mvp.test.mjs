import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("el diagnóstico de Córdoba respeta el contrato 15 + 5 + microcaso", async () => {
  const source = await readFile(new URL("client/src/data/cordoba-diagnostic.ts", root), "utf8");
  assert.equal([...source.matchAll(/id: "COR-D\d{2}"/g)].length, 21);
  assert.equal([...source.matchAll(/kind: "teorica",/g)].length, 15);
  assert.equal([...source.matchAll(/kind: "aplicada",/g)].length, 5);
  assert.equal([...source.matchAll(/kind: "microcaso",/g)].length, 1);
  assert.equal([...source.matchAll(/correctIndex: \d,/g)].length, 21);
  assert.equal([...source.matchAll(/explanation: "/g)].length, 21);
  assert.equal([...source.matchAll(/source: \{ label: "/g)].length, 21);
});

test("la ruta de Córdoba instala SEO, precio y eventos sin simular compras", async () => {
  const [app, page, analytics, cursos, index] = await Promise.all([
    readFile(new URL("client/src/App.tsx", root), "utf8"),
    readFile(new URL("client/src/pages/cordoba-home.tsx", root), "utf8"),
    readFile(new URL("client/src/lib/analytics.ts", root), "utf8"),
    readFile(new URL("client/src/data/cursos.ts", root), "utf8"),
    readFile(new URL("client/index.html", root), "utf8"),
  ]);

  assert.match(app, /path="\/auxiliar-administrativo-cordoba"/);
  assert.match(page, /https:\/\/academialorman\.es\/auxiliar-administrativo-cordoba/);
  assert.match(page, /view_cordoba/);
  assert.match(page, /start_test_cordoba|CordobaDiagnostic/);
  assert.match(page, /view_price_cordoba/);
  assert.match(page, /click_whatsapp_cordoba/);
  assert.doesNotMatch(page, /trackEvent\("purchase_cordoba"/);
  assert.match(analytics, /G-ZD1KT7K2JM/);
  assert.match(cursos, /Ver curso Córdoba/);
  assert.match(cursos, /69 €/);
  assert.match(index, /Auxiliar Administrativo del Ayuntamiento de Córdoba/);
});
