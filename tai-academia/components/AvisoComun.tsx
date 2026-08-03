/* ============================================================
   AVISO COMÚN — pie legal unificado de las cuatro superficies
   Copiar a:
     lorman-lab/client/src/components/AvisoComun.tsx
     tai-academia/components/AvisoComun.tsx
     ss-casolab/components/AvisoComun.tsx
     administrativo-estado/components/AvisoComun.tsx
   Cada superficie pasa su propio `notice` y sus propios enlaces:
   no se mezclan mensajes ni rutas entre productos.
   ============================================================ */

export type AvisoComunProps = {
  brand: string;
  tagline: string;
  links: { label: string; href: string; external?: boolean }[];
  /** Texto legal de esta superficie. Base común + matiz del producto. */
  notice: string;
};

export const AVISO_BASE =
  "Proyecto independiente sin relación con ninguna Administración, tribunal ni organismo oficial. " +
  "Los criterios de la convocatoria vigente siempre tienen prioridad. Ningún curso garantiza un resultado.";

export const AVISO_PRECIOS =
  " Los importes mostrados corresponden al producto y modalidad indicados. Antes de cualquier pago se mostrarán " +
  "los impuestos, el derecho de desistimiento, la devolución, el contenido disponible y los límites de soporte.";

export const AVISO_SIN_VENTA =
  " Esta superficie está en validación local: no hay venta activa ni precio publicado, y las condiciones se " +
  "mostrarán antes de habilitar cualquier pago.";

export function AvisoComun({ brand, tagline, links, notice }: AvisoComunProps) {
  return (
    <footer className="of-legal">
      <div className="of-legal__inner">
        <div className="of-legal__brand">
          <strong>{brand}</strong>
          <p>{tagline}</p>
          <div className="of-legal__links">
            {links.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="of-legal__notice">
          <p>Aviso común</p>
          <p>{notice}</p>
        </div>
      </div>
    </footer>
  );
}

export default AvisoComun;
