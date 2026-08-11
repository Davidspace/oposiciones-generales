/**
 * Pie legal común a todas las superficies.
 * Incluye marca, enlaces de contacto e Instagram, además del aviso de independencia.
 */

import { EnlaceInstagram } from "./Instagram";
import { EnlaceWhatsApp } from "./WhatsApp";

export const AVISO_BASE =
  "Academia LORMAN es un proyecto educativo independiente. " +
  "La convocatoria vigente y sus bases siempre tienen prioridad. Ningún material garantiza un resultado. ";

export const AVISO_PRECIOS =
  "Precio final, impuestos, derecho de desistimiento, devolución y contenido disponible se muestran antes de cualquier pago.";

export const AVISO_SS =
  "SS CasoLab es un producto educativo independiente, sin relación con la Seguridad Social, el ministerio ni el tribunal. " +
  "La convocatoria vigente y sus bases siempre tienen prioridad. Ningún material garantiza un resultado. " +
  AVISO_PRECIOS;

export const AVISO_SALUD =
  "El material TCAE es independiente y no pertenece a ningún servicio de salud, tribunal ni organismo oficial. " +
  "La convocatoria vigente y sus bases siempre tienen prioridad. Ningún material garantiza un resultado. " +
  AVISO_PRECIOS;

export type AvisoComunProps = {
  links: { label: string; href: string }[];
  notice: string;
  logoSrc?: string;
};

export function AvisoComun({
  links,
  notice,
  logoSrc = "/lorman-logo.png",
}: AvisoComunProps) {
  return (
    <footer className="lm-footer">
      <div className="lm-footer-inner">
        <div>
          <img src={logoSrc} alt="Academia LORMAN" />
          <div className="lm-footer-links">
            {links
              .filter((link) => link.label.trim().toLowerCase() !== "whatsapp")
              .map((link) => (
              <a key={link.href + link.label} href={link.href}>
                {link.label}
              </a>
              ))}
            <EnlaceWhatsApp
              href={links.find((link) => link.label.trim().toLowerCase() === "whatsapp")?.href}
              size={19}
            />
            <EnlaceInstagram size={16} />
          </div>
        </div>
        <p className="lm-notice">{notice}</p>
      </div>
    </footer>
  );
}
