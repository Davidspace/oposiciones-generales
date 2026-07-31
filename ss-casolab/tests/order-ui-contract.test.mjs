import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("order page receives the authoritative offer before collecting data", async () => {
  const [page, disclosures, publicConfig] = await Promise.all([
    readFile(new URL("app/ss-casolab/pedido/page.tsx", root), "utf8"),
    readFile(new URL("app/api/orders/disclosures/route.ts", root), "utf8"),
    readFile(new URL("lib/public-runtime-config.ts", root), "utf8"),
  ]);

  assert.match(page, /\/api\/orders\/disclosures/);
  assert.match(page, /Inventario exacto/);
  assert.match(page, /Condiciones \{offer\.termsVersion\}/);
  assert.match(page, /Privacidad \{offer\.privacyVersion\}/);
  assert.match(page, /Desistimiento/);
  assert.match(page, /offer\.seller\.legalName/);
  assert.match(page, /formatMoney\(offer\.amountCents/);
  assert.match(disclosures, /readPublicOrderConfig/);
  assert.match(publicConfig, /orderingEnabled/);
  assert.doesNotMatch(page, /amountCents:\s*4900|49\s*€/);
});

test("order form has four separate acceptances and an obligation-to-pay label", async () => {
  const page = await readFile(
    new URL("app/ss-casolab/pedido/page.tsx", root),
    "utf8",
  );
  for (const field of [
    "termsAccepted",
    "privacyNoticeAcknowledged",
    "digitalStartConsent",
    "withdrawalAcknowledged",
  ]) {
    assert.match(page, new RegExp(`name=["']${field}["']`));
  }
  assert.match(page, /Crear pedido con obligación de pago/);
  assert.match(page, /No carga una tarjeta ni confirma por sí solo un pago/);
});

test("browser keeps the lookup credential HttpOnly and never persists it in script storage", async () => {
  const [page, route, cookie] = await Promise.all([
    readFile(new URL("app/ss-casolab/pedido/page.tsx", root), "utf8"),
    readFile(new URL("app/api/orders/route.ts", root), "utf8"),
    readFile(new URL("lib/order-session-cookie.ts", root), "utf8"),
  ]);

  assert.doesNotMatch(page, /lookupToken|localStorage|sessionStorage|document\.cookie/);
  assert.match(route, /secureCreateOrderResponse/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /delete body\.lookupToken|lookupToken/u);
});

test("order state is translated for users and payment reports stay unverified", async () => {
  const page = await readFile(
    new URL("app/ss-casolab/pedido/page.tsx", root),
    "utf8",
  );
  assert.match(page, /awaiting_payment:\s*"Pendiente de pago"/);
  assert.match(page, /payment_reported:\s*"Aviso recibido; pago sin verificar"/);
  assert.match(page, /paid:\s*"Pago verificado"/);
  assert.doesNotMatch(page, /status\.replaceAll/);
  assert.match(page, /comprobación manual/);
  assert.match(page, /WhatsApp es un canal de soporte; no confirma el ingreso/);
});

test("admin payment endpoint is server-only, fail-closed and never provisions access", async () => {
  const [route, handler, envExample] = await Promise.all([
    readFile(
      new URL("app/api/admin/orders/verify-payment/route.ts", root),
      "utf8",
    ),
    readFile(new URL("lib/admin-order-handlers.ts", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
  ]);
  assert.match(route, /createD1AdminOrderStore/);
  assert.match(route, /createAdminOrderHandlers/);
  assert.match(handler, /authenticateAdminBearer/);
  assert.match(handler, /Idempotency-Key/);
  assert.match(handler, /accessProvisioned:\s*false/);
  assert.doesNotMatch(handler, /moodle|access_grants|createAccess|provisionAccess/iu);
  assert.match(envExample, /SS_CASOLAB_ADMIN_ENABLED=false/);
  assert.match(envExample, /SS_CASOLAB_PAYMENT_REFERENCE_HMAC_SECRET=/);
});
