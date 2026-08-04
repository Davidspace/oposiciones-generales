import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { AvisoComun, AVISO_JUSTICIA } from "./components/AvisoComun";
import { Cajon, CajonCierre, Cajones } from "./components/Cajones";
import { CtaContacto } from "./components/CtaContacto";

const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL?.trim() || "https://lorman-lab.vercel.app";
const MOODLE_URL = import.meta.env.VITE_MOODLE_URL?.trim() || "https://aula.academialorman.es/course/view.php?id=11";
const WHATSAPP = "34640828654";
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL?.trim() || `https://wa.me/${WHATSAPP}?text=Hola%20Academia%20LORMAN%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20tests%20de%20Auxilio%20Judicial%20C2.`;
const MODULES = [{ value: "53", title: "Autoevaluaciones por tema" }, { value: "90", title: "Cuestionarios únicos" }];

const TOPICS = [
  "Constitución Española, Corona, Cortes y Tribunal Constitucional",
  "Igualdad, no discriminación y violencia de género",
  "Gobierno, Administración y organización administrativa",
  "Organización territorial del Estado y Administración local",
  "Unión Europea: competencias e instituciones",
  "Poder Judicial, CGPJ y Ministerio Fiscal",
  "Tribunal Supremo, Audiencia Nacional, TSJ y Audiencias Provinciales",
  "Tribunales de Instancia y Oficinas de Justicia municipales",
  "Derechos de la ciudadanía ante la Justicia y justicia gratuita",
  "Oficina judicial, expediente digital y protección de datos",
  "Letrados de la Administración de Justicia",
  "Cuerpos de funcionarios al servicio de la Administración de Justicia",
  "Cuerpos Generales I",
  "Cuerpos Generales II",
  "Libertad sindical, huelga y prevención de riesgos",
  "Procesos declarativos civiles, MASC y jurisdicción voluntaria",
  "Ejecución civil, medidas cautelares y embargo",
  "Procedimientos penales y juicios rápidos",
  "Procedimiento contencioso-administrativo",
  "Proceso laboral",
  "Actos procesales: lugar, tiempo, forma y nulidad",
  "Resoluciones judiciales y resoluciones de los LAJ",
  "Cooperación y auxilio judicial",
  "Actos de comunicación y nuevas tecnologías",
  "Registro Civil",
  "Archivo y documentación judicial",
] as const;

const GROUPS = [
  ["01—05", "Base institucional", TOPICS.slice(0, 5)],
  ["06—12", "Organización judicial", TOPICS.slice(5, 12)],
  ["13—15", "Cuerpos y relación de servicio", TOPICS.slice(12, 15)],
  ["16—20", "Procesos", TOPICS.slice(15, 20)],
  ["21—26", "Actuaciones y documentación", TOPICS.slice(20)],
] as const;

function App() {
  return (
    <>
      <a className="lm-skip-link" href="#contenido">Saltar al contenido</a>
      <main className="lm-page lm-aux" id="contenido">
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación de Auxilio Judicial"><a className="lm-nav-back" href={PORTFOLIO_URL}>Todos los cursos</a><a href="#alcance">Alcance</a><a href="#temario">26 temas</a><a href="#acceso">Acceso</a></nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Oposiciones de Justicia · subgrupo C2</p>
          <h1>Auxilio Judicial.<br />Solo práctica.</h1>
          <p className="lm-lead">Un aula de tests autocorregibles para convertir los 26 temas de Auxilio Judicial en sesiones concretas: responde, revisa el error y repite.</p>
          <CtaContacto whatsapp={WHATSAPP} label="Solicitar acceso" note="Moodle · tests autocorregibles · sin temario escrito">
            <a className="lm-btn lm-btn-outline" href="#alcance">Ver qué incluye</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-boxes" id="alcance" aria-label="Inventario del aula">
          <Cajon kicker="01 · COBERTURA" title="26 temas" text="Los bloques del programa están organizados por secciones dentro del aula." figure="Temario de referencia" />
          <Cajon kicker="02 · PRÁCTICA" title="90 cuestionarios" text="Autoevaluaciones por tema, repasos transversales y casos prácticos para aplicar la materia." figure="Resultado dentro de Moodle" />
          <Cajon kicker="03 · MODELOS" title="5 oficiales" text="Cuestionarios del bloque de exámenes oficiales disponible en el aula." figure="Repaso con fuentes" />
          <CajonCierre kicker="04 · ACCESO" title="Solo tests" text="No incluye temario escrito, clases ni corrección individual. Su función es darte práctica repetible." href={WHATSAPP_URL} label="Quiero apuntarme" />
        </section>

        <section className="lm-shell lm-panel" id="acceso">
          <span className="lm-panel-kicker">Cómo está organizado</span>
          <div className="lm-panel-row"><strong>53 autoevaluaciones</strong><span>Practica después de estudiar cada bloque.</span></div>
          <div className="lm-panel-row"><strong>18 repasos transversales</strong><span>Cruza plazos, recursos, comunicaciones y bancos generales.</span></div>
          <div className="lm-panel-row"><strong>10 supuestos prácticos</strong><span>Cuestionarios para aplicar la materia a situaciones procesales.</span></div>
          <div className="lm-panel-row"><strong>4 simulacros</strong><span>Dos recorridos con primer ejercicio teórico y segundo ejercicio práctico.</span></div>
        </section>

        <section className="lm-shell" id="temario">
          <div className="lm-section-heading"><p className="lm-eyebrow"><i aria-hidden="true" /> Cobertura</p><h2 className="lm-display">Los 26 temas<br />del aula.</h2><p className="lm-lead">Estos son los nombres de las secciones observadas en Moodle. El detalle y los cuestionarios están dentro del curso.</p></div>
          <div className="lm-topic-grid">{GROUPS.map(([range, label, topics]) => <article className="lm-topic-group" key={label}><div className="lm-topic-head"><span>{range}</span><strong>{label}</strong></div><ol>{topics.map((topic) => <li key={topic}>{topic}</li>)}</ol></article>)}</div>
        </section>

        <section className="lm-shell lm-boxes">
          <Cajon kicker="ENCAJA SI…" title="Ya tienes teoría" text="Buscas autocorrección y repetición para consolidar la materia." figure="Autoestudio" />
          <Cajon kicker="NO ES…" title="Una academia completa" text="No sustituye un temario, una clase en directo ni una tutoría individual." figure="Alcance declarado" />
          <CajonCierre kicker="SIGUIENTE PASO" title="Entrar en el aula" text="Escribe para conocer el precio, duración y condiciones de acceso vigentes antes de activarlo." href={MOODLE_URL} label="Abrir Moodle" />
        </section>

        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "26 temas", href: "#temario" }, { label: "Aula Moodle", href: MOODLE_URL }]} notice={AVISO_JUSTICIA} />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
