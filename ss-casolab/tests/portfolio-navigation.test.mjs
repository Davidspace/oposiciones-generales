import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("SS CasoLab keeps its landing independent and exposes the portfolio route", async () => {
  const [page, layout, links, context] = await Promise.all([
    readFile(new URL("app/ss-casolab/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("lib/portfolio-links.ts", root), "utf8"),
    readFile(new URL("CONTEXT.md", root), "utf8"),
  ]);

  assert.match(page, /className="ss-nav-home"/);
  assert.match(page, /PORTFOLIO_URL/);
  assert.match(page, /className="ss-skip-link"/);
  assert.match(page, /id="contenido-principal"/);
  assert.match(layout, /alternates:\s*\{\s*canonical:\s*["']\/["']/u);
  assert.match(links, /NEXT_PUBLIC_PORTFOLIO_URL/);
  assert.doesNotMatch(page, /sslip\.io|Forja\s*TIC|TAI\s+Academia|GSI\s+Caso/u);
  assert.match(context, /SS\s+CasoLab/u);
});
