import { useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "../lib/analytics";

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
        <aside className="lm-consent" aria-label="Preferencias de analítica">
          <div>
            <strong>¿Nos ayudas a mejorar la prueba?</strong>
            <p>GA4 y Clarity nos dicen qué páginas y botones funcionan. No usamos estos datos para identificarte y la prueba funciona igual si rechazas.</p>
          </div>
          <div className="lm-consent-actions">
            <button type="button" className="lm-consent-reject" onClick={() => choose("denied")}>Solo lo necesario</button>
            <button type="button" className="lm-consent-accept" onClick={() => choose("granted")}>Aceptar analítica</button>
          </div>
        </aside>
      ) : null}
      <button type="button" className="lm-consent-manage" onClick={() => setOpen(true)} aria-label={`Cambiar preferencia de analítica. Estado actual: ${choice === "granted" ? "aceptada" : choice === "denied" ? "rechazada" : "sin decidir"}.`}>
        Analítica
      </button>
    </>
  );
}
