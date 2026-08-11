type PruebaProductoProps = { whatsappUrl: string };

const CONTENIDO = [
  {
    numero: "01",
    titulo: "20 temas exactos",
    texto: "Programa oficial dividido entre parte general y parte específica, con las referencias locales que distinguen esta convocatoria.",
  },
  {
    numero: "02",
    titulo: "Test de la parte general",
    texto: "Preguntas autocorregibles para practicar el bloque que las bases destinan al segundo ejercicio.",
  },
  {
    numero: "03",
    titulo: "Laboratorio práctico",
    texto: "Entrenamiento guiado para búsquedas bibliográficas en catálogos y para manejar obras de referencia.",
  },
  {
    numero: "04",
    titulo: "Simulacros con tiempo",
    texto: "Ensaya cuatro supuestos en dos horas y el test de 50 preguntas en 50 minutos, como describe la convocatoria.",
  },
  {
    numero: "05",
    titulo: "Corrección inmediata",
    texto: "Descubre qué dato has pasado por alto y qué paso debes repetir antes de volver al siguiente caso.",
  },
];

export function PruebaProducto({ whatsappUrl }: PruebaProductoProps) {
  return (
    <>
      <section className="lm-shell lm-inventory" aria-labelledby="inventario-titulo">
        <div className="lm-inventory-intro">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Preparación específica</p>
          <h2 id="inventario-titulo">No es otro PDF.<br />Es práctica de biblioteca.</h2>
          <p>La oposición combina un programa corto con un primer ejercicio que pide hacer búsquedas y manejar referencias. La propuesta de LORMAN se centra en practicar esos dos movimientos y corregirlos al momento.</p>
        </div>
        <ol className="lm-inventory-list">
          {CONTENIDO.map((item) => <li key={item.numero}><span>{item.numero}</span><div><strong>{item.titulo}</strong><p>{item.texto}</p></div></li>)}
        </ol>
      </section>

      <section className="lm-shell lm-legal-sample" aria-labelledby="muestra-titulo">
        <div className="lm-legal-status">
          <span>Convocatoria consultada</span>
          <strong>20 temas<br />2 ejercicios</strong>
          <p>La landing se basa en las bases específicas publicadas por el Ayuntamiento de Santander. La convocatoria oficial siempre tiene prioridad sobre cualquier material de estudio.</p>
        </div>
        <article className="lm-full-answer">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Una pregunta de muestra</p>
          <h2 id="muestra-titulo">¿Qué ejercicio te obliga a trabajar con catálogos y obras de referencia?</h2>
          <ul aria-label="Opciones de la pregunta de ejemplo">
            <li className="is-correct">A · El primer ejercicio, con cuatro supuestos prácticos. <strong>Correcta</strong></li>
            <li>B · El segundo ejercicio, que es un test de 50 preguntas.</li>
            <li>C · Una entrevista personal posterior.</li>
            <li>D · Una exposición oral de los temas.</li>
          </ul>
          <div className="lm-full-answer-explanation">
            <strong>Por qué</strong>
            <p>Las bases describen el primer ejercicio como cuatro supuestos prácticos relacionados con búsquedas bibliográficas simples en catálogos manuales y automatizados o con el manejo elemental de obras de referencia.</p>
            <a href="https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=432055" target="_blank" rel="noreferrer">Consultar las bases oficiales en el BOC</a>
          </div>
        </article>
      </section>

      <section className="lm-shell lm-after-payment" aria-labelledby="despues-pago-titulo">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Cuando abras el aula</p>
          <h2 id="despues-pago-titulo">Entras y sabes qué practicar.</h2>
        </div>
        <div className="lm-after-payment-copy">
          <ul>
            <li>Programa exacto de los 20 temas de Santander.</li>
            <li>Tests autocorregibles de la parte general.</li>
            <li>Entrenamientos paso a paso de catálogo y referencia.</li>
            <li>Supuestos con el formato de cuatro casos y dos horas.</li>
            <li>Simulacros del test de 50 preguntas.</li>
            <li>Actualizaciones cuando cambien las bases o una fuente.</li>
          </ul>
          <p><strong>Formato:</strong> autoestudio en aula virtual, sin clases semanales ni tutoría individual. La fecha de examen y el precio definitivo se confirmarán cuando se abra el aula.</p>
          <a className="lm-btn lm-btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">Quiero recibir información</a>
        </div>
      </section>
    </>
  );
}
