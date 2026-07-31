import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const clientPages = [
  new URL("../app/page.tsx", import.meta.url),
  new URL("../app/ss-casolab/page.tsx", import.meta.url),
  new URL("../app/ss-casolab/pedido/page.tsx", import.meta.url),
];

test("public landing analytics do not write identifiers to browser storage", async () => {
  for (const pageUrl of clientPages) {
    const source = await readFile(pageUrl, "utf8");
    assert.doesNotMatch(source, /(?:local|session)Storage/);
    assert.doesNotMatch(source, /document\.cookie/);
    assert.match(source, /eventId:\s*window\.crypto\.randomUUID\(\)/);
    assert.match(source, /\/api\/public-config\?experiment=/);
  }
});

test("the order UI never reads or persists the raw lookup credential", async () => {
  const [page, orderRoute, cookieBridge] = await Promise.all([
    readFile(new URL("../app/ss-casolab/pedido/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/orders/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/order-session-cookie.ts", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(page, /lookupToken|Authorization|Bearer/);
  assert.doesNotMatch(page, /(?:local|session)Storage|document\.cookie/);
  assert.match(orderRoute, /secureCreateOrderResponse/);
  assert.match(cookieBridge, /HttpOnly/);
  assert.match(cookieBridge, /SameSite=Strict/);
  assert.match(cookieBridge, /delete body\.lookupToken/);
});
