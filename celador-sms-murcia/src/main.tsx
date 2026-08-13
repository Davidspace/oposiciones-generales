import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { AvisoComun, AVISO_SALUD } from "./components/AvisoComun";
import { Cajon, CajonCierre } from "./components/Cajones";
import { ConsentBanner } from "./components/ConsentBanner";
import { CtaContacto } from "./components/CtaContacto";
import { EnlaceInstagram } from "./components/Instagram";
import { FreeTest } from "./components/FreeTest";
import { initialiseAnalytics, trackEvent } from "./lib/analytics";
import { captureAttribution, withCampaignReference } from "./lib/attribution";

const PORTFOLIO_URL = import.meta.env.VITE_PORTFOLIO_URL?.trim() || "https://academialorman.es";
const WHATSAPP = "34640828654";
const COURSE = "Celador SMS Murcia";

captureAttribution();
initialiseAnalytics();

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(withCampaignReference(message))}`;
}

const ACCESS_URL = import.meta.env.VITE_WHATSAPP_URL?.trim() || whatsappUrl(`Hola Academia LORMAN, quiero información sobre el curso de ${COURSE}.`);
// Keep the free-test CTA on the current document so consent, UTM attribution
// and the start event are preserved before the browser scrolls to the test.
const TEST_URL = "#prueba";

function App() {
  const priceTracked = useRef(false);

  useEffect(() => {
    trackEvent("view_course", { course: "celador_sms_murcia" });
  }, []);

  useEffect(() => {
    const priceSection = document.getElementById("precios");
    if (!priceSection || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || priceTracked.current) return;
      priceTracked.current = true;
      trackEvent("view_price", { course: "celador_sms_murcia" });
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(priceSection);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="lm-skip-link" href="#contenido">Saltar al contenido</a>
      <main className="lm-page lm-sms" id="contenido">
        <header className="lm-shell lm-header">
          <a className="lm-logo" href={PORTFOLIO_URL} aria-label="Academia LORMAN, todos los cursos"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación de Celador SMS Murcia">
            <a className="lm-nav-back" href={PORTFOLIO_URL}>← Cursos</a>
            <a href="#contenido-aula">Qué incluye</a>
            <a href="#prueba">Probar gratis</a>
            <EnlaceInstagram size={12} />
          </nav>
        </header>

        <section className="lm-shell lm-hero lm-sms-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> SMS Murcia · Celador/a-Subalterno/a · acceso libre</p>
          <h1>Todo el programa.<br />Practica como te van a preguntar.</h1>
          <p className="lm-lead">Los 14 temas del SMS en un aula ordenada: tema completo, resumen, test de 50 preguntas, simulacros y exámenes oficiales corregidos. Estudia a tu ritmo y llega al ejercicio sabiendo dónde fallas.</p>
          <CtaContacto whatsapp={WHATSAPP} label="Quiero ver el curso" message={`Hola Academia LORMAN, quiero información sobre el curso de ${COURSE}.`}>
            <a className="lm-btn lm-btn-outline" href={TEST_URL} onClick={() => trackEvent("start_free_test", { course: "celador_sms_murcia", placement: "hero" })}>Hacer la prueba gratis</a>
          </CtaContacto>
          <p className="lm-btn-note">Pago único. Acceso al aula hasta el examen de la convocatoria vigente.</p>
        </section>

        <section className="lm-shell lm-exam-strip" aria-label="Datos del ejercicio del SMS">
          <div><strong>75 preguntas</strong><span>cuestionario del ejercicio</span></div>
          <div><strong>85 minutos</strong><span>tiempo máximo</span></div>
          <div><strong>−1/4</strong><span>por respuesta errónea</span></div>
          <div className="lm-exam-links"><a href="https://www.borm.es/services/anuncio/ano/2025/numero/6134/pdf?id=840285" target="_blank" rel="noreferrer">Ver convocatoria BORM</a><a href="https://www.murciasalud.es/oposicionsms" target="_blank" rel="noreferrer">Seguir el proceso SMS</a></div>
        </section>
        <p className="lm-shell lm-sms-exam-status">La relación provisional de admitidos se publicó el 4 de junio de 2026 en el <a href="https://www.borm.es/services/anuncio/843282/pdf" target="_blank" rel="noreferrer">BORM</a>. La fecha, hora y lugar del ejercicio deben confirmarse en MurciaSalud cuando se publiquen.</p>

        <section className="lm-shell lm-offer-intro" id="contenido-aula" aria-labelledby="aula-title">
          <div><p className="lm-eyebrow"><i aria-hidden="true" /> Dentro del aula</p><h2 id="aula-title">Entiende.<br />Practica.<br />Corrige.</h2></div>
          <p>Elige un tema, repasa el resumen, responde y vuelve sobre tus errores. Después mide tu ritmo con un simulacro completo. Todo está separado por bloques para que sepas qué estás haciendo en cada momento.</p>
        </section>

        <section className="lm-shell lm-boxes" aria-label="Contenido del curso">
          <Cajon kicker="01 · TEMARIO" title="14 temas completos" text="7 temas comunes y 7 específicos, con un resumen manejable para preparar cada vuelta." figure="contenido ordenado por programa" />
          <Cajon kicker="02 · TESTS" title="50 preguntas por tema" text="Practica después de estudiar y revisa la explicación de cada respuesta." figure="autocorrección al momento" />
          <Cajon kicker="03 · SIMULACROS" title="10 simulacros SMS" text="Cuestionarios de 75 preguntas y 85 minutos, con mezcla de teoría y aplicación práctica." figure="entrena el ritmo real" />
          <CajonCierre kicker="04 · ACCESO" title="90 € curso completo" text="Temario, resúmenes, tests, simulacros y exámenes oficiales corregidos. Pago único y acceso hasta el examen." href={ACCESS_URL} label="Preguntar por el acceso" />
        </section>

        <section className="lm-shell lm-sms-pricing" id="precios" aria-labelledby="precios-title">
          <div><p className="lm-eyebrow"><i aria-hidden="true" /> Dos formas de entrar</p><h2 id="precios-title">Empieza por lo que necesitas.</h2></div>
          <div className="lm-sms-price-grid">
            <article><span>Curso completo · acceso hasta el examen</span><strong>90 €</strong><p>Temario de 14 temas, resúmenes, tests, simulacros y exámenes oficiales corregidos.</p><a className="lm-btn lm-btn-primary" href={ACCESS_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("click_buy", { course: "celador_sms_murcia", product: "full", price: 90 })}>Quiero el curso completo</a></article>
            <article><span>Solo práctica · acceso hasta el examen</span><strong>45 €</strong><p>Tests por tema, simulacros y práctica para quien ya tiene un temario y quiere medir sus fallos.</p><a className="lm-btn lm-btn-outline" href={whatsappUrl(`Hola Academia LORMAN, quiero información sobre el pack de tests de ${COURSE}.`)} target="_blank" rel="noreferrer" onClick={() => trackEvent("click_buy", { course: "celador_sms_murcia", product: "tests", price: 45 })}>Quiero solo los tests</a></article>
          </div>
          <p className="lm-fineprint">Precios iniciales fijados para este lanzamiento. Te confirmamos contenido, acceso y forma de pago por WhatsApp antes de cualquier operación.</p>
        </section>

        <section className="lm-shell lm-sms-material" aria-labelledby="muestra-title">
          <div><p className="lm-eyebrow"><i aria-hidden="true" /> Muestra del material</p><h2 id="muestra-title">Ve el formato antes de decidir.</h2><p>Una vista breve de cómo se ordenan los bloques y de cómo se explica una respuesta. El material completo se entrega en el aula.</p></div>
          <div className="lm-sms-samples">
            <article><span>Tema y resumen · muestra real</span><div className="lm-sms-sample-images"><a href="/muestras/tema-completo-t01.jpg" target="_blank" rel="noreferrer" onClick={() => trackEvent("open_sample", { course: "celador_sms_murcia", sample: "tema_completo_t01" })}><img src="/muestras/tema-completo-t01.jpg" alt="Primera página del tema completo 1 de Celador SMS" loading="lazy" /></a><a href="/muestras/resumen-t01.jpg" target="_blank" rel="noreferrer" onClick={() => trackEvent("open_sample", { course: "celador_sms_murcia", sample: "resumen_t01" })}><img src="/muestras/resumen-t01.jpg" alt="Primera página del resumen del tema 1 de Celador SMS" loading="lazy" /></a></div><h3>Entiende el bloque antes de practicar</h3><p>Un desarrollo completo y un resumen de repaso para cada tema del programa común y específico.</p><small>Abre cualquier página para verla a tamaño completo</small></article>
            <article><span>Test · tema específico 5</span><a className="lm-sms-sample-image" href="/muestras/test-t05.jpg" target="_blank" rel="noreferrer" onClick={() => trackEvent("open_sample", { course: "celador_sms_murcia", sample: "test_t05" })}><img src="/muestras/test-t05.jpg" alt="Primera página del test del tema 5 de Celador SMS" loading="lazy" /></a><h3>Pregunta, decide y corrige</h3><p>Cuatro alternativas, respuesta correcta en contexto, explicación y referencia al bloque trabajado.</p><small>Test propio · no es un examen oficial</small></article>
            <article><span>Simulacro · formato SMS</span><a className="lm-sms-sample-image" href="/muestras/simulacro-01.jpg" target="_blank" rel="noreferrer" onClick={() => trackEvent("open_sample", { course: "celador_sms_murcia", sample: "simulacro_01" })}><img src="/muestras/simulacro-01.jpg" alt="Primera página del simulacro 1 de Celador SMS" loading="lazy" /></a><h3>75 preguntas · 85 minutos</h3><p>Mezcla de materias comunes y específicas, penalización de errores y resultado para decidir qué repasar después.</p><small>Simulacro propio · no oficial</small></article>
          </div>
        </section>

        <FreeTest whatsappUrl={ACCESS_URL} />

        <section className="lm-shell lm-inventory" aria-labelledby="ruta-title">
          <div className="lm-inventory-intro"><p className="lm-eyebrow"><i aria-hidden="true" /> Ruta de estudio</p><h2 id="ruta-title">Una vuelta clara. Después otra.</h2><p>Si trabajas o empiezas desde cero, no necesitas improvisar cada tarde.</p></div>
          <ol className="lm-inventory-list">
            <li><span>01</span><div><strong>Estudia el tema</strong><p>Lee el desarrollo completo y quédate con el resumen para la siguiente vuelta.</p></div></li>
            <li><span>02</span><div><strong>Practica por bloques</strong><p>Haz el test de 50 preguntas y revisa por qué una opción es correcta.</p></div></li>
            <li><span>03</span><div><strong>Acumula repasos</strong><p>Combina materias para detectar qué se te cae cuando cambia el contexto.</p></div></li>
            <li><span>04</span><div><strong>Mide el ejercicio</strong><p>Reserva 85 minutos, aplica la penalización y decide qué repasar después.</p></div></li>
          </ol>
        </section>

        <section className="lm-shell lm-seo-copy" aria-labelledby="seo-title">
          <div><p className="lm-eyebrow"><i aria-hidden="true" /> Preparación específica</p><h2 id="seo-title">Celador SMS Murcia, con el programa delante.</h2></div>
          <div><p>La convocatoria vigente del Servicio Murciano de Salud fija un ejercicio único de 75 preguntas y 85 minutos para el turno libre. Puede combinar preguntas teóricas y prácticas de las materias comunes y específicas.</p><p>Este curso reúne el programa de 14 temas en una ruta de estudio y práctica: temario, resúmenes, tests, simulacros y exámenes oficiales identificados como tales. Academia LORMAN es un proyecto independiente; las publicaciones del SMS y el BORM siempre tienen prioridad.</p></div>
        </section>

        <section className="lm-shell lm-aux-faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Preguntas frecuentes</h2>
          <div>
            <details onToggle={(event) => event.currentTarget.open && trackEvent("faq_open", { course: "celador_sms_murcia", question: "que_incluye" })}><summary>¿Qué incluye el curso completo?</summary><p>Los 14 temas —7 comunes y 7 específicos—, sus resúmenes, un test de 50 preguntas por tema, 10 simulacros de 75 preguntas y exámenes oficiales corregidos identificados por año y turno.</p></details>
            <details onToggle={(event) => event.currentTarget.open && trackEvent("faq_open", { course: "celador_sms_murcia", question: "ya_tengo_temario" })}><summary>¿Y si ya tengo temario?</summary><p>Puedes elegir el pack de solo tests por 45 €. Incluye práctica por tema, simulacros y corrección para trabajar tus fallos.</p></details>
            <details onToggle={(event) => event.currentTarget.open && trackEvent("faq_open", { course: "celador_sms_murcia", question: "material_oficial" })}><summary>¿El material es oficial?</summary><p>No. Es material educativo independiente. Los exámenes oficiales se muestran separados y con su procedencia; las preguntas propias se han redactado para entrenar el formato.</p></details>
            <details onToggle={(event) => event.currentTarget.open && trackEvent("faq_open", { course: "celador_sms_murcia", question: "acceso" })}><summary>¿Cómo funciona el acceso?</summary><p>Te confirmamos por WhatsApp el contenido, el precio y el paso de acceso al aula Moodle. El pago es único y el acceso se mantiene hasta el examen de la convocatoria vigente.</p></details>
            <details onToggle={(event) => event.currentTarget.open && trackEvent("faq_open", { course: "celador_sms_murcia", question: "clases" })}><summary>¿Hay clases semanales?</summary><p>No. El curso está pensado para autoestudio, práctica y corrección automática. Puedes escribirnos por WhatsApp si tienes una duda sobre el acceso o el funcionamiento.</p></details>
          </div>
        </section>

        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "Prueba gratis", href: TEST_URL }, { label: "WhatsApp", href: ACCESS_URL }]} notice={AVISO_SALUD} />
        <ConsentBanner />
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
