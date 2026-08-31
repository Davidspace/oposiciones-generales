import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("la landing Celador SMS usa el contenido auditado y la oferta separada", async () => {
  const [source, freeTestComponent, freeTest, html, config, attribution, analytics, inventory, moodleOutline, notFound] = await Promise.all([
    readFile(new URL("src/main.tsx", root), "utf8"),
    readFile(new URL("src/components/FreeTest.tsx", root), "utf8"),
    readFile(new URL("src/data/free-test.ts", root), "utf8"),
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("vercel.json", root), "utf8"),
    readFile(new URL("src/lib/attribution.ts", root), "utf8"),
    readFile(new URL("src/lib/analytics.ts", root), "utf8"),
    readFile(new URL("docs/content-inventory.csv", root), "utf8"),
    readFile(new URL("docs/moodle-course-outline.md", root), "utf8"),
    readFile(new URL("public/404.html", root), "utf8"),
  ]);

  assert.match(source, /Celador\/a-Subalterno\/a/);
  assert.match(source, /14 temas completos/);
  assert.match(source, /7 temas comunes y 7 especÃ­ficos|7 temas comunes y 7 específicos/);
  assert.match(source, /50 preguntas por tema/);
  assert.match(source, /10 simulacros SMS/);
  assert.match(source, /75 preguntas/);
  assert.match(source, /85 minutos/);
  assert.match(source, /muestras\/tema-completo-t01\.jpg/);
  assert.match(source, /muestras\/resumen-t01\.jpg/);
  assert.match(source, /muestras\/test-t05\.jpg/);
  assert.match(source, /muestras\/simulacro-01\.jpg/);
  assert.match(source, /−1\/4/);
  assert.match(source, /90 € curso completo/);
  assert.match(source, /45 €|45 â‚¬/);
  assert.match(source, /BORM/);
  assert.match(source, /murciasalud\.es\/oposicionsms/);
  assert.match(freeTestComponent, /Prueba gratuita/);
  assert.match(freeTestComponent, /17 minutos/);
  assert.match(freeTestComponent, /−0,25 por error/);
  assert.match(freeTestComponent, /free_test_progress/);
  assert.match(freeTestComponent, /free_test_repeat/);
  assert.match(freeTestComponent, /Repetir la prueba/);
  assert.match(freeTestComponent, /Resultado por bloques/);
  assert.match(freeTestComponent, /currentIndex/);
  assert.match(freeTestComponent, /const \[started/);
  assert.match(freeTestComponent, /Comenzar la prueba/);
  assert.match(freeTestComponent, /lm-sms-test-frame/);
  assert.match(freeTestComponent, /lm-sms-result-actions/);
  assert.match(freeTestComponent, /if \(!started \|\| submitted\)/);
  assert.match(freeTestComponent, /Pregunta \{currentIndex \+ 1\} de/);
  assert.match(freeTestComponent, /Siguiente/);
  assert.match(freeTestComponent, /Anterior/);
  assert.doesNotMatch(freeTestComponent, /FREE_TEST\.map\(\(question, index\)/);
  assert.match(freeTestComponent, /answered_count/);
  assert.doesNotMatch(freeTestComponent, /question_id/);
  assert.match(source, /view_price/);
  assert.match(source, /open_free_test/);
  assert.doesNotMatch(source, /start_free_test.*placement: "hero"/);
  assert.match(source, /faq_open/);
  const ctaContacto = await readFile(new URL("src/components/CtaContacto.tsx", root), "utf8");
  const cajones = await readFile(new URL("src/components/Cajones.tsx", root), "utf8");
  assert.match(ctaContacto, /click_whatsapp/);
  assert.doesNotMatch(ctaContacto, /whatsapp_click/);
  assert.match(cajones, /click_whatsapp/);
  assert.doesNotMatch(cajones, /whatsapp_click/);
  assert.match(analytics, /G-ZD1KT7K2JM/);
  assert.match(analytics, /source_page/);
  assert.match(analytics, /pendingEvents/);
  assert.match(analytics, /analyticsReady/);
  assert.match(analytics, /flushPendingEvents/);
  assert.doesNotMatch(source, /Auxilio Judicial|auxiliojudicial|Forja TIC|gsi-casos-practicos/);

  assert.equal((freeTest.match(/id: "sms-free-/g) || []).length, 15);
  assert.match(freeTest, /No reproduce preguntas de bancos comerciales/);
  assert.match(freeTest, /Constitución Española, artículo 23\.2/);
  assert.match(freeTest, /Programa específico Celador-Subalterno SMS 2022, tema 7/);
  assert.match(freeTest, /tomografía computarizada/);
  assert.doesNotMatch(freeTest, /En la convocatoria vigente/);
  assert.doesNotMatch(freeTest, /una respuesta errónea/);
  assert.doesNotMatch(freeTest, /El programa común vigente/);
  assert.doesNotMatch(freeTest, /La mejor forma de usar esta prueba/);

  assert.match(html, /Celador SMS Murcia/);
  assert.match(html, /celadorsms\.academialorman\.es/);
  assert.match(html, /"numberOfQuestions": 15/);
  assert.match(html, /"name": "Curso completo"/);
  assert.match(html, /"name": "Pack solo tests"/);
  assert.match(html, /"price": "45"/);
  assert.doesNotMatch(html, /auxiliojudicial|auxiliar-juridico/);
  assert.match(notFound, /No encontramos esa página/);
  assert.match(notFound, /noindex/);

  assert.match(config, /celador-sms-murcia/);
  assert.match(config, /celadorsms\.academialorman\.es/);
  assert.match(config, /celador_sms_murcia_2026/);
  assert.match(attribution, /lorman_celador_sms_attribution_v1/);
  assert.equal(inventory.trim().split(/\r?\n/).length, 132);
  assert.equal((inventory.match(/,especifica:T01,/g) || []).length, 6);
  assert.equal((inventory.match(/,especifica:T07,/g) || []).length, 6);
  assert.doesNotMatch(inventory, /01 TEMAS\/ESPECIFICA\/[^\n]+,metadatos y fuentes,fuentes y auditoria/);
  assert.match(inventory, /T01_test_50_preguntas\.pdf,test tematico,especifica:T01/);
  assert.match(inventory, /E-001 repeated stems; E-002 legal review/);
  assert.match(moodleOutline, /TEMARIO COMÚN/);
  assert.match(moodleOutline, /TEMARIO ESPECÍFICO/);
  assert.match(moodleOutline, /E07.*Informática básica/);
  assert.match(moodleOutline, /SIMULACROS PROPIOS/);
});
