import { useEffect } from "react";
import { trackLabEvent } from "@/lib/lab-analytics";
import { PRODUCT_URLS } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";
import { FichaCurso, type FichaCursoProps } from "@/components/FichaCurso";

const TCAE_URL = import.meta.env.VITE_TCAE_URL?.trim() || "https://lorman-academia.vercel.app/";
const C2_SAMPLE_URL = PRODUCT_URLS.c2;

const COURSES: FichaCursoProps[] = [
  {
    code: "TCAE",
    tone: "tcae",
    title: "Cuidados Auxiliares de Enfermería",
    meta: "Servicios de salud · turno libre",
    items: [
      { title: "Temario por bloques", note: "resúmenes y esquemas" },
      { title: "Tests por tema", note: "respuesta razonada" },
      { title: "Simulacros tipo examen", note: "repaso general autocorregible" },
    ],
    cta: { label: "Ver curso TCAE", href: TCAE_URL },
  },
  {
    code: "TAI",
    tone: "tai",
    title: "Técnico Auxiliar de Informática",
    meta: "Administración del Estado · subgrupo C1",
    items: [
      { title: "Temario completo", note: "33 temas en PDF" },
      { title: "Tests y autoevaluaciones", note: "una por tema, con explicación" },
      { title: "Simulacros y prácticos", note: "las dos partes del ejercicio" },
    ],
    price: { title: "Pago único", note: "acceso hasta el examen", value: "95 €" },
    cta: { label: "Ver curso TAI", href: PRODUCT_URLS.tai },
  },
  {
    code: "SS",
    tone: "ss",
    title: "Administrativo de la Seguridad Social",
    meta: "Subgrupo C1 · acceso libre",
    items: [
      { title: "Temario general y específico", note: "36 temas redactados" },
      { title: "Tests por tema", note: "con normativa citada" },
      { title: "Supuestos prácticos", note: "entrenamiento autocorregible" },
    ],
    price: { title: "Pago único", note: "acceso hasta el examen", value: "49 €" },
    cta: { label: "Ver curso SS", href: PRODUCT_URLS.ss },
  },
  {
    code: "AUX. JUDICIAL",
    tone: "aux",
    title: "Auxilio Judicial",
    meta: "Justicia · subgrupo C2 · solo tests",
    items: [
      { title: "Cuestionarios por tema", note: "26 temas cubiertos" },
      { title: "Práctica intensiva", note: "90 cuestionarios distintos" },
      { title: "Corrección automática", note: "sin temario incluido" },
    ],
    cta: { label: "Ver Auxilio Judicial", href: PRODUCT_URLS.auxJuridico },
  },
];
const FICHAS = COURSES;

export default function Home() {
  useEffect(() => {
    trackLabEvent("landing_view", "hub");
  }, []);

  return (
    <>
      <a className="hub-skip-link" href="#contenido-principal">Saltar al contenido</a>
      <main className="lm-page lm-hub" id="contenido-principal" tabIndex={-1}>
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio">
            <img src="/lorman-logo.png" alt="Academia LORMAN" />
          </a>
          <nav className="lm-nav" aria-label="Navegación principal">
            <a href="#cursos">Cursos</a>
            <a href="#metodo">Método</a>
            <a href="#preguntas">Preguntas</a>
            <a className="lm-nav-back" href="https://wa.me/34640828654" target="_blank" rel="noreferrer">Contacto</a>
          </nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Academia LORMAN · catálogo común</p>
          <h1>Una ruta clara<br />para cada oposición.</h1>
          <p className="lm-lead">Consulta el alcance real de cada aula, prueba el formato cuando esté disponible y elige solo el producto que encaja con tu preparación.</p>
          <div className="lm-actions">
            <a className="lm-btn lm-btn-primary" href="#cursos">Ver cursos</a>
            <a className="lm-btn lm-btn-outline" href="#metodo">Cómo funciona</a>
          </div>
          <p className="lm-btn-note">Autoestudio · tests · simulacros · acceso digital</p>
        </section>

        <section className="lm-shell lm-boxes" aria-label="Principios de la academia">
          <div className="lm-box"><span className="lm-box-kicker">01 · ALCANCE</span><strong className="lm-box-title">Contenido visible</strong><p>La ficha de cada curso declara sus bloques, ejercicios y estado de acceso.</p><span className="lm-box-figure">Sin cifras inventadas</span></div>
          <div className="lm-box"><span className="lm-box-kicker">02 · RUTINA</span><strong className="lm-box-title">Practica y repite</strong><p>Abre un bloque, responde, revisa el error y decide qué volver a estudiar.</p><span className="lm-box-figure">A tu ritmo</span></div>
          <div className="lm-box lm-box-solid"><span className="lm-box-kicker">03 · ACCESO</span><strong className="lm-box-title">Elige tu aula</strong><p>Entra en la landing del producto y revisa sus condiciones antes de pagar.</p><a className="lm-box-cta" href="#cursos">Ver el catálogo</a></div>
        </section>

        <section className="lm-shell" id="cursos">
          <div className="lm-section-heading"><p className="lm-eyebrow"><i aria-hidden="true" /> Cursos disponibles</p><h2 className="lm-display">Una ficha por aula.</h2><p className="lm-lead">Cada tarjeta resume el contenido actualmente preparado. El detalle, las muestras y el acceso se concretan en su propia landing.</p></div>
          <div className="lm-cards">
            {FICHAS.map((course) => (
              <div key={course.code} onClick={() => trackLabEvent("course_click", course.code)}>
                <FichaCurso {...course} />
              </div>
            ))}
          </div>
        </section>

        <section className="lm-shell lm-panel" id="metodo">
          <span className="lm-panel-kicker">La experiencia LORMAN</span>
          <div className="lm-panel-row"><strong>Explora</strong><span>Comprueba el alcance y la convocatoria que corresponde a tu cuerpo.</span></div>
          <div className="lm-panel-row"><strong>Entrena</strong><span>Practica con tests, simulacros y microcasos cuando el curso los incluye.</span></div>
          <div className="lm-panel-row"><strong>Decide</strong><span>Compra solo después de revisar el formato, el contenido y los límites de soporte.</span></div>
        </section>

        <section className="lm-shell lm-faq" id="preguntas" aria-labelledby="faq-title">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Preguntas</p>
          <h2 id="faq-title" className="lm-display">Información clara antes de elegir.</h2>
          <details><summary>¿Es una página oficial?</summary><p>No. Academia LORMAN es una preparación digital independiente. La convocatoria vigente y sus criterios siempre tienen prioridad.</p></details>
          <details><summary>¿Todos los cursos incluyen lo mismo?</summary><p>No. Cada ficha declara su propio temario, tests, simulacros, precio y estado de acceso.</p></details>
          <details><summary>¿Hay tutoría ilimitada?</summary><p>El modelo prioriza autoestudio y autocorrección. Los límites de soporte se indican antes de cualquier pago.</p></details>
        </section>

        <AvisoComun
          links={[{ label: "Cursos", href: "#cursos" }, { label: "Preguntas", href: "#preguntas" }, { label: "WhatsApp", href: "https://wa.me/34640828654" }]}
          notice={AVISO_BASE + AVISO_PRECIOS}
        />
      </main>
    </>
  );
}
