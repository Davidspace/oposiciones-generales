/**
 * Pie legal común a todas las superficies.
 * Incluye marca, enlaces, Instagram sutil y el aviso de independencia.
 */

import { EnlaceInstagram } from "./Instagram";

export const AVISO_BASE =
  "Proyecto independiente sin relación con ninguna Administración, tribunal ni organismo oficial. " +
  "Los criterios de la convocatoria vigente siempre tienen prioridad. Ningún curso garantiza un resultado. ";

export const AVISO_PRECIOS =
  "Precio final, impuestos, derecho de desistimiento, devolución y contenido disponible se muestran antes de cualquier pago.";

export const AVISO_SS =
  "Proyecto independiente sin relación con la Seguridad Social, el ministerio ni el tribunal. " +
  "Los criterios de la convocatoria vigente siempre tienen prioridad. Ningún curso garantiza un resultado. " +
  AVISO_PRECIOS;

export const AVISO_SALUD =
  "Proyecto independiente sin relación con ningún servicio de salud, tribunal ni organismo oficial. " +
  "Los criterios de la convocatoria vigente siempre tienen prioridad. Ningún curso garantiza un resultado. " +
  AVISO_PRECIOS;

export const AVISO_JUSTICIA =
  "Proyecto independiente sin relación con el Ministerio de Justicia, el tribunal ni ningún organismo oficial. " +
  "Los criterios de la convocatoria vigente siempre tienen prioridad. Ningún curso garantiza un resultado. " +
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
            {links.map((link) => (
              <a key={link.href + link.label} href={link.href}>
                {link.label}
              </a>
            ))}
            <EnlaceInstagram size={16} />
          </div>
        </div>
        <p className="lm-notice">{notice}</p>
      </div>
    </footer>
  );
}
