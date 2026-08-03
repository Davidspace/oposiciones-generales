/**
 * FichaCurso — tarjeta de curso del hub (dos por fila).
 * Directa y corta: código grande, título, tipo de contenido y un botón grande.
 * Sin párrafo de introducción y sin estados de contenido.
 *
 * Requiere `lorman-industry.css`. El color lo da la clase de producto
 * (`tone`) que se aplica a la propia tarjeta.
 */

export type FichaTono = "hub" | "tcae" | "tai" | "ss" | "aux";

export type FichaItem = {
  /** Titular grande de la fila: el tipo de contenido. */
  title: string;
  /** Detalle pequeño (cifras incluidas: van en segundo plano). */
  note?: string;
};

export type FichaCursoProps = {
  code: string;
  title: string;
  meta: string;
  tone: FichaTono;
  items: FichaItem[];
  /** Fila de precio opcional: solo cuando el precio está cerrado. */
  price?: { title: string; note?: string; value: string };
  cta: { label: string; href: string };
};

export function FichaCurso({
  code,
  title,
  meta,
  tone,
  items,
  price,
  cta,
}: FichaCursoProps) {
  const codeClass =
    code.length > 4 ? "lm-card-code lm-card-code-sm" : "lm-card-code";

  return (
    <article className={`lm-card lm-${tone}`}>
      <div className="lm-card-head">
        <strong className={codeClass}>{code}</strong>
        <h3>{title}</h3>
        <p className="lm-card-meta">{meta}</p>
      </div>

      <ul className="lm-card-list">
        {items.map((item) => (
          <li key={item.title}>
            <strong className="lm-item-title">{item.title}</strong>
            {item.note ? <span className="lm-item-note">{item.note}</span> : null}
          </li>
        ))}
        {price ? (
          <li className="lm-row-price">
            <span>
              <strong className="lm-item-title">{price.title}</strong>
              {price.note ? <span className="lm-item-note">{price.note}</span> : null}
            </span>
            <strong className="lm-price">{price.value}</strong>
          </li>
        ) : null}
      </ul>

      <div className="lm-card-foot">
        <a className="lm-card-cta" href={cta.href}>
          {cta.label}
        </a>
      </div>
    </article>
  );
}
