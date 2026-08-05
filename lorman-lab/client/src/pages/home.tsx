import { useEffect } from "react";
import { trackLabEvent } from "@/lib/lab-analytics";
import { PRODUCT_URLS } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";
import { FichaCurso } from "@/components/FichaCurso";
import { CtaContacto } from "@/components/CtaContacto";
import { EnlaceInstagram } from "@/components/Instagram";
import { CURSO_C2, CURSOS, MOSTRAR_C2, WHATSAPP } from "@/data/cursos";

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
              <h1>Elige tu oposición<br />y empieza a estudiar.</h1>
              <p className="lm-lead">Material claro, tests y simulacros para avanzar a tu ritmo. ¿Tienes dudas? Escríbenos y lo vemos contigo.</p>
              <CtaContacto
                whatsapp={WHATSAPP}
                label="Hablar por WhatsApp"
                message="Hola, estoy mirando una oposición en Academia LORMAN y quiero saber qué curso me encaja."
              >
                <a className="lm-btn lm-btn-outline" href="#cursos">Ver los cursos</a>
              </CtaContacto>
            </div>
            <aside className="lm-hero-aside" aria-label="Qué encontrarás">
              <span className="lm-hero-aside-kicker">Qué encontrarás</span>
              <div className="lm-hero-aside-row"><strong>Temario</strong><span>listo para estudiar</span></div>
              <div className="lm-hero-aside-row"><strong>Tests</strong><span>con respuesta explicada</span></div>
              <div className="lm-hero-aside-row"><strong>Simulacros</strong><span>para medirte al momento</span></div>
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
            <details><summary>¿Qué incluye cada curso?</summary><p>Cada ficha resume el temario, la práctica, el precio y las condiciones de acceso del curso.</p></details>
            <details><summary>¿Puedo estudiar sin clases semanales?</summary><p>Sí. El modelo prioriza estudio flexible, práctica y corrección inmediata. Si necesitas ayuda, puedes escribirnos.</p></details>
            <details><summary>¿Cómo recibo el acceso?</summary><p>Te confirmamos por WhatsApp el contenido, el precio y los pasos de acceso antes de cualquier pago.</p></details>
            <details><summary>¿Es una academia oficial?</summary><p>No. Academia LORMAN es un proyecto educativo independiente. La convocatoria vigente siempre tiene prioridad.</p></details>
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
