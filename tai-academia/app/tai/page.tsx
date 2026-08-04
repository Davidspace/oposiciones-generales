import { PORTFOLIO_URL } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";
import { Cajon, CajonCierre } from "@/components/Cajones";
import { CtaContacto } from "@/components/CtaContacto";
import { MuestraMaterial } from "@/components/MuestraMaterial";

const WHATSAPP = "34640828654";

const FAQ = [
  ["¿Incluye clases semanales?", "No. El curso está diseñado para autoestudio: temarios en PDF, autoevaluaciones y simulacros dentro del aula. Así podemos ofrecer el contenido a un precio reducido y sin depender de horarios."],
  ["¿Qué contiene cada autoevaluación?", "El aula muestra la calificación, los aciertos, los errores, las respuestas correctas y la explicación de cada pregunta al finalizar."],
  ["¿Prepara las dos partes del ejercicio?", "Sí. La estructura del aula refleja una primera parte de 80 preguntas más 5 de reserva y una segunda parte práctica de 20 preguntas más 5 de reserva, con 120 minutos para el conjunto."],
  ["¿Hay corrección individual o tutoría?", "No está incluida. Las autoevaluaciones son automáticas. El producto prioriza material y práctica reutilizable para mantener un precio bajo."],
  ["¿Incluye garantía de aprobado?", "No. Ningún curso puede garantizar un resultado. El objetivo es darte una ruta completa de estudio y práctica frecuente."],
] as const;

export default function TaiLanding() {
  return (
    <>
      <a className="tai-skip-link" href="#contenido-principal">Saltar al contenido</a>
      <main className="lm-page lm-tai" id="contenido-principal" tabIndex={-1}>
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Curso TAI, inicio"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación del curso TAI"><a className="tai-nav-home" href={PORTFOLIO_URL}>Todos los cursos</a><a href="#contenido">Qué incluye</a><a href="#muestra">Muestra</a><a href="#ruta">Ruta</a><a href="#acceso">Acceso</a></nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Curso completo · TAI C1</p>
          <h1>Todo el programa.<br />Sin pagar de más.</h1>
          <p className="lm-lead">Preparación online para Técnicos Auxiliares de Informática de la Administración del Estado: 33 temas, 33 autoevaluaciones y 10 simulacros completos para practicar las dos partes del ejercicio.</p>
          <CtaContacto whatsapp={WHATSAPP}>
            <a className="lm-btn lm-btn-outline" href="#contenido">Ver el contenido</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-boxes" id="acceso" aria-label="Contenido de TAI">
          <Cajon kicker="01 · TEMARIO" title="Temario completo" text="Legislación, administración electrónica, desarrollo, sistemas, redes y seguridad." figure="33 temas" />
          <Cajon kicker="02 · TEST" title="Tests y autoevaluaciones" text="Un cuestionario por tema con calificación, aciertos, errores, respuesta correcta y explicación." figure="muchos más que temas" />
          <Cajon kicker="03 · SIMULACROS" title="Simulacros y prácticos" text="Cinco simulacros del bloque III y cinco del bloque IV, con reservas y tiempo límite de dos horas." figure="las dos partes del ejercicio" />
          <CajonCierre kicker="04 · PRECIO / ACCESO" title="Pago único" text="95 € · acceso hasta la fecha del examen." href={`https://wa.me/${WHATSAPP}?text=Hola%20Academia%20LORMAN%2C%20quiero%20consultar%20el%20acceso%20al%20curso%20TAI.`} />
        </section>

        <MuestraMaterial
          grupos={[{
            paginas: [
              { src: "/muestras/tai-1.jpeg", alt: "Página de muestra del temario TAI 1" },
              { src: "/muestras/tai-2.jpeg", alt: "Página de muestra del temario TAI 2" },
              { src: "/muestras/tai-3.jpeg", alt: "Página de muestra del temario TAI 3" },
              { src: "/muestras/tai-4.jpeg", alt: "Página de muestra del temario TAI 4" },
            ],
            nota: "Páginas de muestra del temario TAI. El aula contiene el programa completo.",
          }]}
          preguntas={[]}
        />

        <section className="lm-shell" id="ruta">
          <div className="lm-section-heading"><p className="lm-eyebrow"><i aria-hidden="true" /> La ruta</p><h2 className="lm-display">Leer. Comprobar.<br />Simular. Corregir.</h2><p className="lm-lead">El aula convierte el programa en una secuencia sencilla. No necesitas una clase semanal para saber cuál es el siguiente paso.</p></div>
          <div className="lm-cards lm-route-grid">
            {[
              ["01", "Mapa del examen", "Sitúa las dos partes del ejercicio y decide dónde empiezas."],
              ["02", "Tema y autoevaluación", "Estudia el PDF del tema y comprueba lo aprendido."],
              ["03", "Simulacro por bloque", "Practica con cinco simulacros del bloque III y cinco del IV."],
              ["04", "Revisión del error", "Consulta tus aciertos, errores y explicaciones antes de repetir."],
            ].map(([number, title, text]) => <article className="lm-card" key={number}><div className="lm-card-head"><strong className="lm-card-code">{number}</strong><h3>{title}</h3><p className="lm-card-meta">{text}</p></div></article>)}
          </div>
        </section>

        <section className="lm-shell lm-panel" id="contenido">
          <span className="lm-panel-kicker">Inventario del aula</span>
          <div className="lm-panel-row"><strong>33 temas</strong><span>El programa completo de TAI en documentos PDF.</span></div>
          <div className="lm-panel-row"><strong>33 autoevaluaciones</strong><span>Una por tema, con explicación tras el intento.</span></div>
          <div className="lm-panel-row"><strong>10 simulacros</strong><span>Cinco para el bloque III y cinco para el bloque IV.</span></div>
          <div className="lm-panel-row"><strong>120 minutos</strong><span>Entrenamiento del ejercicio conjunto con preguntas de reserva.</span></div>
        </section>

        <section className="lm-shell lm-faq" aria-labelledby="faq-title">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Preguntas</p><h2 id="faq-title" className="lm-display">Antes de empezar.</h2>
          {FAQ.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </section>

        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "Contenido", href: "#contenido" }, { label: "Acceso", href: "#acceso" }]} notice={AVISO_BASE + AVISO_PRECIOS} />
      </main>
    </>
  );
}
