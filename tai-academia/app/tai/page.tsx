import { PORTFOLIO_URL } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";
import { Cajon, CajonCierre } from "@/components/Cajones";
import { CtaContacto } from "@/components/CtaContacto";
import { EnlaceInstagram } from "@/components/Instagram";
import { TaiDiagnostic } from "@/components/TaiDiagnostic";
import { TaiMaterialPreview } from "@/components/TaiMaterialPreview";

const WHATSAPP = "34640828654";

export default function TaiLanding() {
  return (
    <>
      <a className="tai-skip-link" href="#contenido-principal">Saltar al contenido</a>
      <main className="lm-page lm-tai" id="contenido-principal" tabIndex={-1}>
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Curso TAI, inicio"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación del curso TAI"><a className="tai-nav-home" href={PORTFOLIO_URL}>← Cursos</a><a className="lm-nav-material" href="#prueba">Prueba gratis</a><a className="lm-nav-material" href="#muestra">Muestra</a><EnlaceInstagram size={12} /></nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> TAI · Administración del Estado · subgrupo C1</p>
          <h1>Todo TAI en un aula.<br />Practica las dos partes.</h1>
          <p className="lm-lead">33 temas, autoevaluaciones y simulacros para estudiar a tu ritmo. Pago único y acceso hasta el examen.</p>
          <CtaContacto
            whatsapp={WHATSAPP}
            label="Preguntar por el acceso"
            message="Hola, quiero consultar el acceso al curso TAI C1."
          >
            <a className="lm-btn lm-btn-outline" href="#prueba" data-analytics-event="trial_cta_click" data-analytics-placement="hero">Hacer la prueba gratis</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-boxes" id="incluye" aria-label="Contenido de TAI">
          <Cajon kicker="01 · TEMARIO" title="33 temas redactados" text="Bloques I a IV en PDF, listos para estudiar y repasar." figure="33 temas" />
          <Cajon kicker="02 · TEST" title="Tests que te dicen dónde fallas" text="Practica tema a tema y vuelve directamente a lo que necesitas." figure="autoevaluaciones por tema" />
          <Cajon kicker="03 · SIMULACROS" title="Simulacros de las dos partes" text="Ensaya el formato completo con corrección automática." figure="teóricos y prácticos" />
          <CajonCierre kicker="04 · ACCESO" title="Pago único de 69 €" text="Entra al aula y estudia a tu ritmo hasta el examen." href={`https://wa.me/${WHATSAPP}?text=Hola%20Academia%20LORMAN%2C%20quiero%20consultar%20el%20acceso%20al%20curso%20TAI.`} label="Consultar acceso" />
          <p className="lm-fineprint">Estudio flexible: no necesitas clases semanales ni esperar una corrección para saber cómo vas. Ejercicio único en dos partes, 120 minutos.</p>
        </section>

        <TaiDiagnostic whatsapp={WHATSAPP} />
        <TaiMaterialPreview />

        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "WhatsApp", href: `https://wa.me/${WHATSAPP}` }]} notice={AVISO_BASE + AVISO_PRECIOS} />
      </main>
    </>
  );
}
