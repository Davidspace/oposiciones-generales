import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("contains the Swiss GSI Caso 0 landing and a minimal form", async () => {
  const [page, layout, styles, packageJson, hosting] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL(".openai/hosting.json", root), "utf8"),
  ]);
  const gsiStyles = styles.split("/* SS CasoLab")[0];

  assert.match(page, /GSI Caso 0/);
  assert.match(page, /Aprende a resolver el supuesto práctico de GSI/);
  assert.match(page, /680 plazas de ingreso libre/);
  assert.match(page, /LA RÚBRICA OFICIAL/);
  assert.match(page, /Preventa inicial/);
  assert.match(page, /49 €/);
  assert.match(page, /Quiero recibir el diagnóstico/);
  assert.doesNotMatch(page, /name="priceSignal"|Lo compraría|método de pago/);
  assert.doesNotMatch(
    page,
    /name="whatsapp"|name="hoursPerWeek"|name="casePreference"|name="notes"/,
  );
  assert.match(gsiStyles, /--accent:\s*#e4002b/i);
  assert.match(gsiStyles, /--surface:\s*#ffffff/i);
  assert.doesNotMatch(
    gsiStyles,
    /Georgia|Times New Roman|border-radius:\s*999px/i,
  );
  assert.doesNotMatch(
    page,
    /290 €|12 semanas|corrección semanal en directo|comunidad privada|primera cohorte/i,
  );
  assert.match(layout, /lang="es"/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(layout, /next\/font|Geist_Mono/);
  assert.doesNotMatch(page, /codex-preview|SkeletonPreview/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  const hostingConfig = JSON.parse(hosting);
  assert.equal(hostingConfig.d1, "DB");
  assert.equal(hostingConfig.r2, null);
  assert.match(hostingConfig.project_id, /^appgprj_/);
});

test("lead capture separates SS WhatsApp consent from legacy GSI email", async () => {
  const [route, storage, schema, migration, runtimeConfig] = await Promise.all([
    readFile(new URL("app/api/leads/route.ts", root), "utf8"),
    readFile(new URL("db/leads.ts", root), "utf8"),
    readFile(new URL("db/schema.ts", root), "utf8"),
    readFile(new URL("drizzle/0004_whatsapp_leads.sql", root), "utf8"),
    readFile(new URL("lib/public-runtime-config.ts", root), "utf8"),
  ]);

  assert.match(route, /body\.consent !== true/);
  assert.match(route, /body\.whatsappConsent !== true/);
  assert.match(route, /ALLOWED_EXPERIMENTS/);
  assert.match(route, /ALLOWED_MODALITIES/);
  assert.match(route, /E164_PATTERN/);
  assert.match(route, /SS_CASOLAB_PRIVACY_VERSION/);
  assert.doesNotMatch(
    route,
    /priceSignal|casePreference|hoursPerWeek|body\.notes/,
  );
  assert.match(route, /utmCampaign/);
  assert.match(route, /readPublicRuntimeConfig/);
  assert.match(route, /!runtimeConfig\?\.captureEnabled/);
  assert.match(runtimeConfig, /SS_CASOLAB_CAPTURE_ENABLED/);
  assert.match(runtimeConfig, /GSI_CASO_0_CAPTURE_ENABLED/);
  assert.match(route, /No hemos guardado ningún dato/);
  assert.match(storage, /ON CONFLICT\(contact_key, experiment\) DO UPDATE/);
  assert.match(storage, /offer_variant/);
  assert.match(storage, /ss-whatsapp-v1/);
  assert.match(storage, /whatsapp_consent_at/);
  assert.doesNotMatch(storage, /CREATE TABLE|CREATE UNIQUE INDEX/);
  assert.doesNotMatch(
    storage,
    /case_preference|hours_per_week|price_signal|\bnotes\b/,
  );
  assert.match(schema, /leads_contact_experiment_unique/);
  assert.match(schema, /leads_contact_contract_check/);
  assert.match(migration, /'legacy:' \|\| `id`, 'legacy-v1'/);
  assert.match(migration, /whatsapp_consent_at/);
  assert.doesNotMatch(
    migration.match(/CREATE TABLE `leads_next`[\s\S]*?\);/)?.[0] ?? "",
    /case_preference|hours_per_week|price_signal|`notes`/,
  );
});

test("event endpoint only stores attributed funnel events", async () => {
  const [route, storage, migration] = await Promise.all([
    readFile(new URL("app/api/events/route.ts", root), "utf8"),
    readFile(new URL("db/events.ts", root), "utf8"),
    readFile(new URL("drizzle/0002_dual_experiments.sql", root), "utf8"),
  ]);

  assert.match(route, /ALLOWED_EXPERIMENTS/);
  assert.match(route, /ALLOWED_FUNNEL_EVENTS/);
  assert.match(route, /metadata/);
  assert.match(storage, /funnel_events/);
  assert.match(storage, /metadata_json/);
  assert.doesNotMatch(storage, /ip_address|user_agent/i);
  assert.match(migration, /DROP INDEX `leads_email_unique`/);
  assert.match(migration, /leads_email_experiment_unique/);
  assert.match(migration, /CREATE TABLE `funnel_events`/);
});

test("contains the full SS CasoLab academy funnel and gated diagnostic", async () => {
  const [
    page,
    metadata,
    caseScorer,
    caseAdapter,
    caseSource,
    styles,
    envExample,
    orderRoute,
    retiredCheckoutRoute,
    diagnosticRoute,
    orderContract,
    orderArchitecture,
    flexibleVariant,
    feedbackVariant,
  ] =
    await Promise.all([
    readFile(new URL("app/ss-casolab/page.tsx", root), "utf8"),
    readFile(new URL("app/ss-casolab/layout.tsx", root), "utf8"),
    readFile(new URL("lib/ss-casolab.ts", root), "utf8"),
    readFile(new URL("lib/ss-casolab-source.ts", root), "utf8"),
    readFile(new URL("content-source/cases/MC01.json", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
    readFile(new URL("app/api/orders/route.ts", root), "utf8"),
    readFile(new URL("app/api/checkout/route.ts", root), "utf8"),
    readFile(new URL("app/api/ss-diagnostic/route.ts", root), "utf8"),
    readFile(
      new URL(
        "specs/002-ss-casolab-academy/contracts/funnel-and-purchase.md",
        root,
      ),
      "utf8",
    ),
    readFile(
      new URL("research/ss-bizum-whatsapp-architecture.md", root),
      "utf8",
    ),
    readFile(new URL("app/ss-casolab/sin-horarios/page.tsx", root), "utf8"),
    readFile(new URL("app/ss-casolab/repaso/page.tsx", root), "utf8"),
  ]);
  const caseManifest = JSON.parse(caseSource);
  const canonicalQuestions = await Promise.all(
    caseManifest.questionIds.map((questionId) =>
      readFile(
        new URL(`content-source/questions/${questionId}.json`, root),
        "utf8",
      ),
    ),
  );
  const canonicalContent = `${caseSource}\n${canonicalQuestions.join("\n")}`;

  assert.match(page, /SS CasoLab/);
  assert.match(page, /ss-casolab/);
  assert.match(page, /diagnostic_start/);
  assert.match(page, /diagnostic_complete/);
  assert.doesNotMatch(page, /checkout_click/);
  assert.match(page, /captureEnabled/);
  assert.match(page, /result\.unanswered/);
  assert.match(page, /\/api\/ss-diagnostic/);
  assert.doesNotMatch(page, /\/api\/checkout/);
  assert.match(page, /49 €/);
  assert.match(page, /BETA PROGRESIVA/);
  assert.match(page, /messageVariant="method"/);
  assert.match(page, /academy-full-method-v1/);
  assert.match(page, /academy-full-flexible-v1/);
  assert.match(page, /academy-full-feedback-v1/);
  assert.match(flexibleVariant, /messageVariant="flexible"/);
  assert.match(feedbackVariant, /messageVariant="feedback"/);
  assert.match(page, /36/);
  assert.match(page, /23 generales \+ 13 específicos/);
  assert.match(page, /60/);
  assert.match(page, /simulacros en el banco de trabajo/);
  assert.doesNotMatch(page, /Solo bloque específico/);
  assert.doesNotMatch(page, /No prepara los 23 temas generales/);
  assert.match(page, /ACCESO 6 MESES/);
  assert.doesNotMatch(page, /ACCESO 12 MESES/);
  assert.match(page, /name="name"/);
  assert.match(page, /name="whatsapp"/);
  assert.match(page, /name="email"/);
  assert.match(page, /name="stage"/);
  assert.match(page, /name="challenge"/);
  assert.match(page, /name="whatsappConsent"/);
  assert.match(page, /capturePrivacyUrl/);
  assert.match(page, /información de privacidad/);
  const ssWhatsappInput = page.match(
    /<input\s+name="whatsapp"[\s\S]*?\/>/,
  )?.[0];
  const ssEmailInput = page.match(/<input\s+name="email"[\s\S]*?\/>/)?.[0];
  assert.ok(ssWhatsappInput);
  assert.ok(ssEmailInput);
  assert.match(ssWhatsappInput, /required/);
  assert.match(ssWhatsappInput, /pattern="\[\+\]\[1-9\]\[0-9\]\{1,14\}"/);
  assert.doesNotMatch(ssEmailInput, /required/);
  assert.doesNotMatch(
    page,
    /name="priceSignal"|name="casePreference"|name="hoursPerWeek"|name="notes"|name="consent"/,
  );
  assert.doesNotMatch(page, /cuánto pagar|pagarías/i);

  assert.equal(caseManifest.questionIds.length, 5);
  assert.equal(canonicalQuestions.length, 5);
  assert.match(caseScorer, /incorrect \* 0\.25/);
  assert.doesNotMatch(caseScorer, /content-source|MC01\.json/);
  assert.match(caseAdapter, /canonicalQuestionsById/);
  assert.match(diagnosticRoute, /readPublicSsDiagnostic/);
  assert.match(diagnosticRoute, /publicable: false/);
  assert.match(canonicalContent, /www\.boe\.es/);
  assert.match(canonicalContent, /www\.seg-social\.es/);
  assert.match(canonicalContent, /La afiliación es única/);

  assert.match(metadata, /Administrativo de la Seguridad Social C1/);
  assert.match(metadata, /\/ss-casolab-og\.png/);
  assert.match(styles, /--ss-paper:\s*#e8e0c0/i);
  assert.match(styles, /--ss-pink:\s*#ff006e/i);
  assert.match(styles, /rotate\(-2deg\)|rotate\(2deg\)/);
  assert.match(envExample, /SS_CASOLAB_ORDERING_ENABLED=false/);
  assert.doesNotMatch(
    `${envExample}\n${orderContract}\n${orderArchitecture}`,
    /(?:^|\n)SS_ORDERING_ENABLED=/,
  );
  assert.match(envExample, /SS_CASOLAB_CAPTURE_ENABLED=false/);
  assert.doesNotMatch(envExample, /SS_CASOLAB_CHECKOUT_URL=/);
  assert.match(orderRoute, /createPublicOrderHandlers/);
  assert.match(orderRoute, /\.create\(request\)/);
  assert.match(retiredCheckoutRoute, /status:\s*410/);
  assert.doesNotMatch(retiredCheckoutRoute, /process\.env|SS_CASOLAB_CHECKOUT_URL/);
});

test("contains the TAI course landing based on the LORMAN Moodle inventory", async () => {
  const [page, layout, styles] = await Promise.all([
    readFile(new URL("app/tai/page.tsx", root), "utf8"),
    readFile(new URL("app/tai/layout.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /Curso completo TAI 2026/);
  assert.match(page, /33 temas en PDF/);
  assert.match(page, /33 autoevaluaciones/);
  assert.match(page, /10 simulacros completos/);
  assert.match(page, /1\.030 plazas/);
  assert.match(page, /59 €/);
  assert.match(page, /sin clases obligatorias/);
  assert.doesNotMatch(page, /forjatic|ForjaTIC/);
  assert.match(layout, /Curso completo TAI 2026 \| Academia LORMAN/);
  assert.doesNotMatch(layout, /forjatic|ForjaTIC/);
  assert.match(styles, /\.tai-page/);
  assert.match(styles, /--tai-accent:\s*#e04f2f/i);
  assert.doesNotMatch(styles, /border-radius:\s*999px/);
});

test("the production client bundle excludes every unpublished MC01 text", async () => {
  const caseManifest = JSON.parse(
    await readFile(new URL("content-source/cases/MC01.json", root), "utf8"),
  );
  assert.notEqual(caseManifest.status, "published");
  const questionDocuments = await Promise.all(
    caseManifest.questionIds.map(async (questionId) =>
      JSON.parse(
        await readFile(
          new URL(`content-source/questions/${questionId}.json`, root),
          "utf8",
        ),
      ),
    ),
  );
  const clientRoot = new URL("dist/client/", root);
  const entries = await readdir(clientRoot, { recursive: true });
  const clientSource = (
    await Promise.all(
      entries
        .filter((entry) => /\.(?:js|html)$/.test(entry))
        .map((entry) =>
          readFile(new URL(entry.replaceAll("\\", "/"), clientRoot), "utf8"),
        ),
    )
  ).join("\n");

  for (const unpublishedText of [
    caseManifest.title,
    caseManifest.scenario,
    ...questionDocuments.map((question) => question.prompt),
  ]) {
    assert.equal(
      clientSource.includes(unpublishedText),
      false,
      `El bundle público contiene un borrador: ${unpublishedText.slice(0, 40)}`,
    );
  }
});
