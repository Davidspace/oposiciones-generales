"use client";

/**
 * Botón grande de contacto por WhatsApp con la marca LORMAN.
 * Va en la sección principal de cada superficie (no en la cabecera).
 */

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export type CtaContactoProps = {
  /** Número en formato internacional sin signos: 34XXXXXXXXX */
  whatsapp: string;
  label?: string;
  /** Ruta pública del logotipo dentro del proyecto. */
  logoSrc?: string;
  /** Texto pequeño bajo el botón. */
  note?: string;
  message?: string;
  children?: ReactNode;
};

export function CtaContacto({
  whatsapp,
  label = "Solicitar información",
  logoSrc = "/lorman-logo.png",
  note = "Te respondemos por WhatsApp. Sin compromiso.",
  message,
  children,
}: CtaContactoProps) {
  const whatsappHref = message
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${whatsapp}`;

  return (
    <>
      <div className="lm-actions">
        <a
          className="lm-btn lm-btn-primary"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("whatsapp_click", { placement: "hero" })}
        >
          <img className="lm-btn-mark" src={logoSrc} alt="" />
          <span>{label}</span>
        </a>
        {children}
      </div>
      {note ? <p className="lm-btn-note">{note}</p> : null}
    </>
  );
}
