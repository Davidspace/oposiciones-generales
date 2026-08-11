/**
 * Pie legal común a todas las superficies.
 * Incluye marca, enlaces de contacto e Instagram, además del aviso de independencia.
 */

import { EnlaceInstagram } from "./Instagram";
import { EnlaceWhatsApp } from "./WhatsApp";

export const AVISO_BASE =
  "Academia LORMAN es una marca privada de preparación de oposiciones, sin vinculación con la Administración, el Ministerio, los tribunales calificadores ni los organismos convocantes. " +
  "Las bases y comunicaciones oficiales prevalecen. Ningún material garantiza la obtención de una plaza.";

export const AVISO_PRECIOS = "";

export const AVISO_SS = AVISO_BASE;

export const AVISO_SALUD = AVISO_BASE;

export const AVISO_JUSTICIA = AVISO_BASE;

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
