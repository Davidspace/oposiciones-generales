import { env } from "cloudflare:workers";

import { createD1AdminOrderStore } from "@/db/admin-orders";
import type { D1DatabaseLike } from "@/db/orders";
import { createAdminOrderHandlers } from "@/lib/admin-order-handlers";

function unavailable() {
  return Response.json(
    {
      ok: false,
      message: "La operación administrativa no está disponible.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const bindings = env as unknown as Record<string, unknown> & {
    DB?: D1DatabaseLike;
  };
  if (!bindings.DB) return unavailable();
  return createAdminOrderHandlers({
    env: bindings,
    store: createD1AdminOrderStore(bindings.DB),
  }).verifyPayment(request);
}
