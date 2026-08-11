"use client";

/**
 * Cajones de contenido de una landing específica.
 * Cuatro piezas: Temario, Test, Simulacros y Precio/Acceso.
 * El contenido va en grande; las cifras, en pequeño al pie del cajón.
 * El último cajón es sólido y cierra con una solicitud de información.
 */

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export type CajonProps = {
  kicker: string;
  title: string;
  text: string;
  /** Cifra o detalle secundario, al pie. */
  figure?: string;
};

export type CajonCierreProps = {
  kicker: string;
  title: string;
  text: string;
  /** Enlace de WhatsApp del producto. */
  href: string;
  /** Etiqueta común en todas las landings. */
  label?: string;
};

export function Cajon({ kicker, title, text, figure }: CajonProps) {
  return (
    <div className="lm-box">
      <span className="lm-box-kicker">{kicker}</span>
      <strong className="lm-box-title">{title}</strong>
      <p>{text}</p>
      {figure ? <span className="lm-box-figure">{figure}</span> : null}
    </div>
  );
}

export function CajonCierre({
  kicker,
  title,
  text,
  href,
  label = "Solicitar información",
}: CajonCierreProps) {
  return (
    <div className="lm-box lm-box-solid">
      <span className="lm-box-kicker">{kicker}</span>
      <strong className="lm-box-title">{title}</strong>
      <p>{text}</p>
      <a className="lm-box-cta" href={href} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { placement: "price_box" })}>
        {label}
      </a>
    </div>
  );
}

export function Cajones({ children }: { children: ReactNode }) {
  return <div className="lm-boxes">{children}</div>;
}
