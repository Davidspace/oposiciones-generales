/**
 * Minimal runtime adapter for Vercel/Nitro builds.
 *
 * Sites injects Cloudflare bindings through `cloudflare:workers`. Vercel has
 * no D1 binding, so public runtime flags can still come from its environment
 * while database-backed routes fail closed.
 */
export const env: Record<string, unknown> = {
  ...process.env,
  DB: undefined,
};
