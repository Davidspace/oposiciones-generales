import { env } from "cloudflare:workers";

import { FunnelRateLimitError, saveFunnelEvent } from "@/db/events";
import {
  ALLOWED_EXPERIMENTS,
  ALLOWED_FUNNEL_EVENTS,
  isExperimentId,
  isFunnelEventType,
  sanitizeFunnelMetadata,
} from "@/lib/experiments";
import { parsePublicEventEnvelope } from "@/lib/public-event-input";
import { analyticsEnabled } from "@/lib/public-runtime-config";

export async function POST(request: Request) {
  if (!analyticsEnabled(env as unknown as Record<string, unknown>)) {
    return Response.json(
      { ok: false, message: "La analítica no está activa." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: "La solicitud no tiene un formato válido." },
      { status: 400 },
    );
  }

  const envelope = parsePublicEventEnvelope(body);

  if (
    !envelope ||
    !ALLOWED_EXPERIMENTS.has(envelope.experiment) ||
    !isExperimentId(envelope.experiment) ||
    !ALLOWED_FUNNEL_EVENTS.has(envelope.eventType) ||
    !isFunnelEventType(envelope.eventType)
  ) {
    return Response.json(
      { ok: false, message: "El evento no es válido." },
      { status: 400 },
    );
  }

  const metadata = sanitizeFunnelMetadata(
    envelope.eventType,
    envelope.metadata,
  );
  if (metadata === null) {
    return Response.json(
      { ok: false, message: "Los metadatos del evento no son válidos." },
      { status: 400 },
    );
  }

  try {
    await saveFunnelEvent({
      eventId: envelope.eventId,
      sessionId: envelope.sessionId,
      experiment: envelope.experiment,
      offerVariant: envelope.offerVariant,
      eventType: envelope.eventType,
      path: envelope.path,
      utmSource: envelope.utmSource,
      utmMedium: envelope.utmMedium,
      utmCampaign: envelope.utmCampaign,
      metadata,
    });
  } catch (error) {
    if (error instanceof FunnelRateLimitError) {
      return Response.json(
        { ok: false, message: "Has enviado demasiados eventos seguidos." },
        { status: 429 },
      );
    }
    return Response.json(
      { ok: false, message: "No hemos podido registrar el evento." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
