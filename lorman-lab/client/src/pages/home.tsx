import { useEffect } from "react";
import { trackLabEvent } from "@/lib/lab-analytics";
import { PRODUCT_URLS } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";
import { FichaCurso, type FichaCursoProps } from "@/components/FichaCurso";
import { CtaContacto } from "@/components/CtaContacto";
import { EnlaceInstagram } from "@/components/Instagram";

const TCAE_URL = import.meta.env.VITE_TCAE_URL?.trim() || "https://lorman-academia.vercel.app/";
const C2_SAMPLE_URL = PRODUCT_URLS.c2;
const WHATSAPP = "34640828654";

const COURSES: FichaCursoProps[] = [
  {
    code: "TCAE",
    tone: "tcae",
    title: "Cuidados Auxiliares de Enfermería",
    meta: "Servicios de salud · turno libre",
    items: [
      { title: "Temario por bloques", note: "con resúmenes y esquemas" },
      { title: "Tests por tema", note: "respuesta razonada" },
      { title: "Simulacros tipo examen", note: "y repaso general autocorregible" },
    ],
    cta: { label: "Ver curso TCAE", href: TCAE_URL },
  },
  {
    code: "TAI",
    tone: "tai",
    title: "Técnico Auxiliar de Informática",
    meta: "Estado · subgrupo C1",
    items: [
      { title: "Temario completo", note: "33 temas" },
      { title: "Tests y autoevaluaciones", note: "muchos más que temas" },
      { title: "Simulacros y prácticos", note: "las dos partes del ejercicio" },
    ],
    price: { title: "Pago único", note: "acceso hasta el examen", value: "95 €" },
    cta: { label: "Ver curso TAI", href: PRODUCT_URLS.tai },
  },
  {
    code: "SS",
    tone: "ss",
    title: "Administrativo Seguridad Social",
    meta: "Subgrupo C1 · acceso libre",
    items: [
      { title: "Temario general y específico", note: "36 temas redactados" },
      { title: "Tests por tema", note: "con normativa citada" },
      { title: "Supuestos prácticos", note: "como en el ejercicio" },
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
        <header className="lm-shell lm-header lm-preview-host">
          <nav className="lm-preview-nav" aria-label="Navegación de la maqueta">
            <span>MAQUETA</span>
            <a className="is-active" href="#inicio">HUB</a>
            <a href={TCAE_URL}>TCAE</a>
            <a href={PRODUCT_URLS.tai}>TAI</a>
            <a href={PRODUCT_URLS.ss}>SS</a>
            <a href={PRODUCT_URLS.auxJuridico}>AUX. JUDICIAL</a>
          </nav>
        </header>

        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio">
            <img src="/lorman-logo.png" alt="Academia LORMAN" />
          </a>
          <nav className="lm-nav" aria-label="NavegaciÃ³n principal">
            <a href="#cursos">Cursos</a>
            <a href="#preguntas">Preguntas</a>
            <EnlaceInstagram size={17} />
          </nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <div className="lm-hero-grid">
            <div>
              <p className="lm-eyebrow"><i aria-hidden="true" /> Oposiciones online</p>
              <h1>Elige tu oposición<br />y pregúntanos.</h1>
              <p className="lm-lead">Temario, tests y simulacros para estudiar por tu cuenta. Escríbenos y te decimos en un minuto si te encaja.</p>
              <CtaContacto
                whatsapp={WHATSAPP}
                message="Hola Academia LORMAN, quiero saber qué curso me encaja."
              >
                <a className="lm-btn lm-btn-outline" href="#cursos">Ver los cursos</a>
              </CtaContacto>
            </div>
            <aside className="lm-hero-aside" aria-label="Así se estudia">
              <span className="lm-hero-aside-kicker">Así se estudia</span>
              <div className="lm-hero-aside-row"><strong>Temario</strong><span>redactado y ordenado por temas</span></div>
              <div className="lm-hero-aside-row"><strong>Tests</strong><span>autoevaluaciones con explicación</span></div>
              <div className="lm-hero-aside-row"><strong>Simulacros</strong><span>teóricos y prácticos, autocorregibles</span></div>
            </aside>
          </div>
        </section>

        <section className="lm-shell" id="cursos">
          <div className="lm-section-heading"><h2 className="lm-display">Cursos</h2></div>
          <div className="lm-cards">
            {FICHAS.map((course) => (
              <div key={course.code} onClick={() => trackLabEvent("course_click", course.code)}>
                <FichaCurso {...course} />
              </div>
            ))}
          </div>
        </section>

        <section className="lm-shell lm-faq" id="preguntas" aria-labelledby="faq-title">
          <div className="lm-faq-intro">
            <h2 id="faq-title" className="lm-display">Preguntas</h2>
            <a className="lm-btn lm-btn-primary" href={`https://wa.me/${WHATSAPP}?text=Hola%20Academia%20LORMAN%2C%20quiero%20hacer%20una%20consulta.`} target="_blank" rel="noopener noreferrer">Preguntar por WhatsApp</a>
          </div>
          <div className="lm-faq-list">
            <details><summary>¿Es una página oficial?</summary><p>No. Academia LORMAN es una preparación digital independiente. La convocatoria vigente y sus criterios siempre tienen prioridad.</p></details>
            <details><summary>¿Hay clases o tutoría?</summary><p>El modelo prioriza autoestudio y autocorrección. Los límites de soporte se indican antes de cualquier pago.</p></details>
            <details><summary>¿Cuánto dura el acceso?</summary><p>Cada ficha declara la duración y las condiciones de acceso de su curso.</p></details>
          </div>
        </section>

        <AvisoComun
          links={[{ label: "Cursos", href: "#cursos" }, { label: "Preguntas", href: "#preguntas" }, { label: "WhatsApp", href: `https://wa.me/${WHATSAPP}` }]}
          notice={AVISO_BASE + AVISO_PRECIOS}
        />
      </main>
    </>
  );
}
