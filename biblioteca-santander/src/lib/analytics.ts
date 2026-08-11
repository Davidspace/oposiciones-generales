import { getAttribution } from "./attribution";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export type AnalyticsConsent = "granted" | "denied";

const CONSENT_KEY = "lorman_analytics_consent_v1";
const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID?.trim();
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim();
let loaded = false;

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  window.localStorage.setItem(CONSENT_KEY, consent);
  window.gtag?.("consent", "update", {
    analytics_storage: consent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: consent,
  });
  if (consent === "granted") loadAnalytics();
}

function appendScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function loadAnalytics() {
  if (loaded || typeof document === "undefined") return;
  loaded = true;

  if (GA_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (..._args: unknown[]) {
      window.dataLayer?.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      send_page_view: true,
      allow_google_signals: false,
    });
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`, "lorman-ga4");
  }

  if (CLARITY_ID) {
    window.clarity = window.clarity || function (...args: unknown[]) {
      (window.clarity as unknown as { q?: unknown[] }).q = (window.clarity as unknown as { q?: unknown[] }).q || [];
      (window.clarity as unknown as { q: unknown[] }).q.push(args);
    };
    appendScript(`https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_ID)}`, "lorman-clarity");
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
  }
}

export function initialiseAnalytics() {
  if (getAnalyticsConsent() === "granted") loadAnalytics();
}

export function trackEvent(name: string, parameters: Record<string, string | number | boolean> = {}) {
  if (getAnalyticsConsent() !== "granted") return;
  const attribution = getAttribution();
  const safeParameters = Object.fromEntries(
    Object.entries({ ...attribution, ...parameters }).filter(([, value]) => value !== "" && value !== undefined),
  );
  window.gtag?.("event", name, safeParameters);
  window.clarity?.("event", name);
}
