import { env } from "cloudflare:workers";

import {
  readPublicOrderConfig,
  toPublicCommercialDisclosures,
} from "@/lib/public-orders";

export async function GET() {
  const configured = readPublicOrderConfig(
    env as unknown as Record<string, unknown>,
  );
  if (!configured.ok) {
    return Response.json(
      {
        ok: false,
        message: "La oferta todavía no está abierta a contratación.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  return Response.json(
    { ok: true, offer: toPublicCommercialDisclosures(configured.config) },
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
