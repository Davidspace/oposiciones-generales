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

const CAPTURAS = [
  {
    src: "/muestras/aula-repasos.png",
    alt: "Vista real del aula Moodle de Auxilio Judicial con repasos acumulativos y transversales",
    titulo: "Aula real",
    texto: "Repasos acumulativos y tests transversales dentro de Moodle.",
  },
  {
    src: "/muestras/pregunta-mini-simulacro.png",
    alt: "Pregunta real del mini simulacro gratuito de Auxilio Judicial",
    titulo: "Pregunta y tiempo",
    texto: "Enunciado, cuatro alternativas, contador y penalización visible.",
  },
  {
    src: "/muestras/resultado-mini-simulacro.png",
    alt: "Resultado real del mini simulacro con puntuación teórica, práctica y por bloques",
    titulo: "Resultado inmediato",
    texto: "Puntuación separada por ejercicio y desglose de las áreas practicadas.",
  },
  {
    src: "/muestras/explicacion-correccion.png",
    alt: "Corrección explicada de una pregunta con enlace a la Constitución en el BOE",
    titulo: "Corrección explicada",
    texto: "Respuesta correcta, explicación y acceso directo a la fuente oficial.",
  },
];

export function PruebaProducto({ whatsappUrl }: PruebaProductoProps) {
  return (
    <>
      <section className="lm-shell lm-product-proof" aria-labelledby="prueba-producto-titulo">
        <div className="lm-proof-heading">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Antes de pagar</p>
            <h2 id="prueba-producto-titulo">Mira el aula. Mira cómo corrige.</h2>
          </div>
          <p>No tienes que fiarte de una promesa. Estas capturas pertenecen al aula actual y al minisimulacro que puedes completar gratis en esta misma página.</p>
        </div>

        <div className="lm-proof-gallery">
          {CAPTURAS.map((captura) => (
            <figure key={captura.src} className="lm-proof-shot">
              <a href={captura.src} target="_blank" rel="noreferrer" aria-label={`${captura.titulo}. Abrir captura a tamaño completo.`}>
                <img src={captura.src} alt={captura.alt} loading="lazy" decoding="async" />
              </a>
              <figcaption><strong>{captura.titulo}</strong><span>{captura.texto}</span></figcaption>
            </figure>
          ))}
        </div>
        <p className="lm-proof-caption">Capturas realizadas el 10 de agosto de 2026. La vista del aula se obtuvo en modo de lectura y no muestra datos de alumnos.</p>
      </section>

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

      <section className="lm-shell lm-first-reviews" aria-labelledby="opiniones-titulo">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Opiniones reales</p>
          <h2 id="opiniones-titulo">No vamos a inventarnos reseñas.</h2>
        </div>
        <div>
          <p>Este curso de Auxilio Judicial todavía no tiene opiniones verificadas publicadas. Queremos que las primeras personas prueben el aula, nos señalen cualquier fallo y cuenten su experiencia con sus propias palabras.</p>
          <p>Cuando publiquemos una opinión, indicaremos que procede de un usuario real y pediremos permiso antes de mostrarla.</p>
          <a className="lm-btn lm-btn-outline" href={whatsappUrl} target="_blank" rel="noreferrer">Quiero probarlo y dar feedback</a>
        </div>
      </section>
    </>
  );
}
