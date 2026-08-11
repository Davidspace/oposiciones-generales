import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the common hub exposes the administrative routes through WhatsApp", async () => {
  const [app, home, cursos, index, links, envExample, vercel] = await Promise.all([
    readFile(new URL("client/src/App.tsx", root), "utf8"),
    readFile(new URL("client/src/pages/home.tsx", root), "utf8"),
    readFile(new URL("client/src/data/cursos.ts", root), "utf8"),
    readFile(new URL("client/index.html", root), "utf8"),
    readFile(new URL("client/src/lib/portfolio-links.ts", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
  ]);

  assert.match(app, /MOODLE_URL/);
  assert.doesNotMatch(app, /C2Home|path=\"\/c2\"/);
  assert.match(home, /FICHAS/);
  assert.match(home, /Estado, SAS y ayuntamientos/);

  for (const label of [
    "Auxiliar Administrativo del Estado",
    "Auxiliar Administrativo/a del SAS",
    "Auxiliar Administrativo Local",
  ]) {
    assert.match(cursos, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(cursos, /Preguntar por Estado/);
  assert.match(cursos, /Preguntar por SAS/);
  assert.match(cursos, /Proponer convocatoria/);
  assert.match(cursos, /whatsappCourse/);
  assert.doesNotMatch(cursos, /administrativo-estado\.vercel\.app/);
  assert.doesNotMatch(links, /administrativo-estado\.vercel\.app/);
  assert.doesNotMatch(envExample, /VITE_C2_URL/);
  assert.doesNotMatch(index, /administrativo-estado\.vercel\.app/);
  assert.match(index, /Auxiliar Administrativo del Estado C2/);
  assert.match(index, /Auxiliar Administrativo\/a del SAS/);
  assert.match(index, /Auxiliar Administrativo Local/);
  assert.match(links, /aula\.academialorman\.es/);
  assert.match(vercel, /https:\/\/academialorman\.es\/\$1/);
  assert.doesNotMatch(vercel, /sslip\.io/);
});
