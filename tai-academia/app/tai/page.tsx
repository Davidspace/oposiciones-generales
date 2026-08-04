import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";
import { FichaOposicion } from "@/components/FichaOposicion";
import { PORTFOLIO_URL } from "@/lib/portfolio-links";

const STUDY_ROUTE = [
  {
    number: "01",
    title: "Mapa del examen",
    text: "Sitúa las dos partes del ejercicio y decide si empiezas por el bloque III o por el bloque IV.",
  },
  {
    number: "02",
    title: "Tema y autoevaluación",
    text: "Estudia el PDF del tema y comprueba lo aprendido con su cuestionario autocorregible.",
  },
  {
    number: "03",
    title: "Simulacro por bloque",
    text: "Practica con cinco simulacros del bloque III y cinco del bloque IV.",
  },
  {
    number: "04",
    title: "Revisión del error",
    text: "Consulta tus aciertos, errores, respuestas correctas y explicaciones antes de repetir.",
  },
];

const COURSE_PARTS = [
  ["01", "33 temas en PDF", "El aula contiene los 33 temas del programa TAI: legislación, administración electrónica, desarrollo, sistemas, redes y seguridad."],
  ["02", "33 autoevaluaciones", "Cada tema tiene un cuestionario. Moodle muestra la calificación, los aciertos, los errores, la respuesta correcta y la explicación."],
  ["03", "10 simulacros completos", "Cinco simulacros del bloque III y cinco del bloque IV, con selección de preguntas, reservas y tiempo límite de dos horas."],
  ["04", "Aula asíncrona", "Estudia sin clases obligatorias ni horarios fijos. Accede al material y practica cuando encaje con tu calendario."],
];

const FAQ = [
  [
    "¿Incluye clases semanales?",
    "No. El curso está diseñado para autoestudio: temarios en PDF, autoevaluaciones y simulacros dentro del aula. Así podemos ofrecer el contenido a un precio reducido y sin depender de horarios.",
  ],
  [
    "¿Qué contiene cada autoevaluación?",
    "El modelo del aula muestra la calificación, los aciertos, los errores, las respuestas correctas y la explicación de cada pregunta al finalizar.",
  ],
  [
    "¿Prepara las dos partes del ejercicio?",
    "Sí. La estructura del aula refleja una primera parte de 80 preguntas más 5 de reserva y una segunda parte práctica de 20 preguntas más 5 de reserva, con 120 minutos para el conjunto.",
  ],
  [
    "¿Hay corrección individual o tutoría?",
    "No está incluida. Las autoevaluaciones son automáticas. El producto prioriza material y práctica reutilizable para mantener un precio bajo.",
  ],
  [
    "¿Incluye una garantía de aprobado?",
    "No. Ningún curso puede garantizar un resultado. El objetivo es darte una ruta completa de estudio y práctica frecuente.",
  ],
];

const ACCESS_PRICE = "59 €";

