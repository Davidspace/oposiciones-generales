import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL?.trim() || "https://lorman-lab.vercel.app";
const MOODLE_URL = import.meta.env.VITE_MOODLE_URL?.trim() || "https://aula.academialorman.es/course/view.php?id=11";
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL?.trim() || "https://wa.me/34640828654?text=Hola%20Academia%20LORMAN%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20tests%20de%20Auxilio%20Judicial%20C2.";

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

const TOPIC_GROUPS = [
  { label: "Base institucional", range: "01—05", topics: TOPICS.slice(0, 5) },
  { label: "Organización judicial", range: "06—12", topics: TOPICS.slice(5, 12) },
  { label: "Cuerpos y relación de servicio", range: "13—15", topics: TOPICS.slice(12, 15) },
  { label: "Procesos", range: "16—20", topics: TOPICS.slice(15, 20) },
  { label: "Actuaciones y documentación", range: "21—26", topics: TOPICS.slice(20) },
] as const;

const MODULES = [
  { value: "53", title: "Autoevaluaciones por tema", text: "Practica después de estudiar cada bloque." },
  { value: "18", title: "Repasos y tests transversales", text: "Cruza plazos, recursos, comunicaciones y bancos generales." },
  { value: "10", title: "Supuestos prácticos", text: "Cuestionarios para aplicar la materia a situaciones procesales." },
  { value: "4", title: "Simulacros", text: "Dos recorridos con primer ejercicio teórico y segundo ejercicio práctico." },
  { value: "5", title: "Modelos oficiales", text: "Cuestionarios del bloque de exámenes oficiales disponible en el aula." },
] as const;

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>;
}

