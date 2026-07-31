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
    "tai-academia": "TAI_ACADEMIA_CAPTURE_ENABLED",
  };

  const requestedCapture = enabled(env, captureKey[experiment]);

  return {
    analyticsEnabled: enabled(env, "TAI_ACADEMIA_ANALYTICS_ENABLED"),
    captureEnabled: requestedCapture,
    capturePrivacyUrl: httpsUrl(text(env, "TAI_ACADEMIA_PRIVACY_URL")),
    orderingEnabled: false,
  };
}

export function analyticsEnabled(env: Record<string, unknown>): boolean {
  return enabled(env, "TAI_ACADEMIA_ANALYTICS_ENABLED");
}
