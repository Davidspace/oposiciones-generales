import { env } from "cloudflare:workers";

import { createD1WeeklyReportStore } from "@/db/weekly-report";
import type { D1DatabaseLike } from "@/db/orders";
import { createAdminWeeklyReportHandler } from "@/lib/admin-weekly-report-handler";

export async function GET(request: Request) {
  const bindings = env as unknown as Record<string, unknown> & {
    DB?: D1DatabaseLike;
  };
  if (!bindings.DB) {
    return Response.json(
      { ok: false, message: "El informe administrativo no está disponible." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  return createAdminWeeklyReportHandler({
    env: bindings,
    store: createD1WeeklyReportStore(bindings.DB),
  }).get(request);
}
