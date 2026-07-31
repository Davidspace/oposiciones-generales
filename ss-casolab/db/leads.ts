import { env } from "cloudflare:workers";

type LeadBase = {
  offerVariant: string;
  name: string;
  modality: string;
  stage: string;
  challenge: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  landingPath: string | null;
  referrer: string | null;
};

export type LeadInput = LeadBase &
  (
    | {
        experiment: "gsi-caso-0";
        email: string;
        whatsapp: null;
        captureContract: "gsi-email-v1";
        privacyVersion: null;
      }
    | {
        experiment: "ss-casolab";
        email: string | null;
        whatsapp: string;
        captureContract: "ss-whatsapp-v1";
        privacyVersion: string;
      }
  );

export async function saveLead(input: LeadInput) {
  const d1 = env.DB;
  if (!d1) {
    throw new Error("El almacenamiento de solicitudes no está disponible.");
  }

  const now = new Date().toISOString();
  const contactKey =
    input.captureContract === "ss-whatsapp-v1"
      ? `whatsapp:${input.whatsapp}`
      : `email:${input.email.trim().toLowerCase()}`;
  const whatsappConsentAt =
    input.captureContract === "ss-whatsapp-v1" ? now : null;

  await d1
    .prepare(
      `INSERT INTO leads (
        id, experiment, offer_variant, name, email, whatsapp, contact_key,
        capture_contract, modality, stage, challenge, utm_source, utm_medium,
        utm_campaign, landing_path, referrer, consent_at, whatsapp_consent_at,
        privacy_version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(contact_key, experiment) DO UPDATE SET
        offer_variant = excluded.offer_variant,
        name = excluded.name,
        email = excluded.email,
        whatsapp = excluded.whatsapp,
        modality = excluded.modality,
        stage = excluded.stage,
        challenge = excluded.challenge,
        utm_source = excluded.utm_source,
        utm_medium = excluded.utm_medium,
        utm_campaign = excluded.utm_campaign,
        landing_path = excluded.landing_path,
        referrer = excluded.referrer,
        consent_at = excluded.consent_at,
        whatsapp_consent_at = excluded.whatsapp_consent_at,
        privacy_version = excluded.privacy_version,
        updated_at = excluded.updated_at`,
    )
    .bind(
      crypto.randomUUID(),
      input.experiment,
      input.offerVariant,
      input.name,
      input.email,
      input.whatsapp,
      contactKey,
      input.captureContract,
      input.modality,
      input.stage,
      input.challenge,
      input.utmSource,
      input.utmMedium,
      input.utmCampaign,
      input.landingPath,
      input.referrer,
      now,
      whatsappConsentAt,
      input.privacyVersion,
      now,
      now,
    )
    .run();
}
