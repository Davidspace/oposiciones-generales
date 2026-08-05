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
          intro="Páginas reales del temario y preguntas de ejemplo, para que veas el formato antes de decidir."
          grupos={[{
            paginas: [{}, {}, {}, {}],
            nota: "La muestra de páginas se incorporará cuando el material editorial esté preparado.",
          }]}
          preguntas={[
            { enunciado: "Enunciado de muestra sobre organización judicial", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
            { enunciado: "Enunciado de muestra sobre actos procesales", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
            { enunciado: "Enunciado de muestra sobre actos de comunicación", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
            { enunciado: "Enunciado de muestra sobre ejecución", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
            { enunciado: "Enunciado de muestra sobre derecho procesal civil", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
          ]}
          notaPreguntas="Preguntas de ejemplo; el banco completo está en el campus."
        />
        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "WhatsApp", href: WHATSAPP_URL }]} notice={AVISO_JUSTICIA} />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
