// Node's strip-types test runner needs the extension; the bundler accepts it.
import { isExperimentId, type ExperimentId } from "./experiments.ts";
// Node's strip-types test runner needs the extension; the bundler accepts it.
import { readPublicOrderConfig } from "./public-orders.ts";

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
    "ss-casolab": "SS_CASOLAB_CAPTURE_ENABLED",
  };

  const requestedCapture = enabled(env, captureKey[experiment]);
  const ssPrivacyUrl = httpsUrl(text(env, "SS_CASOLAB_PRIVACY_URL"));
  const ssPrivacyVersion = text(env, "SS_CASOLAB_PRIVACY_VERSION");
  const ssCaptureReady =
    experiment !== "ss-casolab" ||
    (ssPrivacyUrl !== null &&
      /^[a-z0-9][a-z0-9-]{0,79}$/.test(ssPrivacyVersion));

  return {
    analyticsEnabled: enabled(env, "SS_CASOLAB_ANALYTICS_ENABLED"),
    captureEnabled: requestedCapture && ssCaptureReady,
    capturePrivacyUrl:
      experiment === "ss-casolab" && requestedCapture && ssCaptureReady
        ? ssPrivacyUrl
        : null,
    orderingEnabled:
      experiment === "ss-casolab" && readPublicOrderConfig(env).ok,
  };
}

export function analyticsEnabled(env: Record<string, unknown>): boolean {
  return enabled(env, "SS_CASOLAB_ANALYTICS_ENABLED");
}
