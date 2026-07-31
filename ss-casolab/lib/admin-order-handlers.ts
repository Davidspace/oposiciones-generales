import type { AdminOrderStore } from "../db/admin-orders.ts";
import {
  authenticateAdminBearer,
  fingerprintAdminPayment,
  hmacProviderReference,
  parseAdminPaymentInput,
  readAdminOrderConfig,
} from "./admin-orders.ts";
import {
  FixedWindowRateLimiter,
  parseIdempotencyKey,
  type RateLimitResult,
} from "./public-orders.ts";

const MAX_BODY_BYTES = 8_192;
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1_000;
const limiter = new FixedWindowRateLimiter(20, 60_000, 1);

export type AdminOrderHandlerDependencies = {
  env: Record<string, unknown>;
  store: AdminOrderStore;
  now?: () => Date;
  randomUUID?: () => string;
  rateLimit?: (
    scope: string,
    key: string,
    nowMs: number,
  ) => RateLimitResult;
};

function defaultRateLimit(
  scope: string,
  key: string,
  nowMs: number,
): RateLimitResult {
  return limiter.consume(`${scope}:${key}`, nowMs);
}

function json(
  body: Record<string, unknown>,
  status: number,
  headers?: HeadersInit,
) {
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
      response: json({ ok: false, message: "La solicitud no contiene JSON válido." }, 400),
    };
  }
}

export function createAdminOrderHandlers(
  dependencies: AdminOrderHandlerDependencies,
) {
  const now = dependencies.now ?? (() => new Date());
  const randomUUID = dependencies.randomUUID ?? (() => crypto.randomUUID());
  const rateLimit = dependencies.rateLimit ?? defaultRateLimit;

  return {
    async verifyPayment(request: Request): Promise<Response> {
      const configured = readAdminOrderConfig(dependencies.env);
      if (!configured.ok) {
        return json(
          { ok: false, message: "La operación administrativa no está disponible." },
          503,
        );
      }

      const current = now();
      const limit = rateLimit(
        "verify-payment",
        "global",
        current.getTime(),
      );
      if (!limit.allowed) {
        return json(
          { ok: false, message: "Demasiados intentos administrativos." },
          429,
          { "Retry-After": String(limit.retryAfterSeconds) },
        );
      }

      const actor = await authenticateAdminBearer(
        request.headers.get("authorization"),
        configured.config,
      );
      if (!actor) {
        return json(
          { ok: false, message: "Credenciales administrativas no válidas." },
          401,
          { "WWW-Authenticate": 'Bearer realm="ss-casolab-admin"' },
        );
      }

      const idempotencyKey = parseIdempotencyKey(
        request.headers.get("Idempotency-Key"),
      );
      if (!idempotencyKey) {
        return json(
          { ok: false, message: "Falta una clave de idempotencia UUID válida." },
          400,
        );
      }

      const parsedBody = await parseJsonBody(request);
      if (!parsedBody.ok) return parsedBody.response;
      const parsed = parseAdminPaymentInput(parsedBody.value);
      if (parsed.kind === "invalid") {
        return json({ ok: false, message: parsed.message }, 400);
      }
      if (
        Date.parse(parsed.input.observedAt) >
        current.getTime() + MAX_FUTURE_SKEW_MS
      ) {
        return json(
          { ok: false, message: "La fecha observada está en el futuro." },
          400,
        );
      }

      const providerReferenceHmac = parsed.input.providerTransactionId
        ? await hmacProviderReference(
            parsed.input.providerTransactionId,
            configured.config.paymentReferenceHmacSecret,
          )
        : null;
      const requestFingerprint = await fingerprintAdminPayment(
        parsed.input,
        providerReferenceHmac,
      );

      try {
        const result = await dependencies.store.verifyPayment({
          verificationId: randomUUID(),
          eventId: randomUUID(),
          reference: parsed.input.reference,
          expectedStatus: parsed.input.expectedStatus,
          decision: parsed.input.decision,
          targetStatus:
            parsed.input.decision === "matched" ? "paid" : "needs_review",
          observedAmountCents: parsed.input.observedAmountCents,
          observedAt: parsed.input.observedAt,
          providerReferenceHmac,
          providerReferenceHmacVersion: providerReferenceHmac
            ? configured.config.paymentReferenceHmacVersion
            : null,
          reasonCode: parsed.input.reasonCode,
          actor,
          idempotencyKey,
          requestFingerprint,
          verifiedAt: current.toISOString(),
        });

        if (result.kind === "verified" || result.kind === "replayed") {
          return json(
            {
              ok: true,
              replayed: result.kind === "replayed",
              paymentVerified:
                result.verificationResult === "matched" &&
                result.order.status === "paid",
              accessProvisioned: false,
              verificationResult: result.verificationResult,
              order: result.order,
              nextAction:
                result.order.status === "paid"
                  ? "Aprovisionar el acceso mediante el flujo separado."
                  : "Resolver la incidencia antes de conceder acceso.",
            },
            200,
          );
        }
        if (result.kind === "not_found") {
          return json({ ok: false, message: "No se ha encontrado el pedido." }, 404);
        }
        if (result.kind === "invalid_state") {
          return json(
            {
              ok: false,
              message: "El estado esperado ya no coincide con el pedido.",
              currentStatus: result.currentStatus,
            },
            409,
          );
        }
        if (result.kind === "amount_mismatch") {
          return json(
            {
              ok: false,
              message:
                "El importe no coincide. Registra una decisión needs_review.",
            },
            409,
          );
        }
        if (result.kind === "late_payment_requires_review") {
          return json(
            {
              ok: false,
              message:
                "El pedido había caducado. Registra una decisión needs_review.",
            },
            409,
          );
        }
        if (result.kind === "provider_reference_conflict") {
          return json(
            {
              ok: false,
              message:
                "La operación bancaria ya está asociada a otra conciliación.",
            },
            409,
          );
        }
        return json(
          {
            ok: false,
            message: "La clave de idempotencia ya se usó con otra operación.",
          },
          409,
        );
      } catch {
        return json(
          { ok: false, message: "No se ha podido conciliar el pedido." },
          503,
        );
      }
    },
  };
}
