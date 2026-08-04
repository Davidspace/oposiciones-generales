import { AvisoComun, AVISO_SALUD } from "@/components/AvisoComun";
import { Cajon, CajonCierre } from "@/components/Cajones";
import { CtaContacto } from "@/components/CtaContacto";
import { EnlaceInstagram } from "@/components/Instagram";
import { MuestraMaterial } from "@/components/MuestraMaterial";
import { PORTFOLIO_URL } from "@/lib/portfolio-links";

const WHATSAPP = "34640828654";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Hola Academia LORMAN, quiero información sobre el material de TCAE.",
)}`;

const preguntasMuestra = [
  "Enunciado de muestra sobre organización sanitaria",
  "Enunciado de muestra sobre higiene y seguridad",
  "Enunciado de muestra sobre atención al paciente",
  "Enunciado de muestra sobre recogida de muestras",
  "Enunciado de muestra sobre prevención de riesgos",
].map((enunciado) => ({
  enunciado,
  opciones: ["Contenido de muestra visual"],
  respuesta: "—",
  explicacion: "Consulta la respuesta revisada dentro del aula.",
}));

export default function TcaeHome() {
  return (
    <>
      <a className="lm-skip-link" href="#contenido">Saltar al contenido</a>
      <main className="lm-page lm-tcae" id="contenido" tabIndex={-1}>
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio">
            <img src="/lorman-logo.png" alt="Academia LORMAN" />
          </a>
          <nav className="lm-nav" aria-label="Navegación del curso TCAE">
            <a className="lm-nav-back" href={PORTFOLIO_URL}>← Cursos</a>
            <a className="lm-nav-material" href="#muestra">Material</a>
            <EnlaceInstagram size={12} />
          </nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Servicios de salud · turno libre</p>
          <h1>Cuidados auxiliares<br />de enfermería</h1>
          <p className="lm-lead">
            Temario, resúmenes, tests por tema y simulacros tipo examen. Dinos tu servicio de salud y te decimos qué material te encaja.
          </p>
          <CtaContacto whatsapp={WHATSAPP}>
            <a className="lm-btn lm-btn-outline" href="#muestra">Ver el material</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-boxes" id="acceso" aria-label="Contenido de TCAE">
          <Cajon
            kicker="01 · TEMARIO"
            title="Temario por bloques"
            text="Con resúmenes y esquemas para repasar antes del test."
          />
          <Cajon
            kicker="02 · TEST"
            title="Tests por tema"
            text="Respuesta razonada en cada pregunta."
          />
          <Cajon
            kicker="03 · SIMULACROS"
            title="Tipo examen"
            text="Más un repaso general autocorregible de todo el temario."
          />
          <CajonCierre
            kicker="04 · ACCESO"
            title="Dinos tu servicio de salud"
            text="Te confirmamos material, precio y acceso antes de nada."
            href={WHATSAPP_URL}
          />
        </section>

        <MuestraMaterial
          titulo="Muestra del material"
          intro="Páginas reales del temario y preguntas de ejemplo, para que veas el formato antes de decidir."
          grupos={[
            {
              etiqueta: "Murcia",
              paginas: [
                { src: "/muestras/sms-1.jpeg", alt: "Página de muestra del temario SMS 1" },
                { src: "/muestras/sms-2.jpeg", alt: "Página de muestra del temario SMS 2" },
                { src: "/muestras/sms-3.jpeg", alt: "Página de muestra del temario SMS 3" },
                { src: "/muestras/sms-4.jpeg", alt: "Página de muestra del temario SMS 4" },
              ],
              nota: "Resúmenes y tablas del temario del Servicio Murciano de Salud.",
            },
            {
              etiqueta: "Andalucía",
              paginas: [
                { src: "/muestras/sas-1.jpeg", alt: "Página de muestra del temario SAS 1" },
                { src: "/muestras/sas-2.jpeg", alt: "Página de muestra del temario SAS 2" },
                { src: "/muestras/sas-3.jpeg", alt: "Página de muestra del temario SAS 3" },
                { src: "/muestras/sas-4.jpeg", alt: "Página de muestra del temario SAS 4" },
              ],
              nota: "Muestra de material para el Servicio Andaluz de Salud.",
            },
          ]}
          preguntas={preguntasMuestra}
          notaPreguntas="Preguntas de ejemplo; el banco completo está en el campus."
        />

        <AvisoComun
          links={[
            { label: "Todos los cursos", href: PORTFOLIO_URL },
            { label: "WhatsApp", href: WHATSAPP_URL },
            { label: "Muestra", href: "#muestra" },
          ]}
          notice={AVISO_SALUD}
        />
      </main>
    </>
  );
}
