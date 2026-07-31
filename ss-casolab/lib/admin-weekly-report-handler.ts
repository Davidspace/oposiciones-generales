import type { WeeklyReportStore } from "../db/weekly-report.ts";
import {
  authenticateAdminBearer,
  readAdminOrderConfig,
} from "./admin-orders.ts";
import {
  FixedWindowRateLimiter,
  type RateLimitResult,
} from "./public-orders.ts";
import { buildWeeklyReport, parseUtcWeekStart } from "./weekly-report.ts";

const limiter = new FixedWindowRateLimiter(20, 60_000, 1);

type Dependencies = {
  env: Record<string, unknown>;
  store: WeeklyReportStore;
  now?: () => Date;
  rateLimit?: (
    scope: string,
    key: string,
    nowMs: number,
  ) => RateLimitResult;
};

function response(
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

export function createAdminWeeklyReportHandler(dependencies: Dependencies) {
  const now = dependencies.now ?? (() => new Date());
  const rateLimit =
    dependencies.rateLimit ??
    ((scope: string, key: string, nowMs: number) =>
      limiter.consume(`${scope}:${key}`, nowMs));

  return {
    async get(request: Request): Promise<Response> {
      const configured = readAdminOrderConfig(dependencies.env);
      if (!configured.ok) {
        return response(
          { ok: false, message: "El informe administrativo no está disponible." },
          503,
        );
      }
      const current = now();
      const limit = rateLimit("weekly-report", "global", current.getTime());
      if (!limit.allowed) {
        return response(
          { ok: false, message: "Demasiadas solicitudes de informe." },
          429,
          { "Retry-After": String(limit.retryAfterSeconds) },
        );
      }
      const actor = await authenticateAdminBearer(
        request.headers.get("authorization"),
        configured.config,
      );
      if (!actor) {
        return response(
          { ok: false, message: "Credenciales administrativas no válidas." },
          401,
          { "WWW-Authenticate": 'Bearer realm="ss-casolab-admin"' },
        );
      }

      const url = new URL(request.url);
      if (
        [...url.searchParams.keys()].some((key) => key !== "weekStart") ||
        url.searchParams.getAll("weekStart").length !== 1
      ) {
        return response(
          { ok: false, message: "La consulta del informe no es válida." },
          400,
        );
      }
      const period = parseUtcWeekStart(url.searchParams.get("weekStart"));
      if (!period || Date.parse(period.startAt) > current.getTime()) {
        return response(
          {
            ok: false,
            message: "weekStart debe ser un lunes válido en formato AAAA-MM-DD.",
          },
          400,
        );
      }

      try {
        const source = await dependencies.store.readWeek(period);
        const report = buildWeeklyReport(
          period,
          current.toISOString(),
          source,
        );
        return response(
          { ok: true, report },
          200,
          {
            "Content-Disposition": `attachment; filename="ss-casolab-${period.weekStart}.json"`,
          },
        );
      } catch {
        return response(
          { ok: false, message: "No se ha podido generar el informe." },
          500,
        );
      }
    },
  };
}
