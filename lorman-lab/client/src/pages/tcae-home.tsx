import { AvisoComun, AVISO_SALUD } from "@/components/AvisoComun";
import { Cajon, CajonCierre } from "@/components/Cajones";
import { CtaContacto } from "@/components/CtaContacto";
import { EnlaceInstagram } from "@/components/Instagram";
import { MuestraMaterial } from "@/components/MuestraMaterial";
import { MOODLE_URL, PORTFOLIO_URL } from "@/lib/portfolio-links";

const WHATSAPP = "34640828654";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Hola Academia LORMAN, quiero información sobre el material de TCAE.",
)}`;

const preguntasMuestra = [
  {
    enunciado: "¿A qué se orientan prioritariamente los medios y actuaciones del sistema sanitario?",
    opciones: [
      "A la atención hospitalaria",
      "A la promoción de la salud y a la prevención de enfermedades",
      "A la curación de enfermedades",
      "A la investigación médica",
    ],
    respuesta: "b",
    explicacion: "Respuesta editorial de la muestra: la promoción de la salud y la prevención de enfermedades.",
  },
  {
    enunciado: "¿Cuál es el objetivo principal de una estrategia de promoción de una vida saludable?",
    opciones: [
      "Mejorar la salud y el bienestar de la población",
      "Aumentar el número de hospitales",
      "Reducir la atención primaria",
      "Sustituir la prevención por la asistencia hospitalaria",
    ],
    respuesta: "a",
    explicacion: "La muestra trabaja la promoción de la salud como mejora del bienestar de la población.",
  },
  {
    enunciado: "¿Qué objetivo tiene un plan de vigilancia y control de vectores con incidencia en salud?",
    opciones: [
      "Controlar las enfermedades transmitidas por vectores",
      "Introducir nuevas especies de vectores",
      "Eliminar todos los insectos del entorno",
      "Sustituir la vigilancia epidemiológica",
    ],
    respuesta: "a",
    explicacion: "La respuesta de la muestra se centra en controlar las enfermedades transmitidas por vectores.",
  },
  {
    enunciado: "¿Cuál es un objetivo del sistema integral de gestión ambiental sanitario?",
    opciones: [
      "Aumentar el consumo de energía",
      "Reducir la generación de residuos",
      "Eliminar la prevención ambiental",
      "Limitar la gestión de residuos a los hospitales",
    ],
    respuesta: "b",
    explicacion: "La práctica relaciona la gestión ambiental con la reducción de residuos.",
  },
  {
    enunciado: "¿Qué principio de protección de datos exige que los datos sean adecuados, pertinentes y limitados?",
    opciones: [
      "Confidencialidad",
      "Exactitud",
      "Minimización de datos",
      "Limitación del plazo de conservación",
    ],
    respuesta: "c",
    explicacion: "La minimización de datos limita el tratamiento a lo necesario para la finalidad prevista.",
  },
];

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
            <a className="lm-nav-aula" href={MOODLE_URL} aria-label="Entrar al aula virtual de Academia LORMAN">Entrar al aula</a>
          </nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> TCAE · servicios de salud · turno libre</p>
          <h1>Prepara TCAE<br />con un material que se entiende.</h1>
          <p className="lm-lead">
            Temario por bloques, resúmenes, tests y simulacros tipo examen. Dinos qué servicio de salud preparas y te confirmamos la versión disponible.
          </p>
          <CtaContacto
            whatsapp={WHATSAPP}
            label="Comprobar mi versión"
            message="Hola, quiero consultar el material TCAE para mi servicio de salud."
          >
            <a className="lm-btn lm-btn-outline" href="#muestra">Ver el material</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-boxes" id="acceso" aria-label="Contenido de TCAE">
          <Cajon
            kicker="01 · TEMARIO"
            title="Temario por bloques"
            text="Resúmenes y esquemas para estudiar y repasar sin perderte."
          />
          <Cajon
            kicker="02 · TEST"
            title="Tests por tema"
            text="Practica cada bloque y comprueba la respuesta razonada al momento."
          />
          <Cajon
            kicker="03 · SIMULACROS"
            title="Simulacros tipo examen"
            text="Haz un repaso completo y llega con ritmo de examen."
          />
          <CajonCierre
            kicker="04 · ACCESO"
            title="Elige tu servicio de salud"
            text="Te confirmamos la versión, el precio y el acceso antes de nada."
            href={WHATSAPP_URL}
            label="Consultar mi versión"
          />
        </section>

        <MuestraMaterial
          titulo="Muestra del material"
          intro="Mira cómo se estudia dentro del aula: páginas reales, preguntas de ejemplo y respuestas explicadas."
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
          ]}
          notice={AVISO_SALUD}
        />
      </main>
    </>
  );
}
