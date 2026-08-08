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
          <p className="lm-eyebrow"><i aria-hidden="true" /> Auxilio Judicial · subgrupo C2 · solo tests</p>
          <h1>Practica todo el programa.<br />Corrige al momento.</h1>
          <p className="lm-lead">Cuestionarios autocorregibles que cubren los 26 temas del programa oficial. Practica por bloques, repite lo que más te cuesta y descubre qué debes repasar. Es un curso de tests: no incluye temario teórico.</p>
          <CtaContacto
            whatsapp={WHATSAPP}
            label="Preguntar por el acceso"
            message="Hola, quiero consultar el acceso a los tests de Auxilio Judicial C2."
          >
            <a className="lm-btn lm-btn-outline" href="#tests">Qué incluye</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-boxes" id="tests" aria-label="Contenido de práctica del aula">
          <Cajon kicker="01 · COBERTURA" title="Los 26 temas, cubiertos con tests" text="Preguntas de organización judicial, procedimientos y actos de comunicación. No incluye el desarrollo teórico de los temas." figure="programa cubierto" />
          <Cajon kicker="02 · PRÁCTICA" title="Entrena desde varios ángulos" text="Cuestionarios por tema, repasos, supuestos prácticos, simulacros y modelos de examen para dar nuevas vueltas al programa." figure="práctica variada" />
          <Cajon kicker="03 · CORRECCIÓN" title="Corrige y sigue" text="Comprueba aciertos, errores y la respuesta correcta al terminar cada test." figure="respuesta al momento" />
          <CajonCierre kicker="04 · ACCESO" title="Todo el banco por 29 €" text="Pago único y acceso hasta el examen. Curso de tests; no incluye temario teórico." href={WHATSAPP_URL} label="Consultar acceso" />
        </section>

        <MuestraMaterial
          titulo="Prueba cómo se estudia"
          intro="Resuelve cinco preguntas y comprueba la corrección antes de decidir."
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
          notaPreguntas="Preguntas propias con explicación. En el aula encontrarás el banco completo del curso, organizado para practicar y repasar."
        />
        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "WhatsApp", href: WHATSAPP_URL }]} notice={AVISO_JUSTICIA} />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
