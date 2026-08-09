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
const WHATSAPP_MESSAGE = withCampaignReference("Hola Academia LORMAN, quiero acceder a los tests de Auxilio Judicial por 29 €.");
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
          <p className="lm-eyebrow"><i aria-hidden="true" /> Recta final · examen 3 de octubre · solo tests</p>
          <h1>Deja de dar vueltas.<br />Ve al test.</h1>
          <p className="lm-lead">Ya tienes temario. Ahora toca responder, corregir fallos y repetir. Practica los 26 temas hasta el examen por <strong>29 € en un único pago</strong>. Solo tests: no incluye temario teórico.</p>
          <CtaContacto
            whatsapp={WHATSAPP}
            label="Quiero los tests por 29 €"
            message="Hola Academia LORMAN, quiero acceder a los tests de Auxilio Judicial por 29 €."
          >
            <a className="lm-btn lm-btn-outline" href="#prueba">Probar 20 preguntas</a>
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
          <Cajon kicker="01 · COBERTURA" title="Practica los 26 temas" text="Preguntas de organización judicial, procedimientos y actos de comunicación. Sin añadirte otro temario que estudiar." figure="programa cubierto" />
          <Cajon kicker="02 · REPASO" title="Da más vueltas al programa" text="Cuestionarios por tema, repasos, supuestos prácticos, simulacros y modelos de examen para practicar sin parar." figure="práctica variada" />
          <Cajon kicker="03 · CORRECCIÓN" title="Falla, corrige y repite" text="Comprueba aciertos, errores y la respuesta correcta al terminar cada test. Repasa justo donde fallas." figure="respuesta al momento" />
          <CajonCierre kicker="04 · ACCESO" title="29 € hasta el examen" text="Un único pago. Solo tests autocorregibles; no incluye temario teórico." href={WHATSAPP_URL} label="Quiero acceder" />
        </section>

        <DiagnosticoAuxilio />

        <section className="lm-shell lm-seo-copy" aria-labelledby="preparar-auxilio">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Recta final</p>
            <h2 id="preparar-auxilio">Queda poco. Haz tests.</h2>
          </div>
          <div>
            <p>El examen de acceso libre de Auxilio Judicial es el <strong>3 de octubre de 2026</strong>. Si ya estudias el programa, no necesitas empezar otro temario: necesitas responder, detectar fallos y volver a intentarlo.</p>
            <p>Practica con cuestionarios por temas, repasos, supuestos, simulacros y modelos de examen. Corrige al momento y da más vueltas al programa sin clases, horarios ni permanencia.</p>
          </div>
        </section>

        <section className="lm-shell lm-faq lm-aux-faq" aria-labelledby="preguntas-frecuentes">
          <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
          <div>
            <details><summary>¿La prueba gratuita es un examen oficial?</summary><p>No. Es una muestra diagnóstica parcial con 20 preguntas originales de Academia LORMAN sobre cuatro áreas concretas del programa. Está basada en legislación consolidada, pero no evalúa los 26 temas ni sustituye un simulacro completo. Los exámenes y textos oficiales siempre prevalecen.</p></details>
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
