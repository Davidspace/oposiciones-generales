const DEFAULT_PORTFOLIO_URL = "https://lorman-academia.vercel.app";

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