export default function TaiLanding() {
  return (
    <main className="tai-page">
      <header className="tai-header">
        <a className="tai-brand" href="#inicio" aria-label="Curso TAI. Inicio">
          <span className="tai-brand-mark" aria-hidden="true">TAI</span>
          <span>
            <strong>Curso completo TAI 2026</strong>
            <small>Academia LORMAN</small>
          </span>
        </a>
        <nav className="tai-nav" aria-label="Navegación del curso TAI">
          <a href="#ruta">Ruta</a>
          <a href="#incluye">Qué incluye</a>
          <a className="tai-nav-cta" href="#acceso">Ver precio</a>
        </nav>
      </header>

      <section className="tai-hero" id="inicio">
        <div className="tai-hero-copy">
          <p className="tai-eyebrow"><span aria-hidden="true" /> CURSO COMPLETO · TAI C1</p>
          <h1>Todo el programa.<br /><em>Sin pagar de más.</em></h1>
          <p className="tai-hero-lead">
            Preparación online para Técnicos Auxiliares de Informática de la
            Administración del Estado. 33 temas, 33 autoevaluaciones y 10
            simulacros completos para practicar las dos partes del ejercicio.
          </p>
          <div className="tai-actions">
            <a className="tai-button tai-button-primary" href="#acceso">Ver precio de lanzamiento <span aria-hidden="true">↓</span></a>
            <a className="tai-text-link" href="#ruta">Ver la ruta de estudio</a>
          </div>
          <p className="tai-microcopy">Contenido del aula LORMAN · autoestudio · sin clases obligatorias</p>
        </div>

        <FichaOposicion
          variant="compact"
          code="TAI"
          tone="tai"
          admin="Administración del Estado · subgrupo C1"
          title="Ficha del curso"
          description="Ejercicio único en dos partes: 80 preguntas más 5 de reserva y una parte práctica de 20 más 5, con 120 minutos para el conjunto."
          status="Contenido completo · matrícula en preparación"
          indicators={[
            { value: "33", label: "temas en PDF" },
            { value: "33", label: "autoevaluaciones con explicación" },
            { value: "10", label: "simulacros: bloques III y IV" },
            { value: "12", label: "meses de acceso" },
          ]}
          price={{ label: "Precio de lanzamiento", value: ACCESS_PRICE }}
          primary={{ label: "Ver el acceso completo", href: "#acceso" }}
          secondary={{ label: "Qué incluye", href: "#incluye" }}
        />
      </section>

      <section className="tai-proof" aria-label="Datos del curso">
        <p>1.030 plazas · ingreso libre</p><p>33 temas</p><p>10 simulacros</p><p>120 minutos</p>
      </section>

      <section className="tai-route-section" id="ruta">
        <div className="tai-section-heading"><p className="tai-kicker">LA RUTA</p><h2>Estudia en el orden que te ayuda a avanzar.</h2><p>El aula convierte el programa en una secuencia sencilla: leer, comprobar, simular y corregir. No necesitas una clase semanal para saber cuál es el siguiente paso.</p></div>
        <ol className="tai-route-grid">
          {STUDY_ROUTE.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}
        </ol>
      </section>

      <section className="tai-includes" id="incluye">
        <div className="tai-section-heading"><p className="tai-kicker">QUÉ INCLUYE</p><h2>El contenido real del aula, sin adornos.</h2><p>La oferta se basa en los recursos que ya están organizados en el Moodle de TAI.</p></div>
        <div className="tai-parts-grid">
          {COURSE_PARTS.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="tai-access" id="acceso">
        <div><p className="tai-kicker">ACCESO</p><h2>Una edición completa con precio de lanzamiento.</h2><p>Hemos eliminado las clases obligatorias y la tutoría individual para mantener el producto ligero y asequible. El precio mostrado es la propuesta inicial para validar la matrícula propia.</p></div>
        <div className="tai-access-card"><span className="tai-status">PRECIO DE LANZAMIENTO</span><strong>Curso completo TAI C1</strong><p>Acceso al contenido del aula durante 12 meses.</p><ul className="tai-pricing"><li><span>33 temas + 33 autoevaluaciones</span><strong>Incluidos</strong></li><li><span>10 simulacros completos</span><strong>Incluidos</strong></li><li><span>Acceso 12 meses</span><strong>{ACCESS_PRICE}</strong></li></ul><span className="tai-button tai-button-dark tai-button-disabled" aria-label="Matrícula propia en preparación">Matrícula propia en preparación</span><small>La compra se habilitará en esta misma página. No incluye tutoría individual ni corrección manual.</small></div>
      </section>

      <section className="tai-faq" aria-labelledby="tai-faq-title"><div><p className="tai-kicker">PREGUNTAS</p><h2 id="tai-faq-title">Antes de empezar.</h2></div><div className="tai-faq-list">{FAQ.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>

      <AvisoComun
        brand="Curso TAI C1 · Academia LORMAN"
        tagline="Curso completo TAI C1 · contenido del aula LORMAN."
        links={[
          { label: "Todos los cursos ↗", href: PORTFOLIO_URL },
          { label: "Ruta", href: "#ruta" },
          { label: "Qué incluye", href: "#incluye" },
          { label: "Acceso", href: "#acceso" },
        ]}
        notice={AVISO_BASE + AVISO_PRECIOS}
      />
    </main>
  );
}
