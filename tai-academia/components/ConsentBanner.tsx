"use client";

import { useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/lib/analytics";

export function ConsentBanner() {
  const [choice, setChoice] = useState<AnalyticsConsent | null>(() => getAnalyticsConsent());
  const [open, setOpen] = useState(() => getAnalyticsConsent() === null);

  function choose(next: AnalyticsConsent) {
    setAnalyticsConsent(next);
    setChoice(next);
    setOpen(false);
  }

  return (
    <>
      {open ? (
        <aside className="tai-consent" aria-label="Preferencias de analítica">
          <div>
            <strong>Analítica opcional</strong>
            <p>GA4 nos ayuda a saber qué partes funcionan. No enviamos tus respuestas ni datos personales.</p>
          </div>
          <div className="tai-consent-actions">
            <button type="button" className="tai-consent-reject" onClick={() => choose("denied")}>Solo lo necesario</button>
            <button type="button" className="tai-consent-accept" onClick={() => choose("granted")}>Aceptar analítica</button>
          </div>
        </aside>
      ) : null}
      {!open ? (
        <button
          type="button"
          className="tai-consent-manage"
          onClick={() => setOpen(true)}
          aria-label={`Cambiar preferencia de analítica. Estado: ${choice === "granted" ? "aceptada" : "rechazada"}.`}
        >
          Analítica
        </button>
      ) : null}
    </>
  );
}
