import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the common hub uses configured product destinations and the canonical Moodle host", async () => {
  const [app, home, fichas, cursos, index, links, envExample, vercel] = await Promise.all([
    readFile(new URL("client/src/App.tsx", root), "utf8"),
    readFile(new URL("client/src/pages/home.tsx", root), "utf8"),
    readFile(new URL("client/src/data/fichas.ts", root), "utf8"),
    readFile(new URL("client/src/data/cursos.ts", root), "utf8"),
    readFile(new URL("client/index.html", root), "utf8"),
    readFile(new URL("client/src/lib/portfolio-links.ts", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
  ]);

  assert.match(app, /MOODLE_URL/);
  assert.match(fichas, /PRODUCT_URLS\.tai/);
  assert.match(fichas, /PRODUCT_URLS\.ss/);
  assert.match(fichas, /PRODUCT_URLS\.c2/);
  assert.match(fichas, /PRODUCT_URLS\.auxJuridico/);
  assert.match(fichas, /temas cubiertos mediante cuestionarios/);
  assert.doesNotMatch(fichas, /90\s+(?:cuestionarios|tests)/i);
  assert.match(cursos, /Programa cubierto con tests/);
  assert.match(cursos, /26 temas · sin material teórico/);
  assert.doesNotMatch(cursos, /90\s+(?:cuestionarios|tests)/i);
  assert.doesNotMatch(index, /90\s+(?:cuestionarios|tests)/i);
  assert.match(home, /FICHAS/);
  assert.match(home, /PRODUCT_URLS\.c2/);
  assert.match(home, /className="hub-skip-link"/);
  assert.match(links, /VITE_MOODLE_URL/);
  assert.match(links, /aula\.academialorman\.es/);
  assert.match(links, /DEFAULT_PORTFOLIO_URL = "https:\/\/academialorman\.es"/u);
  assert.match(index, /canonical" href="https:\/\/academialorman\.es\//u);
  assert.match(index, /og:url" content="https:\/\/academialorman\.es\//u);
  assert.doesNotMatch(index, /lorman-lab\.vercel\.app/u);
  assert.match(envExample, /VITE_C2_URL/);
  assert.match(envExample, /VITE_AUX_JURIDICO_URL/);
  assert.match(envExample, /auxiliojudicial\.academialorman\.es/);
  assert.match(vercel, /aula\.academialorman\.es\/course\/view\.php\?id=2/u);
  assert.doesNotMatch(vercel, /sslip\.io/u);
  assert.doesNotMatch(app, /sslip\.io/u);
});
