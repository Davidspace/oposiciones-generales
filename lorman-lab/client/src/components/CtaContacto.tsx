/**
 * Botón grande de contacto por WhatsApp con la marca LORMAN.
 * Va en la sección principal de cada superficie (no en la cabecera).
 */

export type CtaContactoProps = {
  /** Número en formato internacional sin signos: 34XXXXXXXXX */
  whatsapp: string;
  /** Mensaje inicial opcional para identificar la consulta en WhatsApp. */
  message?: string;
  label?: string;
  /** Ruta pública del logotipo dentro del proyecto. */
  logoSrc?: string;
  /** Texto pequeño bajo el botón. */
  note?: string;
  children?: ReactNode;
};

export function CtaContacto({
  whatsapp,
  message,
  label = "Contactar ahora",
  logoSrc = "/lorman-logo.png",
  note = "Respuesta por WhatsApp · sin compromiso",
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
          rel="noopener noreferrer"
          aria-label={`${label} por WhatsApp`}
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
