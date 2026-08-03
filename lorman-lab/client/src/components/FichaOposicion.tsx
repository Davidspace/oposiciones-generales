/* ============================================================
   FICHA EDITORIAL DE OPOSICIÓN — componente único
   Copiar a las cuatro superficies (no comparte código entre proyectos):
     lorman-lab/client/src/components/FichaOposicion.tsx
     tai-academia/components/FichaOposicion.tsx
     ss-casolab/components/FichaOposicion.tsx
     administrativo-estado/components/FichaOposicion.tsx

   Sin dependencias: funciona igual en Next (server component) y en Vite.
   Requiere el bloque entrega/ficha-oposicion.css en el CSS global.
   Regla editorial: `indicators` solo admite datos que existan en el
   repositorio o en el inventario del aula. Si no hay dato, no se pasa.
   ============================================================ */

export type FichaTone = "tcae" | "tai" | "ss" | "c2" | "juridico";

export type FichaIndicator = {
  /** Cifra o marca corta: "33", "49 €", "90′", "—" */
  value: string;
  /** Qué es esa cifra, en minúsculas y sin promesas */
  label: string;
  /** Resalta el valor con el color del producto (usar solo en precio) */
  tone?: boolean;
};

export type FichaAction = {
  label: string;
  href?: string;
  /** Estado real: acción anunciada pero no habilitada todavía */
  disabled?: boolean;
  onClick?: () => void;
};

export type FichaOposicionProps = {
  code: string;                 // TCAE · TAI · SS · C2
  tone: FichaTone;              // franja superior y color propio
  admin: string;                // administración + nivel
  title: string;
  description: string;
  status: string;               // estado real del producto
  indicators?: FichaIndicator[];
  price?: { label: string; value: string; unavailable?: boolean };
  primary: FichaAction;         // acción principal
  secondary?: FichaAction;      // muestra, diagnóstico o información
  /** `compact` = versión adaptada dentro del hero de cada landing */
  variant?: "hub" | "compact";
  className?: string;
};

export function FichaOposicion({
  code,
  tone,
  admin,
  title,
  description,
  status,
  indicators = [],
  price,
  primary,
  secondary,
  variant = "hub",
  className = "",
}: FichaOposicionProps) {
  const Tag = variant === "compact" ? "aside" : "article";
  return (
    <Tag
      className={`of-scope of-tone-${tone} of-card ${
        variant === "compact" ? "of-card--compact" : ""
      } ${className}`}
    >
      <div className="of-card__stripe" aria-hidden="true" />

      <div className="of-card__top">
        <span className="of-code">{code}</span>
        <span className="of-status">{status}</span>
      </div>

      <div className="of-card__body">
        <p className="of-admin">{admin}</p>
        {variant === "compact" ? <h2 className="of-title">{title}</h2> : <h3 className="of-title">{title}</h3>}
        <p className="of-text">{description}</p>
      </div>

      {indicators.length > 0 && (
        <dl className="of-indicators">
          {indicators.map((item) => (
            <div key={item.label}>
              <dt className={item.tone ? "is-tone" : undefined}>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      )}

      {price && (
        <div className={`of-price ${price.unavailable ? "of-price--none" : ""}`}>
          <span>{price.label}</span>
          <strong>{price.value}</strong>
        </div>
      )}

      <div className="of-actions">
        {primary.disabled ? (
          <span className="of-cta" aria-disabled="true">
            {primary.label} <span aria-hidden="true">◦</span>
          </span>
        ) : (
          <a className="of-cta" href={primary.href} onClick={primary.onClick}>
            {primary.label} <span aria-hidden="true">↗</span>
          </a>
        )}
        {secondary && !secondary.disabled && (
          <a className="of-cta-2" href={secondary.href} onClick={secondary.onClick}>
            {secondary.label}
          </a>
        )}
      </div>
    </Tag>
  );
}

export default FichaOposicion;
