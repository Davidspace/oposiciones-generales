const pages = [
  { src: "/muestras/tai-1.jpeg", alt: "Muestra real del temario TAI: esquema normativo" },
  { src: "/muestras/tai-2.jpeg", alt: "Muestra real del temario TAI: explicación desarrollada" },
  { src: "/muestras/tai-3.jpeg", alt: "Muestra real del temario TAI: contenido técnico" },
  { src: "/muestras/tai-4.jpeg", alt: "Muestra real del temario TAI: resumen para repasar" },
];

export function TaiMaterialPreview() {
  return (
    <section className="lm-shell tai-preview" id="muestra" aria-labelledby="tai-preview-title">
      <div className="tai-section-heading">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Material real</p>
          <h2 id="tai-preview-title">Mira el contenido antes de decidir.</h2>
        </div>
        <p>No son maquetas. Son páginas del temario que encontrarás en el aula. Ábrelas, amplíalas y comprueba si la forma de explicar te encaja.</p>
      </div>

      <div className="tai-preview-layout">
        <div className="tai-pages" aria-label="Páginas reales del temario TAI">
          {pages.map((page, index) => (
            <a href={page.src} target="_blank" rel="noreferrer" key={page.src} data-analytics-event="material_preview_open" data-analytics-placement={`page_${index + 1}`}>
              <img src={page.src} alt={page.alt} loading="lazy" decoding="async" />
              <span>Página {String(index + 1).padStart(2, "0")} · ampliar ↗</span>
            </a>
          ))}
        </div>

        <aside className="tai-study-flow" aria-label="Cómo se trabaja en el aula">
          <p className="tai-route-kicker">Así se trabaja</p>
          <ol>
            <li><span>01</span><div><strong>Entiende el tema</strong><p>Contenido redactado y ordenado para avanzar sin reconstruir apuntes.</p></div></li>
            <li><span>02</span><div><strong>Comprueba lo aprendido</strong><p>Autoevaluaciones por tema para detectar el fallo cuando todavía puedes corregirlo.</p></div></li>
            <li><span>03</span><div><strong>Vuelve a lo que falla</strong><p>Corrección inmediata y explicaciones para convertir cada error en un repaso concreto.</p></div></li>
            <li><span>04</span><div><strong>Ensaya las dos partes</strong><p>Simulacros teóricos y prácticos para trabajar formato, criterio y ritmo.</p></div></li>
          </ol>
          <a href="#prueba" data-analytics-event="trial_cta_click" data-analytics-placement="material_preview">Probar ahora una muestra →</a>
        </aside>
      </div>
    </section>
  );
}
