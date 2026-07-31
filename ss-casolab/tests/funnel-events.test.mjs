import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ALLOWED_FUNNEL_EVENTS,
  isFunnelEventType,
  sanitizeFunnelMetadata,
} from "../lib/experiments.ts";
import { parsePublicEventEnvelope } from "../lib/public-event-input.ts";
import {
  analyticsEnabled,
  readPublicRuntimeConfig,
} from "../lib/public-runtime-config.ts";

test("analytics and capture fail closed until their exact flags are enabled", () => {
  assert.equal(analyticsEnabled({}), false);
  assert.equal(
    analyticsEnabled({ SS_CASOLAB_ANALYTICS_ENABLED: "false" }),
    false,
  );
  assert.equal(
    analyticsEnabled({ SS_CASOLAB_ANALYTICS_ENABLED: "true" }),
    true,
  );
  assert.deepEqual(readPublicRuntimeConfig({}, "ss-casolab"), {
    analyticsEnabled: false,
    captureEnabled: false,
    capturePrivacyUrl: null,
    orderingEnabled: false,
  });
  assert.deepEqual(
    readPublicRuntimeConfig(
      {
        SS_CASOLAB_ANALYTICS_ENABLED: "true",
        SS_CASOLAB_CAPTURE_ENABLED: "true",
      },
      "ss-casolab",
    ),
    {
      analyticsEnabled: true,
      captureEnabled: false,
      capturePrivacyUrl: null,
      orderingEnabled: false,
    },
  );
  assert.deepEqual(
    readPublicRuntimeConfig(
      {
        SS_CASOLAB_ANALYTICS_ENABLED: "true",
        SS_CASOLAB_CAPTURE_ENABLED: "true",
        SS_CASOLAB_PRIVACY_VERSION: "privacy-2026-07",
        SS_CASOLAB_PRIVACY_URL: "https://example.test/privacidad",
      },
      "ss-casolab",
    ),
    {
      analyticsEnabled: true,
      captureEnabled: true,
      capturePrivacyUrl: "https://example.test/privacidad",
      orderingEnabled: false,
    },
  );
  assert.equal(readPublicRuntimeConfig({}, "unknown"), null);
});

test("public event envelopes accept only opaque UUIDs and bounded attribution", () => {
  const valid = {
    eventId: "10000000-4000-4000-8000-000000000001",
    sessionId: "20000000-4000-4000-8000-000000000002",
    experiment: "ss-casolab",
    offerVariant: "academy-beta-v1",
    eventType: "landing_view",
    path: "/ss-casolab",
    utmSource: "youtube",
    utmMedium: "organic",
    utmCampaign: "julio-2026",
  };
  assert.deepEqual(parsePublicEventEnvelope(valid), {
    ...valid,
    metadata: undefined,
  });

  for (const invalid of [
    { ...valid, sessionId: "persona@example.com" },
    { ...valid, sessionId: "session-12345678" },
    { ...valid, path: "/ss-casolab?email=persona@example.com" },
    { ...valid, utmSource: "+34600111222" },
    { ...valid, utmCampaign: "600111222" },
    { ...valid, referrer: "https://example.test" },
    { ...valid, offerVariant: "texto libre con espacios" },
  ]) {
    assert.equal(parsePublicEventEnvelope(invalid), null, JSON.stringify(invalid));
  }
});

test("public funnel events cannot claim payment, access or refunds", () => {
  for (const eventType of [
    "payment_verified",
    "purchase_confirmed",
    "access_provisioned",
    "access_revoked",
    "refund_confirmed",
    "order_created",
  ]) {
    assert.equal(ALLOWED_FUNNEL_EVENTS.has(eventType), false);
    assert.equal(isFunnelEventType(eventType), false);
  }
});

test("public order interactions remain measurable without asserting a sale", () => {
  for (const eventType of [
    "order_form_start",
    "bizum_instructions_viewed",
    "whatsapp_click",
  ]) {
    assert.equal(ALLOWED_FUNNEL_EVENTS.has(eventType), true);
    assert.equal(isFunnelEventType(eventType), true);
  }
});

test("metadata is allowlisted per public event and rejects PII-shaped extras", () => {
  assert.deepEqual(
    sanitizeFunnelMetadata("diagnostic_complete", {
      correct: 3,
      unanswered: 2,
      dominantError: "confusion-plazos",
      scoreBand: "developing",
    }),
    {
      correct: 3,
      unanswered: 2,
      dominantError: "confusion-plazos",
      scoreBand: "developing",
    },
  );
  assert.equal(
    sanitizeFunnelMetadata("diagnostic_complete", {
      correct: 3,
      email: "persona@example.com",
    }),
    null,
  );
  assert.equal(
    sanitizeFunnelMetadata("whatsapp_click", {
      context: "+34600111222",
    }),
    null,
  );
  assert.deepEqual(sanitizeFunnelMetadata("landing_view", undefined), {});
});

test("the public endpoint requires an event id, deduplicates and rate limits", async () => {
  const [route, persistence] = await Promise.all([
    readFile(new URL("../app/api/events/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/events.ts", import.meta.url), "utf8"),
  ]);

  assert.match(route, /parsePublicEventEnvelope\(body\)/);
  assert.match(route, /if \(!analyticsEnabled/);
  assert.ok(
    route.indexOf("if (!analyticsEnabled") < route.indexOf("request.json()"),
    "el gate debe ejecutarse antes de leer el cuerpo",
  );
  assert.match(route, /sanitizeFunnelMetadata/);
  assert.doesNotMatch(route, /function safeMetadata/);
  assert.match(persistence, /ON CONFLICT\(id\) DO NOTHING/);
  assert.match(persistence, /COUNT\(\*\) AS total/);
  assert.match(persistence, />= 60/);
  assert.match(route, /status: 429/);
});
