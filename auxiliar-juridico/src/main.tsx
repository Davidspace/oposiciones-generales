import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { AvisoComun, AVISO_JUSTICIA } from "./components/AvisoComun";
import { Cajon, CajonCierre } from "./components/Cajones";
import { CtaContacto } from "./components/CtaContacto";
import { ConsentBanner } from "./components/ConsentBanner";
import { DiagnosticoAuxilio } from "./components/DiagnosticoAuxilio";
import { EnlaceInstagram } from "./components/Instagram";
import { PruebaProducto } from "./components/PruebaProducto";
import { initialiseAnalytics } from "./lib/analytics";
import { captureAttribution, withCampaignReference } from "./lib/attribution";

const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL?.trim() || "https://academialorman.es";
const MOODLE_URL = "https://aula.academialorman.es";
const WHATSAPP = "34640828654";
captureAttribution();
initialiseAnalytics();
const WHATSAPP_MESSAGE = withCampaignReference("Hola Academia LORMAN, quiero acceder a los tests de Auxilio Judicial por 29 €.");
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL?.trim() || `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Inventario editorial conservado para trazabilidad del aula, no se muestra como contenido público.
const AUXILIO_COURSE_URL = "https://aula.academialorman.es/course/view.php?id=11";
const TOPICS = ["Organización judicial", "Procedimientos", "Actos de comunicación"];
void AUXILIO_COURSE_URL;
void TOPICS;

function App() {
  return (
    <>
      <a className="lm-skip-link" href="#contenido">Saltar al contenido</a>
      <main className="lm-page lm-aux" id="contenido">
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación de Auxilio Judicial"><a className="lm-nav-back" href={PORTFOLIO_URL}>← Cursos</a><a className="lm-nav-material" href="#tests">Qué incluye</a><EnlaceInstagram size={12} /><a className="lm-nav-aula" href={MOODLE_URL} aria-label="Entrar al aula virtual de Academia LORMAN">Entrar al aula</a></nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Recta final · examen 3 de octubre · práctica intensiva</p>
          <h1>Deja de dar vueltas.<br />Ve al test.</h1>
          <p className="lm-lead">Lleves meses o empieces hoy, todavía puedes aprovechar la recta final. Usa los tests para descubrir qué dominas, localizar lagunas y centrar cada repaso. Practica los 26 temas hasta el examen por <strong>29 € en un único pago</strong>. Preparación práctica: no incluye el temario teórico completo.</p>
          <CtaContacto
            whatsapp={WHATSAPP}
            label="Quiero los tests por 29 €"
            message="Hola Academia LORMAN, quiero acceder a los tests de Auxilio Judicial por 29 €."
          >
            <a className="lm-btn lm-btn-outline" href="#prueba">Probar el mini simulacro</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-exam-strip" aria-label="Datos de la convocatoria de Auxilio Judicial 2026">
          <div><strong>3 octubre 2026</strong><span>fecha oficial del examen</span></div>
          <div><strong>425 plazas</strong><span>acceso libre en la convocatoria</span></div>
          <div><strong>26 temas</strong><span>cubiertos mediante práctica</span></div>
          <div className="lm-exam-links">
            <a href="https://www.boe.es/buscar/doc.php?id=BOE-A-2025-27053" target="_blank" rel="noreferrer">Ver convocatoria</a>
            <a href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-12731" target="_blank" rel="noreferrer">Ver fecha oficial</a>
          </div>
        </section>

        <section className="lm-shell lm-offer-intro" id="tests" aria-labelledby="contenido-aula">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Dentro del aula</p>
            <h2 id="contenido-aula">Tres formas de practicar. Un mismo objetivo.</h2>
          </div>
          <p>Empieza por preguntas concretas, aplica lo estudiado en casos y termina comprobando tu ritmo. Elige lo que necesitas hoy y avanza sin depender de clases ni horarios.</p>
        </section>

        <section className="lm-shell lm-boxes" aria-label="Tests, supuestos prácticos y simulacros del aula">
          <Cajon kicker="01 · TESTS" title="Tests por tema" text="Cada tema empieza con una infografía y un esquema breve para situarte y repasar antes del cuestionario." figure="repasa, responde y corrige" />
          <Cajon kicker="02 · PRÁCTICA" title="Supuestos prácticos" text="Pasa del artículo al caso y entrena cómo aplicar la norma cuando el enunciado cambia." figure="aplica lo que estudias" />
          <Cajon kicker="03 · EXAMEN" title="Simulacros" text="Pon a prueba tu ritmo, tus decisiones y tu resistencia antes de llegar al examen real." figure="mídete con tiempo" />
          <CajonCierre kicker="04 · ACCESO" title="29 € hasta el examen" text="Un único pago. Práctica autocorregible con apoyo visual breve; no incluye el temario teórico completo." href={WHATSAPP_URL} label="Quiero acceder" />
        </section>

        <PruebaProducto whatsappUrl={WHATSAPP_URL} />

        <DiagnosticoAuxilio />

        <section className="lm-shell lm-seo-copy" aria-labelledby="preparar-auxilio">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Recta final</p>
            <h2 id="preparar-auxilio">Queda poco. Empieza por un test.</h2>
          </div>
          <div>
            <p>El examen de acceso libre de Auxilio Judicial es el <strong>3 de octubre de 2026</strong>. Si acabas de empezar, los tests te ayudan a identificar prioridades y acompañar el estudio. Si ya llevas tiempo, te permiten comprobar lo que recuerdas y localizar fallos.</p>
            <p>La convocatoria vigente separa un primer ejercicio teórico y un segundo ejercicio práctico de 40 preguntas sobre dos supuestos. Practica con cuestionarios por temas, repasos, supuestos, simulacros y modelos de examen. Corrige al momento y aprovecha estas últimas semanas sin clases, horarios ni permanencia.</p>
          </div>
        </section>

        <section className="lm-shell lm-faq lm-aux-faq" aria-labelledby="preguntas-frecuentes">
          <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
          <div>
            <details><summary>¿La prueba gratuita es un examen oficial?</summary><p>No. Es un mini simulacro propio: 20 preguntas teóricas, 8 prácticas sobre dos casos originales y 2 preguntas de reserva. Aplica tiempos y una penalización proporcional al formato de la convocatoria, pero no evalúa los 26 temas ni sustituye un examen oficial.</p></details>
            <details><summary>¿Me sirve si acabo de empezar?</summary><p>Sí. Te permite reconocer el tipo de pregunta, descubrir qué bloque debes priorizar y comprobar si estás entendiendo la lógica de los actos procesales. Como no incluye el desarrollo teórico completo, puedes acompañarlo con legislación, apuntes o un temario propio.</p></details>
            <details><summary>¿El curso incluye temario teórico?</summary><p>No se entrega el desarrollo teórico completo. Cada tema sí incluye una infografía y un esquema breve para darte contexto y facilitar un repaso antes de sus cuestionarios. Puedes usarlo desde el principio, siempre junto con tu legislación, apuntes o temario.</p></details>
            <details><summary>¿Cuánto dura el acceso?</summary><p>El pago es único y el acceso se mantiene hasta el examen de la convocatoria vigente.</p></details>
            <details><summary>¿Hay clases o tutorías?</summary><p>No hay clases semanales ni tutoría individual. Puedes practicar a tu ritmo y consultar por WhatsApp las dudas sobre el acceso.</p></details>
          </div>
        </section>
        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "WhatsApp", href: WHATSAPP_URL }]} notice={AVISO_JUSTICIA} />
        <ConsentBanner />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
