import { useEffect } from "react";
import { trackLabEvent } from "@/lib/lab-analytics";
import { PRODUCT_URLS } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";
import { FichaCurso } from "@/components/FichaCurso";
import { CtaContacto } from "@/components/CtaContacto";
import { EnlaceInstagram } from "@/components/Instagram";
import { CURSO_C2, CURSOS, MOSTRAR_C2, WHATSAPP } from "@/data/cursos";

const TCAE_URL = CURSOS.find((course) => course.code === "TCAE")?.cta.href || "/tcae";
const FICHAS = MOSTRAR_C2
  ? [...CURSOS, { ...CURSO_C2, cta: { ...CURSO_C2.cta, href: PRODUCT_URLS.c2 } }]
  : CURSOS;

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
          <nav className="lm-nav" aria-label="Navegación principal">
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
            <a className="lm-btn lm-btn-primary" href={`https://wa.me/${WHATSAPP}?text=Hola%20Academia%20LORMAN%2C%20quiero%20hacer%20una%20consulta.`} target="_blank" rel="noopener noreferrer">
              <img className="lm-btn-mark" src="/lorman-logo.png" alt="" />
              <span>Preguntar por WhatsApp</span>
            </a>
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
