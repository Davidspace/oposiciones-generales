import { env } from "cloudflare:workers";

import { saveLead } from "@/db/leads";
import {
  ALLOWED_EXPERIMENTS,
  isExperimentId,
} from "@/lib/experiments";
import { readPublicRuntimeConfig } from "@/lib/public-runtime-config";

const ALLOWED_STAGES = new Set([
  "exploring",
  "starting",
  "studying",
  "practicing",
  "previous-exam",
]);

const ALLOWED_CHALLENGES = new Set([
  "structure",
  "knowledge",
  "time",
  "feedback",
  "starting",
]);

const ALLOWED_MODALITIES = new Set(["free", "internal", "undecided"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const E164_PATTERN = /^\+[1-9]\d{1,14}$/;
const PRIVACY_VERSION_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;

function textValue(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function nullableText(value: unknown, maxLength: number) {
  const text = textValue(value, maxLength);
  return text || null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { ok: false, message: "La solicitud no tiene un formato válido." },
      { status: 400 },
    );
  }

  if (textValue(body.company, 200)) {
    return Response.json({ ok: true }, { status: 201 });
  }

  const name = textValue(body.name, 80);
  const email = nullableText(body.email, 160)?.toLowerCase() ?? null;
  const experiment = textValue(body.experiment, 40) || "ss-casolab";
  const offerVariant = textValue(body.offerVariant, 80) || "baseline";
  const whatsapp = nullableText(body.whatsapp, 30);
  const modality = textValue(body.modality, 20);
  const stage = textValue(body.stage, 40);
  const challenge = textValue(body.challenge, 40);

  if (name.length < 2) {
    return Response.json(
      { ok: false, message: "Indica un nombre válido." },
      { status: 400 },
    );
  }

  if (
    !ALLOWED_EXPERIMENTS.has(experiment) ||
    !isExperimentId(experiment) ||
    !ALLOWED_MODALITIES.has(modality) ||
    !ALLOWED_STAGES.has(stage) ||
    !ALLOWED_CHALLENGES.has(challenge)
  ) {
    return Response.json(
      { ok: false, message: "Revisa las respuestas seleccionadas." },
      { status: 400 },
    );
  }

  const runtimeConfig = readPublicRuntimeConfig(
    env as unknown as Record<string, unknown>,
    experiment,
  );

  if (!runtimeConfig?.captureEnabled) {
    return Response.json(
      {
        ok: false,
        message:
          "La captación todavía no está activa. No hemos guardado ningún dato.",
      },
      { status: 503 },
    );
  }

  const isSsLead = experiment === "ss-casolab";
  const privacyVersion = textValue(
    (env as unknown as Record<string, unknown>).SS_CASOLAB_PRIVACY_VERSION,
    80,
  );

  if (isSsLead) {
    if (!whatsapp || !E164_PATTERN.test(whatsapp)) {
      return Response.json(
        {
          ok: false,
          message:
            "Indica tu WhatsApp en formato internacional, por ejemplo +34612345678.",
        },
        { status: 400 },
      );
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      return Response.json(
        { ok: false, message: "Revisa el email opcional o déjalo vacío." },
        { status: 400 },
      );
    }
    if (!PRIVACY_VERSION_PATTERN.test(privacyVersion)) {
      return Response.json(
        {
          ok: false,
          message:
            "La captación todavía no está configurada. No hemos guardado ningún dato.",
        },
        { status: 503 },
      );
    }
    if (body.whatsappConsent !== true) {
      return Response.json(
        {
          ok: false,
          message: "Necesitamos tu consentimiento explícito para escribirte por WhatsApp.",
        },
        { status: 400 },
      );
    }
  } else {
    if (!email || !EMAIL_PATTERN.test(email)) {
      return Response.json(
        { ok: false, message: "Indica un email válido." },
        { status: 400 },
      );
    }
    if (body.consent !== true) {
      return Response.json(
        { ok: false, message: "Necesitamos tu consentimiento para contactarte." },
        { status: 400 },
      );
    }
  }

  try {
    const sharedInput = {
      offerVariant,
      name,
      modality,
      stage,
      challenge,
      utmSource: nullableText(body.utmSource, 120),
      utmMedium: nullableText(body.utmMedium, 120),
      utmCampaign: nullableText(body.utmCampaign, 160),
      landingPath: nullableText(body.landingPath, 200),
      referrer: nullableText(body.referrer, 500),
    };

    await saveLead({
      ...sharedInput,
      experiment: "ss-casolab",
      email,
      whatsapp: whatsapp as string,
      captureContract: "ss-whatsapp-v1",
      privacyVersion,
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message:
          "No hemos podido guardar tu solicitud. Inténtalo de nuevo en unos minutos.",
      },
      { status: 500 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
