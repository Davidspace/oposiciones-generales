import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("TAI keeps its landing independent and exposes the portfolio route", async () => {
  const [page, layout, links, context, envExample] = await Promise.all([
    readFile(new URL("app/tai/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("lib/portfolio-links.ts", root), "utf8"),
    readFile(new URL("CONTEXT.md", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
  ]);

  assert.match(page, /className="tai-nav-home"/);
  assert.match(page, /PORTFOLIO_URL/);
  assert.match(page, /className="tai-skip-link"/);
  assert.match(page, /id="contenido-principal"/);
  assert.match(layout, /alternates:\s*\{\s*canonical:\s*["']\/["']/u);
  assert.match(links, /NEXT_PUBLIC_PORTFOLIO_URL/);
  assert.doesNotMatch(page, /sslip\.io|Forja\s*TIC|SS\s+CasoLab|GSI\s+Caso/u);
  assert.match(context, /^# TAI Academia/mu);
  assert.doesNotMatch(context, /\*\*SS\s+CasoLab\*\*|\*\*Módulo general\*\*/u);
  assert.match(envExample, /TAI_ACADEMIA_ANALYTICS_ENABLED=false/u);
  assert.doesNotMatch(envExample, /SS_CASOLAB|GSI_CASO_0/u);
});
