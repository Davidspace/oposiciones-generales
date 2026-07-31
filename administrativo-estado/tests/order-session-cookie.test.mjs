import assert from "node:assert/strict";
import test from "node:test";

import {
  authorizeOrderRequestFromCookie,
  createOrderLookupCookie,
  readOrderLookupCookie,
  secureCreateOrderResponse,
} from "../lib/order-session-cookie.ts";

const TOKEN = "a".repeat(64);
const NOW = new Date("2026-07-30T10:00:00.000Z");
const EXPIRES_AT = "2026-08-01T10:00:00.000Z";

test("the order lookup cookie is host-only, HttpOnly and bounded", () => {
  const cookie = createOrderLookupCookie(TOKEN, EXPIRES_AT, NOW);
  assert.match(cookie, /^__Host-ss_order_lookup=/);
  assert.match(cookie, /Path=\//);
  assert.match(cookie, /Max-Age=172800/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Strict/);
  assert.doesNotMatch(cookie, /Domain=/);
  assert.equal(readOrderLookupCookie(cookie), TOKEN);
  assert.equal(readOrderLookupCookie("__Host-ss_order_lookup=bad"), null);
});

test("cookie authorization overrides browser headers without changing the URL", async () => {
  const request = new Request(
    "https://example.test/api/orders/status?reference=SS-00112233445566778899AABB",
    { headers: { cookie: createOrderLookupCookie(TOKEN, EXPIRES_AT, NOW) } },
  );
  const authorized = authorizeOrderRequestFromCookie(request);
  assert.equal(authorized.url, request.url);
  assert.equal(authorized.headers.get("authorization"), `Bearer ${TOKEN}`);
});

test("the web response moves the raw lookup token into an HttpOnly cookie", async () => {
  const response = Response.json(
    {
      ok: true,
      lookupToken: TOKEN,
      order: {
        reference: "SS-00112233445566778899AABB",
        expiresAt: EXPIRES_AT,
      },
    },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
  const secured = await secureCreateOrderResponse(response, NOW);
  const body = await secured.json();
  assert.equal(secured.status, 201);
  assert.equal("lookupToken" in body, false);
  assert.equal(body.order.reference, "SS-00112233445566778899AABB");
  assert.match(secured.headers.get("set-cookie"), /HttpOnly/);
  assert.match(secured.headers.get("set-cookie"), new RegExp(TOKEN));
});
