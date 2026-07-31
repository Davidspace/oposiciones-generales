import { env } from "cloudflare:workers";
import type {
  ExperimentId,
  FunnelEventType,
} from "@/lib/experiments";

export type FunnelEventInput = {
  eventId: string;
  sessionId: string;
  experiment: ExperimentId;
  offerVariant: string;
  eventType: FunnelEventType;
  path: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  metadata: Record<string, string | number | boolean | null>;
};

const createFunnelEventsTable = `
  CREATE TABLE IF NOT EXISTS funnel_events (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    experiment TEXT NOT NULL,
    offer_variant TEXT NOT NULL DEFAULT 'baseline',
    event_type TEXT NOT NULL,
    path TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    metadata_json TEXT,
    created_at TEXT NOT NULL
  )
`;

const createExperimentEventIndex =
  "CREATE INDEX IF NOT EXISTS funnel_events_experiment_type_created_idx ON funnel_events (experiment, event_type, created_at)";

export class FunnelRateLimitError extends Error {
  constructor() {
    super("Límite temporal de eventos alcanzado.");
    this.name = "FunnelRateLimitError";
  }
}

export async function saveFunnelEvent(input: FunnelEventInput) {
  const d1 = env.DB;
  if (!d1) {
    throw new Error("El almacenamiento de eventos no está disponible.");
  }

  await d1.batch([
    d1.prepare(createFunnelEventsTable),
    d1.prepare(createExperimentEventIndex),
  ]);

  const now = new Date();
  const recentBoundary = new Date(now.getTime() - 60_000).toISOString();
  const recent = await d1
    .prepare(
      `SELECT COUNT(*) AS total
       FROM funnel_events
       WHERE session_id = ? AND created_at >= ?`,
    )
    .bind(input.sessionId, recentBoundary)
    .first<{ total: number }>();
  if ((recent?.total ?? 0) >= 60) {
    throw new FunnelRateLimitError();
  }

  await d1
    .prepare(
      `INSERT INTO funnel_events (
        id, session_id, experiment, offer_variant, event_type, path,
        utm_source, utm_medium, utm_campaign, metadata_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO NOTHING`,
    )
    .bind(
      input.eventId,
      input.sessionId,
      input.experiment,
      input.offerVariant,
      input.eventType,
      input.path,
      input.utmSource,
      input.utmMedium,
      input.utmCampaign,
      Object.keys(input.metadata).length
        ? JSON.stringify(input.metadata)
        : null,
      now.toISOString(),
    )
    .run();
}
