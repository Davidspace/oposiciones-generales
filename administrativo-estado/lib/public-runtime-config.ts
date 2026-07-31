// Node's strip-types test runner needs the extension; the bundler accepts it.
import { isExperimentId, type ExperimentId } from "./experiments.ts";

export type PublicRuntimeConfig = {
  analyticsEnabled: boolean;
  captureEnabled: boolean;
  capturePrivacyUrl: string | null;
  orderingEnabled: boolean;
};

function enabled(env: Record<string, unknown>, key: string): boolean {
  const value = env[key];
  return typeof value === "string" && value.trim().toLowerCase() === "true";
}

function text(env: Record<string, unknown>, key: string): string {
  const value = env[key];
  return typeof value === "string" ? value.trim() : "";
}

function httpsUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function readPublicRuntimeConfig(
  env: Record<string, unknown>,
  experiment: string,
): PublicRuntimeConfig | null {
  if (!isExperimentId(experiment)) return null;

  const captureKey: Record<ExperimentId, string> = {
    "administrativo-estado-c2": "ADMINISTRATIVO_ESTADO_C2_CAPTURE_ENABLED",
  };

  const requestedCapture = enabled(env, captureKey[experiment]);
  const privacyUrl = httpsUrl(text(env, "ADMINISTRATIVO_ESTADO_C2_PRIVACY_URL"));

  return {
    analyticsEnabled: enabled(env, "ADMINISTRATIVO_ESTADO_C2_ANALYTICS_ENABLED"),
    captureEnabled: requestedCapture,
    capturePrivacyUrl: requestedCapture ? privacyUrl : null,
    orderingEnabled: false,
  };
}

export function analyticsEnabled(env: Record<string, unknown>): boolean {
  return enabled(env, "ADMINISTRATIVO_ESTADO_C2_ANALYTICS_ENABLED");
}
