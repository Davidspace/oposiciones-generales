import { captureAttribution, getAttribution } from "@/lib/attribution";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsConsent = "granted" | "denied";

const CONSENT_KEY = "lorman_analytics_consent_v1";
const GA_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() || "G-ZD1KT7K2JM";
let loaded = false;

function bootstrapGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    // Google Tag reads the Arguments object as its command queue format.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
}

function setDefaultConsent() {
  bootstrapGtag();
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  window.localStorage.setItem(CONSENT_KEY, consent);
  bootstrapGtag();
  window.gtag?.("consent", "update", {
    analytics_storage: consent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  if (consent === "granted") {
    captureAttribution();
    loadAnalytics();
  }
}

export function loadAnalytics() {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  bootstrapGtag();
  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_ID, {
    send_page_view: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  if (!document.getElementById("lorman-ga4")) {
    const script = document.createElement("script");
    script.id = "lorman-ga4";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);
  }
}

export function initialiseAnalytics() {
  if (typeof window === "undefined") return;
  setDefaultConsent();
  if (getAnalyticsConsent() === "granted") {
    setAnalyticsConsent("granted");
  }
}

export function trackEvent(name: string, parameters: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || getAnalyticsConsent() !== "granted") return;
  const safeParameters = Object.fromEntries(
    Object.entries({ course: "tai_c1", ...getAttribution(), ...parameters })
      .filter(([, value]) => value !== "" && value !== undefined),
  );
  window.gtag?.("event", name, safeParameters);
}
