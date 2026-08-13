const DEFAULT_PORTFOLIO_URL = "https://academialorman.es";
const DEFAULT_MOODLE_URL = "https://aula.academialorman.es";
const DEFAULT_TCAE_URL = "https://tcae.academialorman.es";
const DEFAULT_TAI_URL = "https://tai.academialorman.es";
const DEFAULT_SS_URL = "https://ss.academialorman.es";
const DEFAULT_AUX_JURIDICO_URL = "https://auxiliojudicial.academialorman.es";
const DEFAULT_CELADOR_SMS_URL = "https://celadorsms.academialorman.es";
const DEFAULT_CORDOBA_URL = "/auxiliar-administrativo-cordoba";

function publicUrl(value: string | undefined, fallback: string) {
  const candidate = value?.trim();
  if (!candidate) return fallback;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return fallback;
    return url.toString().replace(/\/+$/u, "");
  } catch {
    return fallback;
  }
}

function destination(value: string | undefined, fallback: string) {
  const candidate = value?.trim();
  if (!candidate) return fallback;
  if (candidate.startsWith("/") && !candidate.startsWith("//")) return candidate;
  return publicUrl(candidate, fallback);
}

export const PORTFOLIO_URL = publicUrl(
  import.meta.env.VITE_PORTFOLIO_URL,
  DEFAULT_PORTFOLIO_URL,
);

export const MOODLE_URL = publicUrl(
  import.meta.env.VITE_MOODLE_URL,
  DEFAULT_MOODLE_URL,
);

export const PRODUCT_URLS = {
  tcae: destination(import.meta.env.VITE_TCAE_URL, DEFAULT_TCAE_URL),
  tai: destination(import.meta.env.VITE_TAI_URL, DEFAULT_TAI_URL),
  ss: destination(import.meta.env.VITE_SS_URL, DEFAULT_SS_URL),
  auxJuridico: destination(import.meta.env.VITE_AUX_JURIDICO_URL, DEFAULT_AUX_JURIDICO_URL),
  celadorSms: destination(import.meta.env.VITE_CELADOR_SMS_URL, DEFAULT_CELADOR_SMS_URL),
  cordoba: destination(import.meta.env.VITE_CORDOBA_URL, DEFAULT_CORDOBA_URL),
} as const;