function App() {
  return (
    <div className="aj-page">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Academia LORMAN, inicio">
          <span className="brand-mark">L</span>
          <span><strong>Academia LORMAN</strong><small>Tests · Justicia</small></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#alcance">Alcance</a>
          <a href="#temario">26 temas</a>
          <a href="#acceso" className="nav-cta">Ver acceso <Arrow /></a>
        </nav>
      </header>

      <main id="contenido" tabIndex={-1}>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> OPOSICIONES DE JUSTICIA · SUBGRUPO C2</p>
            <h1>Auxilio Judicial.<em>Solo práctica.</em></h1>
            <p className="hero-lead">Un aula de tests autocorregibles para convertir los 26 temas de Auxilio Judicial en sesiones concretas: responde, revisa el error y repite.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Solicitar acceso <Arrow /></a>
              <a className="text-link" href="#alcance">Ver qué incluye</a>
            </div>
            <p className="hero-note">Curso de autoevaluación alojado en Moodle. No incluye temario escrito, clases ni corrección individual.</p>
          </div>

          <div className="hero-sheet" aria-label="Ficha de cobertura del aula">
            <div className="sheet-top"><span>AJ / C2</span><span>MOODLE · CURSO 11</span></div>
            <div className="sheet-title"><span>CURSO COMPLETO DE AUTOEVALUACIÓN</span><strong>Un banco de práctica.<br />Una señal después de cada intento.</strong></div>
            <div className="sheet-grid">
              <div><b>26</b><span>temas del aula</span></div>
              <div><b>90</b><span>cuestionarios únicos</span></div>
              <div><b>∞</b><span>repeticiones a tu ritmo</span></div>
            </div>
            <div className="sheet-footer"><span className="check" /> <span>Respuesta y resultado dentro de Moodle</span></div>
            <span className="sheet-tag sheet-tag-one">TESTS</span>
            <span className="sheet-tag sheet-tag-two">C2</span>
          </div>
        </section>

        <section className="facts" id="alcance" aria-labelledby="alcance-title">
          <div className="section-label">Inventario visible del aula</div>
          <div className="facts-grid">
            <div><strong>26</strong><span>temas organizados por secciones</span></div>
            <div><strong>90</strong><span>cuestionarios únicos auditados</span></div>
            <div><strong>5</strong><span>modelos de examen oficial</span></div>
            <div><strong>solo</strong><span>tests y autocorrección</span></div>
          </div>
          <p className="source-note">Cifras comprobadas en el curso de Moodle «Auxilio Judicial - Curso completo de autoevaluación» el 3 de agosto de 2026. El aula y la convocatoria vigente tienen prioridad.</p>
        </section>

        <section className="modules section-wrap" aria-labelledby="modules-title">
          <div className="section-heading">
            <div><p className="section-label">Qué encontrarás</p><h2 id="modules-title">Practica por capas.<br /><em>Sin mezclarlo todo.</em></h2></div>
            <p>El curso no intenta sustituir un temario. Su función es darte suficientes intentos autocorregibles para detectar qué necesitas volver a estudiar.</p>
          </div>
          <div className="module-grid">
            {MODULES.map((module, index) => <article className="module-card" key={module.title}><span className="module-number">{String(index + 1).padStart(2, "0")}</span><strong>{module.value}</strong><h3>{module.title}</h3><p>{module.text}</p></article>)}
          </div>
        </section>

        <section className="method" aria-labelledby="method-title">
          <div className="method-inner section-wrap">
            <div><p className="section-label section-label-light">La rutina</p><h2 id="method-title">Estudia.<br /><span>Responde.</span><br />Repite.</h2></div>
            <div className="method-copy"><p>El valor está en cerrar el ciclo rápido. Abres una sección, completas el cuestionario, lees la corrección y vuelves al bloque que te ha hecho fallar.</p><div className="method-steps"><div><b>01</b><strong>Elige</strong><span>Un tema, un repaso o un simulacro.</span></div><div><b>02</b><strong>Responde</strong><span>Trabaja sin horario semanal obligatorio.</span></div><div><b>03</b><strong>Revisa</strong><span>Usa el resultado para decidir el siguiente intento.</span></div></div></div>
          </div>
        </section>

        <section className="topics section-wrap" id="temario" aria-labelledby="topics-title">
          <div className="section-heading"><div><p className="section-label">Cobertura</p><h2 id="topics-title">Los 26 temas<br /><em>del aula.</em></h2></div><p>Estos son los nombres de las secciones observadas en Moodle. La landing los resume; el detalle y los cuestionarios están dentro del curso.</p></div>
          <div className="topic-groups">
            {TOPIC_GROUPS.map((group) => <article className="topic-group" key={group.label}><div className="topic-group-head"><span>{group.range}</span><strong>{group.label}</strong></div><ol>{group.topics.map((topic) => <li key={topic}>{topic}</li>)}</ol></article>)}
          </div>
        </section>

        <section className="fit section-wrap" aria-labelledby="fit-title">
          <div><p className="section-label">Encaja si...</p><h2 id="fit-title">Quieres practicar<br /><em>sin otra clase.</em></h2></div>
          <div className="fit-list"><div><span className="fit-mark fit-yes">+</span><p>Necesitas autocorrección y repetición para consolidar la materia.</p></div><div><span className="fit-mark fit-yes">+</span><p>Ya tienes el temario o una academia y buscas más práctica.</p></div><div><span className="fit-mark fit-no">−</span><p>Buscas temario completo, clases en directo o una tutoría individual.</p></div><div><span className="fit-mark fit-no">−</span><p>Esperas una página oficial o una garantía de resultado.</p></div></div>
        </section>

        <section className="access" id="acceso" aria-labelledby="access-title">
          <div><p className="section-label section-label-light">Acceso</p><h2 id="access-title">Elige cómo<br /><span>empezar.</span></h2></div>
          <div className="access-copy"><p>El contenido vive en el aula Moodle. Si ya tienes acceso, entra directamente al curso. Si todavía no lo tienes, escríbenos y te indicaremos las condiciones de acceso vigentes.</p><div className="access-actions"><a className="button button-primary" href={MOODLE_URL} target="_blank" rel="noreferrer">Entrar en el aula <Arrow /></a><a className="button button-light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Solicitar información <Arrow /></a></div><p className="access-note">El precio, la duración y las condiciones se confirman antes de activar el acceso. No mostramos cifras no verificadas.</p></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main"><div><a className="footer-brand" href={PORTFOLIO_URL}><span className="brand-mark">L</span><strong>Academia LORMAN</strong></a><p>Preparación digital independiente para oposiciones.</p></div><div className="footer-links"><a href={PORTFOLIO_URL}>Todos los cursos <Arrow /></a><a href="#temario">26 temas</a><a href={MOODLE_URL} target="_blank" rel="noreferrer">Aula Moodle <Arrow /></a></div></div>
        <div className="footer-notice"><strong>AVISO</strong><p>Academia LORMAN no es una página oficial de la Administración de Justicia. La convocatoria y las fuentes oficiales tienen prioridad. Esta página describe un curso de tests; no promete aprobado ni sustituye el temario.</p></div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
