import type { PublicOrderStore } from "../db/orders.ts";
// The Node strip-types test runner requires an explicit extension. Vinext
// bundles it correctly; the project keeps no emitted TypeScript output.
import * as publicOrders from "./public-orders.ts";
import type { RateLimitResult } from "./public-orders.ts";

const {
  deriveLookupCredentials,
  effectivePublicStatus,
  fingerprintCreateOrder,
  fingerprintPaymentReport,
  FixedWindowRateLimiter,
  hashLookupToken,
  parseCreateOrderBody,
  parseIdempotencyKey,
  parseLookupAuthorization,
  parsePaymentReportBody,
  parsePublicReference,
  randomPublicReference,
  readPublicOrderConfig,
  toPublicOrderView,
} = publicOrders;

const MAX_BODY_BYTES = 16_384;
const perResourceLimiter = new FixedWindowRateLimiter(20, 60_000);
const globalLimiter = new FixedWindowRateLimiter(300, 60_000, 1);

export type PublicOrderHandlerDependencies = {
  env: Record<string, unknown>;
  store: PublicOrderStore;
  now?: () => Date;
  randomUUID?: () => string;
  referenceFactory?: () => string;
  rateLimit?: (scope: string, key: string, nowMs: number) => RateLimitResult;
};

function defaultRateLimit(
  scope: string,
  key: string,
  nowMs: number,
): RateLimitResult {
  const global = globalLimiter.consume("orders", nowMs);
  if (!global.allowed) return global;
  return perResourceLimiter.consume(`${scope}:${key}`, nowMs);
}

function json(
  body: Record<string, unknown>,
  status: number,
  headers?: HeadersInit,
): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

async function parseJsonBody(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; response: Response }> {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: json({ ok: false, message: "La solicitud es demasiado grande." }, 413),
    };
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return {
      ok: false,
      response: json({ ok: false, message: "No se ha podido leer la solicitud." }, 400),
    };
  }
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: json({ ok: false, message: "La solicitud es demasiado grande." }, 413),
    };
  }

  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return {
      ok: false,
      response: json({ ok: false, message: "La solicitud no tiene un formato válido." }, 400),
    };
  }
}

function unavailable() {
  return json(
    {
      ok: false,
      message: "Los pedidos no están disponibles en este momento.",
    },
    503,
  );
}

function tooManyRequests(retryAfterSeconds: number) {
  return json(
    {
      ok: false,
      message: "Has realizado demasiados intentos. Espera antes de repetir.",
    },
    429,
    { "Retry-After": String(retryAfterSeconds) },
  );
}

