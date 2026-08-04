"use client";

/**
 * Fila «Muestra del material» de una landing específica.
 * Dos columnas simétricas: páginas del temario a la izquierda y preguntas
 * tipo test en desplegables (cerrados por defecto) a la derecha.
 * Las alturas se igualan solas: ambas columnas son flex con cuerpo flex:1.
 */

export type PaginaMuestra = {
  /** Ruta en /public, p. ej. "/muestras/tai-1.jpeg". Si falta, se dibuja un hueco. */
  src?: string;
  alt?: string;
};

export type PreguntaMuestra = {
  enunciado: string;
  /** Cuatro opciones, en orden a) b) c) d). */
  opciones: string[];
  /** Letra de la respuesta correcta, p. ej. "b". */
  respuesta: string;
  explicacion: string;
};

export type GrupoMuestra = {
  /** Etiqueta de la pestaña (p. ej. "Murcia" / "Andalucía"). Omitir si hay un solo grupo. */
  etiqueta?: string;
  paginas: PaginaMuestra[];
  /** Nota al pie de la columna izquierda. */
  nota?: string;
};

export type MuestraMaterialProps = {
  titulo?: string;
  intro?: string;
  etiquetaIzquierda?: string;
  etiquetaDerecha?: string;
  /** Uno o varios grupos de páginas; con dos o más aparecen las pestañas. */
  grupos: GrupoMuestra[];
  preguntas: PreguntaMuestra[];
  notaPreguntas?: string;
};

import { useState } from "react";

export function MuestraMaterial({
  titulo = "Muestra del material",
  intro = "Páginas reales del temario y preguntas de ejemplo, para que veas el formato antes de decidir.",
  etiquetaIzquierda = "Temario · páginas de muestra",
  etiquetaDerecha = "Tipo test · preguntas",
  grupos,
  preguntas,
  notaPreguntas = "Preguntas de ejemplo; el banco completo está en el campus.",
}: MuestraMaterialProps) {
  const [activo, setActivo] = useState(0);
  const grupo = grupos[activo] ?? grupos[0];

  return (
    <section className="lm-shell lm-muestra" id="muestra">
      <h2 className="lm-muestra-h2">{titulo}</h2>
      <p className="lm-muestra-intro">{intro}</p>

      <div className="lm-muestra-grid">
        <div className="lm-muestra-col">
          <div className="lm-muestra-head">
            <span className="lm-muestra-label">{etiquetaIzquierda}</span>
            {grupos.length > 1 ? (
              <div className="lm-muestra-tabs">
                {grupos.map((g, i) => (
                  <button
                    key={g.etiqueta ?? i}
                    type="button"
                    className={i === activo ? "lm-muestra-tab is-on" : "lm-muestra-tab"}
                    aria-pressed={i === activo}
                    onClick={() => setActivo(i)}
                  >
                    {g.etiqueta}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lm-muestra-paginas">
            {grupo.paginas.map((p, i) =>
              p.src ? (
                <figure key={i} className="lm-muestra-pagina">
                  <img src={p.src} alt={p.alt ?? `Página de muestra ${i + 1}`} />
                </figure>
              ) : (
                <figure key={i} className="lm-muestra-pagina is-vacia">
                  <span>Página {i + 1}</span>
                </figure>
              )
            )}
          </div>
          {grupo.nota ? <p className="lm-muestra-nota">{grupo.nota}</p> : null}
        </div>

        <div className="lm-muestra-col">
          <div className="lm-muestra-head">
            <span className="lm-muestra-label">{etiquetaDerecha}</span>
          </div>

          <div className="lm-muestra-preguntas">
            {preguntas.map((q, i) => (
              <details key={i} className="lm-pregunta">
                <summary>
                  <span className="lm-pregunta-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="lm-pregunta-titulo">{q.enunciado}</span>
                  <span className="lm-pregunta-ver" aria-hidden="true">Ver</span>
                </summary>
                <div className="lm-pregunta-cuerpo">
                  <div className="lm-pregunta-opciones">
                    {q.opciones.map((o, j) => (
                      <span key={j}>{"abcd"[j]}) {o}</span>
                    ))}
                  </div>
                  <p className="lm-pregunta-sol">
                    <strong>Respuesta {q.respuesta}</strong> · {q.explicacion}
                  </p>
                </div>
              </details>
            ))}
          </div>
          <p className="lm-muestra-nota">{notaPreguntas}</p>
        </div>
      </div>
    </section>
  );
}
