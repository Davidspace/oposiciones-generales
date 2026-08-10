type PruebaProductoProps = {
  whatsappUrl: string;
};

const CONTENIDO = [
  {
    numero: "01",
    titulo: "Práctica de los 26 temas",
    texto: "Cuestionarios organizados por el programa para trabajar cada tema por separado. No incluye el desarrollo teórico.",
  },
  {
    numero: "02",
    titulo: "Repasos acumulativos",
    texto: "Mezclas de varios temas y tests transversales para volver sobre plazos, recursos, resoluciones y comunicaciones.",
  },
  {
    numero: "03",
    titulo: "Supuestos prácticos",
    texto: "Casos para aplicar la norma y practicar la segunda parte del examen, no solo recordar artículos aislados.",
  },
  {
    numero: "04",
    titulo: "Simulacros teóricos y prácticos",
    texto: "Entrenamientos con formato de examen para medir ritmo, errores y capacidad de decidir con tiempo limitado.",
  },
  {
    numero: "05",
    titulo: "Modelos de estructura oficial",
    texto: "Cuestionarios organizados según la separación entre ejercicio teórico y ejercicio práctico de la convocatoria.",
  },
];

export function PruebaProducto({ whatsappUrl }: PruebaProductoProps) {
  return (
    <>
      <section className="lm-shell lm-inventory" aria-labelledby="inventario-titulo">
        <div className="lm-inventory-intro">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Contenido comprobado</p>
          <h2 id="inventario-titulo">Esto es lo que vas a encontrar.</h2>
          <p>La preparación es exclusivamente práctica. Puedes usar tu temario, legislación o apuntes y entrar al aula para preguntar, corregir y repetir.</p>
        </div>
        <ol className="lm-inventory-list">
          {CONTENIDO.map((item) => (
            <li key={item.numero}>
              <span>{item.numero}</span>
              <div><strong>{item.titulo}</strong><p>{item.texto}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="lm-shell lm-legal-sample" aria-labelledby="muestra-juridica-titulo">
        <div className="lm-legal-status">
          <span>Última revisión documental y normativa</span>
          <strong><time dateTime="2026-08-10">10 agosto 2026</time></strong>
          <p>Preguntas, respuestas, distractores y explicaciones del minisimulacro contrastados con textos consolidados del BOE. Es una revisión editorial interna, no un dictamen jurídico externo.</p>
        </div>
        <article className="lm-full-answer">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Una corrección completa</p>
          <h2 id="muestra-juridica-titulo">¿Qué afirmación refleja correctamente el artículo 1.2 de la Constitución?</h2>
          <ul aria-label="Opciones de la pregunta de ejemplo">
            <li>A · La soberanía reside en las Cortes Generales.</li>
            <li className="is-correct">B · La soberanía nacional reside en el pueblo español. <strong>Correcta</strong></li>
            <li>C · La soberanía corresponde al Gobierno.</li>
            <li>D · La soberanía se atribuye al Tribunal Constitucional.</li>
          </ul>
          <div className="lm-full-answer-explanation">
            <strong>Por qué</strong>
            <p>La Constitución sitúa la soberanía nacional en el pueblo español, del que emanan los poderes del Estado.</p>
            <a href="https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a1" target="_blank" rel="noreferrer">Consultar Constitución Española, artículo 1, en el BOE</a>
          </div>
        </article>
      </section>

      <section className="lm-shell lm-after-payment" aria-labelledby="despues-pago-titulo">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Después del pago</p>
          <h2 id="despues-pago-titulo">Entras al aula. Y te pones a practicar.</h2>
        </div>
        <div className="lm-after-payment-copy">
          <ul>
            <li>Acceso al aula Moodle de Auxilio Judicial.</li>
            <li>Cuestionarios por temas, repasos, supuestos y simulacros disponibles en el curso.</li>
            <li>Corrección automática al completar cada actividad.</li>
            <li>Acceso hasta el examen de la convocatoria vigente.</li>
            <li>Ayuda por WhatsApp para las dudas relacionadas con el acceso.</li>
          </ul>
          <p><strong>Importante:</strong> no incluye temario teórico, clases en directo, tutorías individuales ni corrección manual.</p>
          <a className="lm-btn lm-btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">Preguntar por el acceso</a>
        </div>
      </section>

    </>
  );
}
