import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "./components/AvisoComun";
import { CtaContacto } from "./components/CtaContacto";
import { ConsentBanner } from "./components/ConsentBanner";
import { FichaCurso, type FichaCursoProps } from "./components/FichaCurso";
import { EnlaceInstagram } from "./components/Instagram";
import { initialiseAnalytics, trackEvent } from "./lib/analytics";
import { captureAttribution, withCampaignReference } from "./lib/attribution";

const WHATSAPP = "34640828654";
const PORTFOLIO_URL = "https://academialorman.es";
const AGE_URL = "https://administrativo-estado.vercel.app/";

captureAttribution();
initialiseAnalytics();

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(withCampaignReference(message))}`;
}

const ROUTES: FichaCursoProps[] = [
  {
    code: "ESTADO",
    tone: "tai",
    title: "Auxiliar Administrativo del Estado",
    meta: "Cuerpo General Auxiliar · subgrupo C2",
    items: [
      { title: "Ejercicio único", note: "dos partes obligatorias" },
      { title: "Normativa y psicotécnicos", note: "30 + 30 preguntas" },
      { title: "Actividad y ofimática", note: "50 preguntas · 90 minutos" },
    ],
    cta: { label: "Ver preparación AGE", href: AGE_URL },
  },
  {
    code: "SAS",
    tone: "tcae",
    title: "Auxiliar Administrativo/a del SAS",
    meta: "Servicio Andaluz de Salud · acceso libre y promoción interna",
    items: [
      { title: "Programa del SAS", note: "materias comunes y específicas" },
      { title: "Tests y repasos", note: "práctica autocorregible" },
      { title: "Convocatoria vigente", note: "889 libre + 412 promoción interna" },
    ],
    cta: { label: "Preguntar por SAS", href: whatsappUrl("Hola Academia LORMAN, quiero información sobre Auxiliar Administrativo/a del SAS.") },
  },
  {
    code: "LOCAL",
    tone: "hub",
    title: "Ayuntamientos y diputaciones",
    meta: "Auxiliar Administrativo · módulo adaptable",
    items: [
      { title: "Base común", note: "organización, procedimiento y ofimática" },
      { title: "Adaptación por bases", note: "cada administración fija sus pruebas" },
      { title: "Nuevas convocatorias", note: "incorporación progresiva" },
    ],
    cta: { label: "Proponer convocatoria", href: whatsappUrl("Hola Academia LORMAN, quiero proponer una convocatoria local de Auxiliar Administrativo.") },
  },
];

function App() {
  useEffect(() => {
    trackEvent("landing_view", { product: "auxiliar-administrativo-hub" });
  }, []);

  return (
    <>
      <a className="lm-skip-link" href="#contenido">Saltar al contenido</a>
      <main className="lm-page lm-hub lm-auxadmin" id="contenido">
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación principal">
            <a href="#rutas">Rutas</a>
            <a href="#base">Base común</a>
            <a href="#preguntas">Preguntas</a>
            <EnlaceInstagram size={17} />
          </nav>
        </header>

        <section className="lm-shell lm-hero aa-hero" id="inicio">
          <div className="aa-hero-grid">
            <div>
              <p className="lm-eyebrow"><i aria-hidden="true" /> Auxiliar Administrativo · Estado · SAS · local</p>
              <h1>Una base común.<br />Una ruta para cada convocatoria.</h1>
              <p className="lm-lead">Estudia lo que se repite, practica con preguntas claras y activa el módulo específico de la administración a la que te presentes. Sin mezclar programas ni empezar de cero cada vez.</p>
              <CtaContacto
                whatsapp={WHATSAPP}
                label="Hablar por WhatsApp"
                message="Hola, estoy buscando preparación para Auxiliar Administrativo y quiero saber qué ruta me encaja."
              >
                <a className="lm-btn lm-btn-outline" href="#rutas">Ver las rutas</a>
              </CtaContacto>
              <p className="lm-btn-note">Te orientamos antes de que elijas un aula.</p>
            </div>
            <aside className="aa-hero-aside" aria-label="Cómo se organiza la preparación">
              <span className="aa-aside-kicker">Cómo se organiza</span>
              <div><strong>01 · Base</strong><span>contenidos que suelen repetirse</span></div>
              <div><strong>02 · Convocatoria</strong><span>programa y ejercicio de cada administración</span></div>
              <div><strong>03 · Práctica</strong><span>tests, repasos y simulacros con corrección</span></div>
            </aside>
          </div>
        </section>

        <section className="lm-shell aa-facts" aria-label="Puntos de partida oficiales">
          <div><strong>1.700</strong><span>plazas AGE · ingreso libre en la convocatoria 2025</span></div>
          <div><strong>889</strong><span>plazas SAS · acceso libre en la convocatoria 2022–2024</span></div>
          <div><strong>90 min</strong><span>ejercicio único AGE · convocatoria vigente</span></div>
          <div><strong>2 h</strong><span>duración máxima anunciada para el ejercicio SAS 2025</span></div>
        </section>

        <section className="lm-shell aa-routes" id="rutas" aria-labelledby="rutas-title">
          <div className="aa-section-heading">
            <div><p className="lm-eyebrow"><i aria-hidden="true" /> Elige tu camino</p><h2 id="rutas-title" className="lm-display">Un aula de entrada.<br />Tres destinos posibles.</h2></div>
            <p>La base ayuda, pero una convocatoria no se prepara con promesas genéricas. Aquí verás qué está disponible, qué está en preparación y qué debe adaptarse a sus bases.</p>
          </div>
          <div className="lm-cards aa-route-cards">
            {ROUTES.map((route) => <div key={route.code} onClick={() => trackEvent("route_click", { route: route.code })}><FichaCurso {...route} /></div>)}
          </div>
          <p className="aa-source-note">Cifras de referencia tomadas de la convocatoria AGE publicada en el BOE y de la convocatoria SAS publicada en el BOJA. Comprueba siempre la convocatoria que te corresponda.</p>
        </section>

        <section className="lm-shell aa-common" id="base" aria-labelledby="base-title">
          <div className="aa-section-heading"><div><p className="lm-eyebrow"><i aria-hidden="true" /> El núcleo que sí se puede compartir</p><h2 id="base-title" className="lm-display">Aprende una vez.<br />Adapta después.</h2></div><p>Los nombres y el orden pueden cambiar. La lógica de muchas pruebas administrativas vuelve a aparecer: leer una norma, distinguir una opción y resolver una tarea con tiempo.</p></div>
          <div className="lm-boxes aa-common-grid">
            <div className="lm-box"><span className="lm-box-kicker">01 · NORMA</span><strong className="lm-box-title">Organización pública</strong><p>Constitución, administraciones y fuentes oficiales como punto de partida.</p><span className="lm-box-figure">base compartida · revisar bases</span></div>
            <div className="lm-box"><span className="lm-box-kicker">02 · TRÁMITE</span><strong className="lm-box-title">Procedimiento</strong><p>Plazos, actos, derechos y fases para entender qué ocurre en cada supuesto.</p><span className="lm-box-figure">aplica · no memorices a ciegas</span></div>
            <div className="lm-box"><span className="lm-box-kicker">03 · PRÁCTICA</span><strong className="lm-box-title">Test y repaso</strong><p>Preguntas autocorregibles para detectar fallos y decidir el siguiente repaso.</p><span className="lm-box-figure">responde · corrige · repite</span></div>
            <div className="lm-box lm-box-solid"><span className="lm-box-kicker">04 · AJUSTE</span><strong className="lm-box-title">Módulo específico</strong><p>Cuando hay convocatoria, añadimos el programa, el formato y la normativa que la administración exige.</p><a className="lm-box-cta" href={whatsappUrl("Hola Academia LORMAN, quiero saber qué módulo específico de Auxiliar Administrativo está disponible.")}>Preguntar qué incluye</a></div>
          </div>
          <div className="aa-boundary"><strong>Importante:</strong> un ayuntamiento puede cambiar el temario, el número de ejercicios o la prueba práctica. La parte local nunca se publica como válida hasta contrastarla con sus bases.</div>
        </section>

        <section className="lm-shell aa-method" aria-labelledby="method-title">
          <div><p className="lm-eyebrow"><i aria-hidden="true" /> Cómo estudiar</p><h2 id="method-title" className="lm-display">Menos ruido.<br />Más vueltas útiles.</h2></div>
          <div className="aa-method-list"><div><strong>01 · Sitúa</strong><span>Consulta el programa oficial y separa lo común de lo específico.</span></div><div><strong>02 · Practica</strong><span>Haz preguntas por bloques, revisa la explicación y anota el error.</span></div><div><strong>03 · Adapta</strong><span>Cuando se publique la convocatoria, cambia el orden de estudio y el simulacro a sus reglas.</span></div></div>
        </section>

        <section className="lm-shell aa-faq" id="preguntas" aria-labelledby="faq-title">
          <div><p className="lm-eyebrow"><i aria-hidden="true" /> Antes de elegir</p><h2 id="faq-title" className="lm-display">Preguntas frecuentes</h2></div>
          <div className="lm-faq">
            <details><summary>¿El mismo temario sirve para Estado, SAS y ayuntamientos?</summary><p>No exactamente. Hay materias que se repiten, pero cada administración publica su programa y sus ejercicios. Usamos la base común para avanzar y un módulo específico para no estudiar promesas genéricas.</p></details>
            <details><summary>¿Qué puedo empezar ahora?</summary><p>La ruta de Estado ya tiene una landing y una prueba propia. La ruta SAS está en preparación; escríbenos y te confirmamos el estado real antes de cualquier pago.</p></details>
            <details><summary>¿Y si todavía no sé a qué convocatoria presentarme?</summary><p>Cuéntanos tu titulación, comunidad y horizonte. Te indicaremos qué ruta encaja mejor y qué parte del contenido puedes reutilizar.</p></details>
            <details><summary>¿Es una página oficial?</summary><p>No. Academia LORMAN es un proyecto educativo independiente. Las bases y la convocatoria vigente siempre tienen prioridad.</p></details>
          </div>
        </section>

        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "WhatsApp", href: whatsappUrl("Hola Academia LORMAN, quiero información sobre Auxiliar Administrativo.") }]} notice={AVISO_BASE + AVISO_PRECIOS} />
        <ConsentBanner />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
