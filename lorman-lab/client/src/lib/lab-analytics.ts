type LabMetadata = Record<string, string | number | boolean>;

const EVENTS_KEY = "lorman-lab-events";
const SESSION_KEY = "lorman-lab-anonymous-session";

function anonymousSession() {
  const current = window.localStorage.getItem(SESSION_KEY);
  if (current) return current;
  const created = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `local-${Date.now()}`;
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

export function trackLabEvent(event: string, product?: string, metadata?: LabMetadata) {
  if (typeof window === "undefined") return;
  try {
    const current = JSON.parse(window.localStorage.getItem(EVENTS_KEY) ?? "[]") as unknown[];
    window.localStorage.setItem(EVENTS_KEY, JSON.stringify([...current, {
      event,
      product: product ?? null,
      sessionId: anonymousSession(),
      path: window.location.pathname,
      at: new Date().toISOString(),
      metadata: metadata ?? {},
    }].slice(-200)));
  } catch {
    // Analytics must never block navigation or study.
  }
}
