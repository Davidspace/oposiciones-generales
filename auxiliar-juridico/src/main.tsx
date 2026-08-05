import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { AvisoComun, AVISO_JUSTICIA } from "./components/AvisoComun";
import { Cajon, CajonCierre } from "./components/Cajones";
import { CtaContacto } from "./components/CtaContacto";
import { EnlaceInstagram } from "./components/Instagram";
import { MuestraMaterial } from "./components/MuestraMaterial";

const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL?.trim() || "https://lorman-lab.vercel.app";
const WHATSAPP = "34640828654";
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL?.trim() || `https://wa.me/${WHATSAPP}?text=Hola%20Academia%20LORMAN%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20tests%20de%20Auxilio%20Judicial%20C2.`;

// Inventario editorial conservado para trazabilidad del aula, no se muestra como contenido público.
const MOODLE_URL = "https://aula.academialorman.es/course/view.php?id=11";
const MODULES = [{ value: "53", title: "Cuestionarios por tema" }, { value: "90", title: "Cuestionarios distintos" }];
const TOPICS = ["Organización judicial", "Procedimientos", "Actos de comunicación"];
void MOODLE_URL;
void MODULES;
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
          <p className="lm-eyebrow"><i aria-hidden="true" /> Justicia · subgrupo C2</p>
          <h1>Auxilio Judicial</h1>
          <p className="lm-lead">Práctica de tests para el Cuerpo de Auxilio Judicial: 26 temas cubiertos y 90 cuestionarios distintos con corrección automática. No incluye temario.</p>
          <CtaContacto
            whatsapp={WHATSAPP}
            note=""
          >
            <a className="lm-btn lm-btn-outline" href="#tests">Qué incluye</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-boxes" id="tests" aria-label="Inventario del aula">
          <Cajon kicker="01 · COBERTURA" title="Cuestionarios por tema" text="Organización judicial, procedimientos y actos de comunicación." figure="26 temas" />
          <Cajon kicker="02 · PRÁCTICA" title="Volumen para repetir" text="Suficientes cuestionarios para varias vueltas al programa." figure="90 cuestionarios distintos" />
          <Cajon kicker="03 · CORRECCIÓN" title="Automática y al momento" text="Aciertos, errores y respuesta correcta al terminar cada test." figure="solo tests · sin temario" />
          <CajonCierre kicker="04 · ACCESO" title="Pregunta por el acceso" text="Te confirmamos contenido, precio y duración antes de nada." href={WHATSAPP_URL} />
        </section>

        <MuestraMaterial
          titulo="Muestra del material"
          intro="Preguntas de ejemplo para que veas el formato de los tests antes de decidir."
          etiquetaDerecha="Tests · preguntas"
          mostrarTemario={false}
          grupos={[]}
          preguntas={[
            { enunciado: "¿Cuál de estos órganos forma parte de la organización judicial?", opciones: ["Un Juzgado de Primera Instancia", "El Consejo de Ministros", "Una Delegación del Gobierno", "Un Ayuntamiento"], respuesta: "a", explicacion: "Ejemplo editorial: un Juzgado de Primera Instancia es un órgano judicial." },
            { enunciado: "¿Qué medio pone una resolución judicial en conocimiento de una parte?", opciones: ["Un acto de comunicación", "Un informe pericial", "Una prueba documental", "Una norma reglamentaria"], respuesta: "a", explicacion: "Los actos de comunicación transmiten resoluciones y actuaciones a sus destinatarios." },
            { enunciado: "¿Qué finalidad tiene una notificación dentro de un procedimiento?", opciones: ["Poner una resolución en conocimiento de su destinatario", "Dictar una sentencia", "Practicar una prueba", "Ejecutar directamente una pena"], respuesta: "a", explicacion: "La notificación comunica formalmente una resolución o actuación a su destinatario." },
            { enunciado: "La ejecución de una resolución judicial tiene como finalidad:", opciones: ["Hacer efectivo lo resuelto", "Modificar siempre la sentencia", "Sustituir al órgano judicial", "Evitar cualquier actuación de las partes"], respuesta: "a", explicacion: "La ejecución hace efectivo el contenido de una resolución cuando procede." },
            { enunciado: "En el proceso civil, la demanda inicia normalmente:", opciones: ["Un procedimiento declarativo", "Una sanción administrativa", "Una inscripción registral automática", "Un recurso de casación"], respuesta: "a", explicacion: "La demanda es el acto que inicia normalmente un proceso civil declarativo." },
          ]}
          notaPreguntas="Preguntas de ejemplo; el banco de tests completo está en el campus."
        />
        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "WhatsApp", href: WHATSAPP_URL }]} notice={AVISO_JUSTICIA} />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
