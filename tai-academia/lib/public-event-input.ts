const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:[._~-][a-z0-9]+)*$/i;
const PATH_PATTERN = /^\/[a-z0-9/_-]*$/i;
const PII_SHAPED_PATTERN = /\d{8,}/;
const EVENT_BODY_KEYS = new Set([
  "eventId",
  "sessionId",
  "experiment",
  "offerVariant",
  "eventType",
  "path",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "metadata",
]);

export type PublicEventEnvelope = {
  eventId: string;
  sessionId: string;
  experiment: string;
  offerVariant: string;
  eventType: string;
  path: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  metadata: unknown;
};

function boundedSlug(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (
    normalized.length < 1 ||
    normalized.length > maxLength ||
    !SLUG_PATTERN.test(normalized) ||
    PII_SHAPED_PATTERN.test(normalized)
  ) {
    return null;
  }
  return normalized;
}

function optionalSlug(
  value: unknown,
  maxLength: number,
): string | null | false {
  if (value === null || value === undefined || value === "") return null;
  return boundedSlug(value, maxLength) ?? false;
}

function optionalPath(value: unknown): string | null | false {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return false;
  const normalized = value.trim();
  return normalized.length <= 200 &&
    PATH_PATTERN.test(normalized) &&
    !PII_SHAPED_PATTERN.test(normalized)
    ? normalized
    : false;
}

export function parsePublicEventEnvelope(
  value: unknown,
): PublicEventEnvelope | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
    return null;
  }
  const body = value as Record<string, unknown>;
  if (Object.keys(body).some((key) => !EVENT_BODY_KEYS.has(key))) return null;

  const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";
  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  const experiment = boundedSlug(body.experiment, 40);
  const offerVariant = boundedSlug(body.offerVariant ?? "baseline", 80);
  const eventType = boundedSlug(body.eventType, 40);
  const path = optionalPath(body.path);
  const utmSource = optionalSlug(body.utmSource, 120);
  const utmMedium = optionalSlug(body.utmMedium, 120);
  const utmCampaign = optionalSlug(body.utmCampaign, 160);

  if (
    !UUID_V4_PATTERN.test(eventId) ||
    !UUID_V4_PATTERN.test(sessionId) ||
    !experiment ||
    !offerVariant ||
    !eventType ||
    path === false ||
    utmSource === false ||
    utmMedium === false ||
    utmCampaign === false
  ) {
    return null;
  }

  return {
    eventId,
    sessionId,
    experiment,
    offerVariant,
    eventType,
    path,
    utmSource,
    utmMedium,
    utmCampaign,
    metadata: body.metadata,
  };
}
