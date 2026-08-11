import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("the umbrella landing has the three administrative routes", async () => {
  const source = await readFile(new URL("../src/main.tsx", import.meta.url), "utf8");
  assert.match(source, /Auxiliar Administrativo/);
  assert.match(source, /Estado/);
  assert.match(source, /SAS/);
  assert.match(source, /Ayuntamientos/);
  assert.doesNotMatch(source, /Santander|Auxilio Judicial/);
});

test("metadata points to the umbrella domain", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /auxiliar-administrativo\.academialorman\.es/);
});
