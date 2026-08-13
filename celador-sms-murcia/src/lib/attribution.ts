export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORAGE_KEY = "lorman_celador_sms_attribution_v1";

function clean(value: string | null) {
  return value?.trim().slice(0, 120) || undefined;
}

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const query = new URLSearchParams(window.location.search);
  const incoming = Object.fromEntries(
    ATTRIBUTION_KEYS.flatMap((key) => {
      const value = clean(query.get(key));
      return value ? [[key, value]] : [];
    }),
  ) as Attribution;

  let stored: Attribution = {};
  try {
    stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}") as Attribution;
  } catch {
    stored = {};
  }

  const attribution = { ...stored, ...incoming };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}

export function campaignReference(attribution = getAttribution()) {
  const source = attribution.utm_source;
  const campaign = attribution.utm_campaign;
  const content = attribution.utm_content;
  return [source, campaign, content].filter(Boolean).join(" / ").slice(0, 180);
}

export function withCampaignReference(message: string) {
  const reference = campaignReference();
  return reference ? `${message}\n\nReferencia: ${reference}` : message;
}
