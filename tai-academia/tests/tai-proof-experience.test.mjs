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
  assert.match(page, /Solicitar información/);
  assert.doesNotMatch(page, /Preguntar por el acceso|Quiero apuntarme|Consultar acceso/);
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
  assert.match(diagnostic, /Prueba TAI gratis\. Ve al grano/);
  assert.match(diagnostic, /Sin registro/);
  assert.match(diagnostic, /Resultado inmediato/);
  assert.match(diagnostic, /Corrección explicada/);
  assert.match(diagnostic, /8 generales \+ 4 prácticas/);
  assert.match(diagnostic, /Tu prioridad sugerida/);
  assert.match(diagnostic, /Solicitar información/);
  assert.match(diagnostic, /33 temas redactados/);
  assert.match(diagnostic, /Pago único de 69 € · acceso hasta el examen/);
  assert.doesNotMatch(diagnostic, />Segunda parte</);
});

test("GA4 respeta el consentimiento, conserva UTM y mide el embudo de TAI", async () => {
  const [analytics, attribution, provider, diagnostic, rootLayout, publicConfig] = await Promise.all([
    source("lib/analytics.ts"),
    source("lib/attribution.ts"),
    source("components/AnalyticsProvider.tsx"),
    source("components/TaiDiagnostic.tsx"),
    source("app/layout.tsx"),
    source("app/api/public-config/route.ts"),
  ]);

  assert.match(analytics, /G-ZD1KT7K2JM/);
  assert.match(analytics, /analytics_storage:\s*"denied"/);
  assert.match(analytics, /ad_storage:\s*"denied"/);
  assert.match(analytics, /allow_google_signals:\s*false/);
  assert.match(attribution, /utm_source/);
  assert.match(attribution, /utm_campaign/);
  assert.match(provider, /ConsentBanner/);
  assert.match(rootLayout, /AnalyticsProvider/);
  assert.match(publicConfig, /process\.env/);
  assert.match(diagnostic, /quiz_start/);
  assert.match(diagnostic, /quiz_complete/);
  assert.match(diagnostic, /whatsapp_click/);
});

test("la vista previa social presenta primero la prueba gratuita", async () => {
  const layout = await source("app/tai/layout.tsx");
  assert.match(layout, /Prueba gratuita TAI C1/);
  assert.match(layout, /12 preguntas sin registro/);
  assert.match(layout, /corrección explicada/);
});

test("las cuatro páginas reales siguen disponibles a tamaño completo", async () => {
  const preview = await source("components/TaiMaterialPreview.tsx");
  for (let index = 1; index <= 4; index += 1) {
    assert.match(preview, new RegExp(`/muestras/tai-${index}\\.jpeg`));
  }
  assert.match(preview, /target="_blank"/);
});

test("el encabezado usa una navegación ligera y WhatsApp no se recorta", async () => {
  const css = await source("app/lorman-industry.css");
  const whatsapp = await source("components/WhatsApp.tsx");
  assert.match(css, /\.lm-page\.lm-tai \.lm-header \.lm-nav a/);
  assert.match(css, /font-weight:\s*500/);
  assert.match(css, /\.lm-footer \.lm-wa svg[^}]*overflow:\s*visible/s);
  assert.match(whatsapp, /viewBox="-1 -1 26 26"/);
});
