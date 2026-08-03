import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("la landing describe el inventario de Auxilio Judicial y no mezcla otros productos", async () => {
  const [source, html, config] = await Promise.all([
    readFile(new URL("src/main.tsx", root), "utf8"),
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
  ]);

  assert.match(source, /Auxilio Judicial/);
  assert.match(source, /TOPICS = \[/);
  assert.match(source, /value: "53"/);
  assert.match(source, /value: "90"|90.*cuestionarios/s);
  assert.match(source, /course\/view\.php\?id=11/);
  assert.match(source, /solo tests|Solo práctica/s);
  assert.doesNotMatch(source, /gsi-casos-practicos|Forja TIC|sslip\.io|lorman-academia\.vercel\.app/i);
  assert.match(html, /Auxilio Judicial C2/);
  assert.match(config, /"outputDirectory": "dist"/);
});
