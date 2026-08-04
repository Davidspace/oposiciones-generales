/**
 * Botón grande de contacto por WhatsApp con la marca LORMAN.
 * Va en la sección principal de cada superficie (no en la cabecera).
 */

export type CtaContactoProps = {
  /** Número en formato internacional sin signos: 34XXXXXXXXX */
  whatsapp: string;
  label?: string;
  /** Ruta pública del logotipo dentro del proyecto. */
  logoSrc?: string;
  /** Texto pequeño bajo el botón. */
  note?: string;
  children?: ReactNode;
};

export function CtaContacto({
  whatsapp,
  label = "Contactar ahora",
  logoSrc = "/lorman-logo.png",
  note = "Respuesta por WhatsApp · sin compromiso",
  children,
}: CtaContactoProps) {
  return (
    <>
      <div className="lm-actions">
        <a
          className="lm-btn lm-btn-primary"
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
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
import type { ReactNode } from "react";
