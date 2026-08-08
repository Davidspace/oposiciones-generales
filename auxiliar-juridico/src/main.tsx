import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { AvisoComun, AVISO_JUSTICIA } from "./components/AvisoComun";
import { Cajon, CajonCierre } from "./components/Cajones";
import { CtaContacto } from "./components/CtaContacto";
import { ConsentBanner } from "./components/ConsentBanner";
import { DiagnosticoAuxilio } from "./components/DiagnosticoAuxilio";
import { EnlaceInstagram } from "./components/Instagram";
import { initialiseAnalytics } from "./lib/analytics";
import { captureAttribution, withCampaignReference } from "./lib/attribution";

const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL?.trim() || "https://lorman-lab.vercel.app";
const WHATSAPP = "34640828654";
captureAttribution();
initialiseAnalytics();
const WHATSAPP_MESSAGE = withCampaignReference("Hola Academia LORMAN, quiero información sobre los tests de Auxilio Judicial C2.");
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL?.trim() || `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Inventario editorial conservado para trazabilidad del aula, no se muestra como contenido público.
const MOODLE_URL = "https://aula.academialorman.es/course/view.php?id=11";
const TOPICS = ["Organización judicial", "Procedimientos", "Actos de comunicación"];
void MOODLE_URL;
void TOPICS;

function App() {
  return (
    <>
      <a className="lm-skip-link" href="#contenido">Saltar al contenido</a>
      <main className="lm-page lm-aux" id="contenido">
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación de Auxilio Judicial"><a className="lm-nav-back" href={PORTFOLIO_URL}>← Cursos</a><a className="lm-nav-material" href="#tests">Qué incluye</a><EnlaceInstagram size={12} /></nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Auxilio Judicial 2026 · examen 3 de octubre · solo tests</p>
          <h1>Practica todo el programa.<br />Llega a octubre con varios repasos.</h1>
          <p className="lm-lead">Cuestionarios autocorregibles que cubren los 26 temas de Auxilio Judicial. Practica por bloques, detecta fallos y repite justo lo que más te cuesta. Pago único de 29 € y acceso hasta el examen. Es un curso de tests: no incluye temario teórico.</p>
          <CtaContacto
            whatsapp={WHATSAPP}
            label="Preguntar por el acceso"
            message="Hola, quiero consultar el acceso a los tests de Auxilio Judicial C2."
          >
            <a className="lm-btn lm-btn-outline" href="#prueba">Hacer el test gratis</a>
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

        <section className="lm-shell lm-boxes" id="tests" aria-label="Contenido de práctica del aula">
          <Cajon kicker="01 · COBERTURA" title="Los 26 temas, cubiertos con tests" text="Preguntas de organización judicial, procedimientos y actos de comunicación. No incluye el desarrollo teórico de los temas." figure="programa cubierto" />
          <Cajon kicker="02 · PRÁCTICA" title="Entrena desde varios ángulos" text="Cuestionarios por tema, repasos, supuestos prácticos, simulacros y modelos de examen para dar nuevas vueltas al programa." figure="práctica variada" />
          <Cajon kicker="03 · CORRECCIÓN" title="Corrige y sigue" text="Comprueba aciertos, errores y la respuesta correcta al terminar cada test." figure="respuesta al momento" />
          <CajonCierre kicker="04 · ACCESO" title="Todo el banco por 29 €" text="Pago único y acceso hasta el examen. Curso de tests; no incluye temario teórico." href={WHATSAPP_URL} label="Consultar acceso" />
        </section>

        <DiagnosticoAuxilio />

        <section className="lm-shell lm-seo-copy" aria-labelledby="preparar-auxilio">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Recta final</p>
            <h2 id="preparar-auxilio">Tests de Auxilio Judicial para practicar hasta el examen.</h2>
          </div>
          <div>
            <p>El acceso libre de Auxilio Judicial de la convocatoria vigente tiene el examen señalado para el <strong>3 de octubre de 2026</strong>. Esta aula está pensada para quien ya estudia el programa y necesita comprobar si reconoce la respuesta correcta con rapidez.</p>
            <p>No vendemos un temario teórico. Vendemos práctica: cuestionarios por temas, repasos, supuestos, simulacros y modelos de examen, con corrección inmediata para que puedas dar más vueltas al programa sin depender de un horario.</p>
          </div>
        </section>

        <section className="lm-shell lm-faq lm-aux-faq" aria-labelledby="preguntas-frecuentes">
          <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
          <div>
            <details><summary>¿La prueba gratuita es un examen oficial?</summary><p>No. Son 20 preguntas originales de Academia LORMAN basadas en legislación consolidada y diseñadas como diagnóstico. Los exámenes y textos oficiales siempre prevalecen.</p></details>
            <details><summary>¿El curso incluye temario teórico?</summary><p>No. Los 26 temas están cubiertos mediante tests y práctica, pero no se entrega su desarrollo teórico. Es adecuado si ya estudias con tus apuntes o temario.</p></details>
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
