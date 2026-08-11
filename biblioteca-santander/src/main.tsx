import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { AvisoComun, AVISO_BIBLIOTECA } from "./components/AvisoComun";
import { Cajon, CajonCierre } from "./components/Cajones";
import { ConsentBanner } from "./components/ConsentBanner";
import { CtaContacto } from "./components/CtaContacto";
import { DiagnosticoBiblioteca } from "./components/DiagnosticoBiblioteca";
import { EnlaceInstagram } from "./components/Instagram";
import { PruebaProducto } from "./components/PruebaProducto";
import { captureAttribution, withCampaignReference } from "./lib/attribution";
import { initialiseAnalytics } from "./lib/analytics";

const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL?.trim() || "https://academialorman.es";
const WHATSAPP = "34640828654";
captureAttribution();
initialiseAnalytics();
const WHATSAPP_MESSAGE = withCampaignReference("Hola Academia LORMAN, quiero información sobre Auxiliar de Biblioteca del Ayuntamiento de Santander.");
const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL?.trim() || `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function App() {
  return (
    <>
      <a className="lm-skip-link" href="#contenido">Saltar al contenido</a>
      <main className="lm-page lm-biblioteca" id="contenido">
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación de Auxiliar de Biblioteca">
            <a className="lm-nav-back" href={PORTFOLIO_URL}>← Cursos</a>
            <a className="lm-nav-material" href="#contenido-aula">Qué incluye</a>
            <EnlaceInstagram size={12} />
          </nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Auxiliar de Biblioteca · Santander · C2 · acceso libre</p>
          <h1>El examen no se estudia solo.<br />Se practica.</h1>
          <p className="lm-lead">20 temas, un test de 50 preguntas y cuatro supuestos prácticos de catálogo y referencia. Una preparación digital pensada para entender el programa y entrenar el ejercicio que más cuesta practicar por libre.</p>
          <CtaContacto
            whatsapp={WHATSAPP}
            label="Quiero información"
            message="Hola Academia LORMAN, quiero información sobre Auxiliar de Biblioteca del Ayuntamiento de Santander."
          >
            <a className="lm-btn lm-btn-outline" href="#prueba">Probar la muestra</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-exam-strip" aria-label="Datos de la convocatoria de Auxiliar de Biblioteca del Ayuntamiento de Santander">
          <div><strong>9 plazas</strong><span>8 libres · 1 discapacidad</span></div>
          <div><strong>20 temas</strong><span>parte general y específica</span></div>
          <div><strong>2 ejercicios</strong><span>práctico y test</span></div>
          <div className="lm-exam-links">
            <a href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-9412" target="_blank" rel="noreferrer">Ver convocatoria BOE</a>
            <a href="https://boc.cantabria.es/boces/verAnuncioAction.do?idAnuBlob=432055" target="_blank" rel="noreferrer">Ver bases BOC</a>
          </div>
        </section>

        <section className="lm-shell lm-offer-intro" id="contenido-aula" aria-labelledby="contenido-titulo">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Dentro del aula</p>
            <h2 id="contenido-titulo">Programa corto.<br />Práctica muy concreta.</h2>
          </div>
          <p>Empieza por el tema, pasa a una pregunta y termina resolviendo un caso. La ruta está pensada para estudiar a tu ritmo y volver sobre los errores sin depender de una clase.</p>
        </section>

        <section className="lm-shell lm-boxes" aria-label="Contenido de la preparación de Auxiliar de Biblioteca">
          <Cajon kicker="01 · PROGRAMA" title="20 temas exactos" text="Parte general y específica, incluida la Red de Bibliotecas Municipales de Santander." figure="lee, sitúa y repasa" />
          <Cajon kicker="02 · TEST" title="50 preguntas" text="Entrena el segundo ejercicio con preguntas autocorregibles y una explicación clara del error." figure="responde y corrige" />
          <Cajon kicker="03 · PRÁCTICA" title="Catálogo y referencias" text="Aprende a ordenar una búsqueda, comprobar un registro y justificar la fuente consultada." figure="aplica el método" />
          <CajonCierre kicker="04 · APERTURA" title="Aula específica" text="Estamos preparando el material de esta convocatoria. Escríbenos y te avisamos cuando esté disponible." href={WHATSAPP_URL} label="Quiero recibir aviso" />
        </section>

        <PruebaProducto whatsappUrl={WHATSAPP_URL} />
        <DiagnosticoBiblioteca />

        <section className="lm-shell lm-seo-copy" aria-labelledby="preparar-biblioteca">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> La convocatoria</p>
            <h2 id="preparar-biblioteca">Un programa pequeño.<br />Un práctico que marca la diferencia.</h2>
          </div>
          <div>
            <p>El Ayuntamiento de Santander convoca nueve plazas de Auxiliar de Biblioteca, subgrupo C2, por oposición y turno libre o reservado para discapacidad. Las bases exigen titulación de ESO, Graduado Escolar, FP1 o equivalente.</p>
            <p>El primer ejercicio pide resolver cuatro supuestos prácticos en dos horas sobre búsquedas bibliográficas simples y obras de referencia. El segundo es un test de 50 preguntas en 50 minutos. La fecha del examen se publicará en los anuncios sucesivos de la convocatoria.</p>
          </div>
        </section>

        <section className="lm-shell lm-faq lm-aux-faq" aria-labelledby="preguntas-frecuentes">
          <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
          <div>
            <details><summary>¿La prueba gratuita es un examen oficial?</summary><p>No. Es una muestra propia basada en las bases de la convocatoria. Sirve para reconocer el tipo de razonamiento, no para sustituir un ejercicio oficial.</p></details>
            <details><summary>¿Tengo que saber biblioteconomía para empezar?</summary><p>No hace falta dominarlo todo desde el primer día. La muestra te enseña el tipo de búsqueda y el programa te indica qué conceptos debes ordenar primero.</p></details>
            <details><summary>¿Incluye el programa completo?</summary><p>La preparación se está construyendo sobre los 20 temas exactos de las bases. La disponibilidad y el contenido final se confirmarán antes de cualquier pago.</p></details>
            <details><summary>¿Cuándo será el examen?</summary><p>La convocatoria publicada no fija todavía una fecha en la landing. Consulta los anuncios sucesivos del Ayuntamiento y el BOC.</p></details>
            <details><summary>¿Hay clases o tutorías?</summary><p>La propuesta es autoestudio digital, con corrección automática y apoyo limitado para dudas de acceso. No depende de clases semanales.</p></details>
          </div>
        </section>
        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "WhatsApp", href: WHATSAPP_URL }]} notice={AVISO_BIBLIOTECA} />
        <ConsentBanner />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