export function createPublicOrderHandlers(
  dependencies: PublicOrderHandlerDependencies,
) {
  const now = dependencies.now ?? (() => new Date());
  const randomUUID = dependencies.randomUUID ?? (() => crypto.randomUUID());
  const referenceFactory =
    dependencies.referenceFactory ?? (() => randomPublicReference());
  const rateLimit = dependencies.rateLimit ?? defaultRateLimit;

  return {
    async create(request: Request): Promise<Response> {
      const configured = readPublicOrderConfig(dependencies.env);
      if (!configured.ok) return unavailable();

      const idempotencyKey = parseIdempotencyKey(
        request.headers.get("Idempotency-Key"),
      );
      if (!idempotencyKey) {
        return json(
          { ok: false, message: "Falta una clave de idempotencia UUID válida." },
          400,
        );
      }

      const current = now();
      const limit = rateLimit("create", idempotencyKey, current.getTime());
      if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

      const parsedJson = await parseJsonBody(request);
      if (!parsedJson.ok) return parsedJson.response;
      const parsed = parseCreateOrderBody(parsedJson.value);
      if (parsed.kind === "honeypot") return json({ ok: true }, 201);
      if (parsed.kind === "invalid") {
        return json({ ok: false, message: parsed.message }, 400);
      }

      const acceptedAt = current.toISOString();
      const expiresAt = new Date(
        current.getTime() + configured.config.ttlHours * 60 * 60 * 1_000,
      ).toISOString();
      const credentials = await deriveLookupCredentials(
        idempotencyKey,
        configured.config.lookupHmacSecret,
      );
      const requestFingerprint = await fingerprintCreateOrder(
        parsed.input,
        configured.config,
      );

      try {
        const result = await dependencies.store.create({
          id: randomUUID(),
          reference: referenceFactory(),
          lookupTokenHash: credentials.tokenHash,
          createIdempotencyKey: idempotencyKey,
          requestFingerprint,
          productId: configured.config.productId,
          offerVersion: configured.config.offerVersion,
          amountCents: configured.config.amountCents,
          currency: configured.config.currency,
          name: parsed.input.name,
          email: parsed.input.email,
          sessionId: parsed.input.sessionId,
          termsVersion: configured.config.termsVersion,
          privacyVersion: configured.config.privacyVersion,
          acceptedAt,
          expiresAt,
        });

        if (result.kind === "idempotency_conflict") {
          return json(
            {
              ok: false,
              message:
                "La clave de idempotencia ya se usó con otra solicitud.",
            },
            409,
          );
        }

        return json(
          {
            ok: true,
            replayed: result.kind === "replayed",
            lookupToken: credentials.token,
            order: toPublicOrderView(result.order, configured.config, current),
          },
          result.kind === "created" ? 201 : 200,
        );
      } catch {
        return json(
          {
            ok: false,
            message: "No se ha podido crear el pedido. Inténtalo más tarde.",
          },
          503,
        );
      }
    },

    async status(request: Request): Promise<Response> {
      const configured = readPublicOrderConfig(dependencies.env);
      if (!configured.ok) return unavailable();

      const url = new URL(request.url);
      const reference = parsePublicReference(url.searchParams.get("reference"));
      const token = parseLookupAuthorization(
        request.headers.get("authorization"),
      );
      if (!reference || !token) {
        return json(
          { ok: false, message: "No se ha encontrado el pedido." },
          404,
        );
      }

      const current = now();
      const limit = rateLimit("status", reference, current.getTime());
      if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

      try {
        const tokenHash = await hashLookupToken(
          token,
          configured.config.lookupHmacSecret,
        );
        const order = await dependencies.store.findByCredentials(
          reference,
          tokenHash,
        );
        if (!order) {
          return json(
            { ok: false, message: "No se ha encontrado el pedido." },
            404,
          );
        }
        return json(
          {
            ok: true,
            order: toPublicOrderView(order, configured.config, current),
          },
          200,
        );
      } catch {
        return json(
          { ok: false, message: "No se ha podido consultar el pedido." },
          503,
        );
      }
    },

    async reportPayment(request: Request): Promise<Response> {
      const configured = readPublicOrderConfig(dependencies.env);
      if (!configured.ok) return unavailable();

      const idempotencyKey = parseIdempotencyKey(
        request.headers.get("Idempotency-Key"),
      );
      const token = parseLookupAuthorization(
        request.headers.get("authorization"),
      );
      if (!idempotencyKey || !token) {
        return json(
          { ok: false, message: "No se ha encontrado el pedido." },
          404,
        );
      }

      const parsedJson = await parseJsonBody(request);
      if (!parsedJson.ok) return parsedJson.response;
      const parsed = parsePaymentReportBody(parsedJson.value);
      if (parsed.kind === "honeypot") return json({ ok: true }, 200);
      if (parsed.kind === "invalid") {
        return json({ ok: false, message: parsed.message }, 400);
      }

      const current = now();
      const limit = rateLimit("report", parsed.reference, current.getTime());
      if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

      try {
        const tokenHash = await hashLookupToken(
          token,
          configured.config.lookupHmacSecret,
        );
        const order = await dependencies.store.findByCredentials(
          parsed.reference,
          tokenHash,
        );
        if (!order) {
          return json(
            { ok: false, message: "No se ha encontrado el pedido." },
            404,
          );
        }

        if (effectivePublicStatus(order, current) === "expired") {
          return json(
            {
              ok: false,
              message:
                "El pedido ha caducado. No se ha registrado ningún aviso de pago.",
            },
            409,
          );
        }

        const requestFingerprint = await fingerprintPaymentReport(
          order.id,
          configured.config,
        );
        const result = await dependencies.store.reportPayment({
          id: randomUUID(),
          orderId: order.id,
          idempotencyKey,
          requestFingerprint,
          createdAt: current.toISOString(),
        });

        if (result.kind === "idempotency_conflict") {
          return json(
            {
              ok: false,
              message:
                "La clave de idempotencia ya se usó con otro aviso.",
            },
            409,
          );
        }
        if (result.kind === "invalid_state" || !result.order) {
          return json(
            {
              ok: false,
              message:
                "El estado actual del pedido no permite registrar este aviso.",
            },
            409,
          );
        }

        return json(
          {
            ok: true,
            replayed: result.kind === "replayed",
            paymentVerified: false,
            order: toPublicOrderView(result.order, configured.config, current),
          },
          result.kind === "reported" ? 201 : 200,
        );
      } catch {
        return json(
          {
            ok: false,
            message: "No se ha podido registrar el aviso. Inténtalo más tarde.",
          },
          503,
        );
      }
    },
  };
}
