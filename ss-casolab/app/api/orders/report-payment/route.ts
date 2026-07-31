import { env } from "cloudflare:workers";

import {
  createD1PublicOrderStore,
  type D1DatabaseLike,
} from "@/db/orders";
import { createPublicOrderHandlers } from "@/lib/public-order-handlers";
import { authorizeOrderRequestFromCookie } from "@/lib/order-session-cookie";

function unavailable() {
  return Response.json(
    {
      ok: false,
      message: "Los pedidos no están disponibles en este momento.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const bindings = env as unknown as Record<string, unknown> & {
    DB?: D1DatabaseLike;
  };
  if (!bindings.DB) return unavailable();
  return createPublicOrderHandlers({
    env: bindings,
    store: createD1PublicOrderStore(bindings.DB),
  }).reportPayment(authorizeOrderRequestFromCookie(request));
}
