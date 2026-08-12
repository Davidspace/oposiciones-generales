import { useState } from "react";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics";

export function ConsentBanner() {
  const [choice, setChoice] = useState<AnalyticsConsent | null>(() => getAnalyticsConsent());
  const [open, setOpen] = useState(() => getAnalyticsConsent() === null);

  const choose = (next: AnalyticsConsent) => {
    setAnalyticsConsent(next);
    setChoice(next);
    setOpen(false);
  };

  return (
    <>
      {open ? (
        <aside className="lm-analytics-consent" aria-label="Preferencias de analítica">
          <div>
            <strong>¿Nos ayudas a mejorar?</strong>
            <p>
              GA4 nos ayuda a saber qué páginas y botones resultan útiles. No usamos esta analítica para identificarte y la web funciona igual si la rechazas.
            </p>
          </div>
          <div className="lm-analytics-consent-actions">
            <button type="button" className="lm-analytics-consent-reject" onClick={() => choose("denied")}>
              Solo lo necesario
            </button>
            <button type="button" className="lm-analytics-consent-accept" onClick={() => choose("granted")}>
              Aceptar analítica
            </button>
          </div>
        </aside>
      ) : null}
      <button
        type="button"
        className="lm-analytics-consent-manage"
        onClick={() => setOpen(true)}
        aria-label={`Cambiar preferencia de analítica. Estado actual: ${choice === "granted" ? "aceptada" : choice === "denied" ? "rechazada" : "sin decidir"}.`}
      >
        Analítica
      </button>
    </>
  );
}
