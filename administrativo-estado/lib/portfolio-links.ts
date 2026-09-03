const DEFAULT_PORTFOLIO_URL = "https://academialorman.es";
const DEFAULT_MOODLE_URL = "https://aula.academialorman.es";

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

export const PORTFOLIO_URL = publicUrl(
  process.env.NEXT_PUBLIC_PORTFOLIO_URL,
  DEFAULT_PORTFOLIO_URL,
);

export const MOODLE_URL = publicUrl(
  process.env.NEXT_PUBLIC_MOODLE_URL,
  DEFAULT_MOODLE_URL,
);
