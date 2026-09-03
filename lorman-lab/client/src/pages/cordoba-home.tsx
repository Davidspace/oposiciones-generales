import { useEffect, useMemo, useRef } from "react";
import { AvisoComun, AVISO_BASE } from "@/components/AvisoComun";
import { Cajon, CajonCierre } from "@/components/Cajones";
import { ConsentBanner } from "@/components/ConsentBanner";
import { CordobaDiagnostic } from "@/components/CordobaDiagnostic";
import { CtaContacto } from "@/components/CtaContacto";
import { EnlaceInstagram } from "@/components/Instagram";
import { trackEvent } from "@/lib/analytics";
import { captureAttribution, withCampaignReference } from "@/lib/attribution";
import { MOODLE_URL, PORTFOLIO_URL } from "@/lib/portfolio-links";

const WHATSAPP = "34640828654";
const BASES_URL = "https://bop.dipucordoba.es/visor-pdf/15-10-2024/BOP-A-2024-4049.pdf";
const RECTIFICACION_URL = "https://bop.dipucordoba.es/visor-pdf/18-12-2024/BOP-A-2024-4924.pdf";
const ROM_URL = "https://www.cordoba.es/sites/default/files/PDF/Ayuntamiento/Reglamentos%20Org%C3%A1nicos/2025/BOP-A-2025-1985.pdf";
const CANONICAL = "https://academialorman.es/auxiliar-administrativo-cordoba";

function setMeta(selector: string, attribute: string, value: string) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

function useCordobaMetadata() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = "Prepara Auxiliar Administrativo del Ayuntamiento de Córdoba: diagnóstico gratuito, preguntas revisadas, temas y supuestos prácticos con fuentes vigentes.";
    document.title = "Auxiliar Administrativo Ayuntamiento de Córdoba | Academia LORMAN";
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", document.title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", CANONICAL);
    setMeta('link[rel="canonical"]', "href", CANONICAL);

    const schema = document.createElement("script");
    schema.id = "cordoba-course-schema";
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Auxiliar Administrativo/a del Ayuntamiento de Córdoba",
      description,
      provider: { "@type": "EducationalOrganization", name: "Academia LORMAN", url: "https://academialorman.es" },
      url: CANONICAL,
      offers: { "@type": "Offer", price: "69", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    });
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      schema.remove();
    };
  }, []);
}

export default function CordobaHome() {
  useCordobaMetadata();
  const viewTracked = useRef(false);
  const priceTracked = useRef(false);
  const priceVisible = useRef(false);
  const priceRef = useRef<HTMLElement>(null);

  useMemo(() => captureAttribution(), []);
  const whatsappMessage = withCampaignReference(
    "Hola Academia LORMAN, quiero acceder al pack inicial de Auxiliar Administrativo del Ayuntamiento de Córdoba por 69 €.",
  );
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    const sendView = () => {
      if (!viewTracked.current && trackEvent("view_cordoba", { course: "auxiliar_administrativo_cordoba", page_path: "/auxiliar-administrativo-cordoba" })) {
        viewTracked.current = true;
      }
    };
    sendView();
    const onConsent = (event: Event) => {
      if ((event as CustomEvent).detail === "granted") sendView();
    };
    window.addEventListener("lorman:analytics-consent", onConsent);
    return () => window.removeEventListener("lorman:analytics-consent", onConsent);
  }, []);

  useEffect(() => {
    const sendPriceView = () => {
      if (priceVisible.current && !priceTracked.current && trackEvent("view_price_cordoba", { course: "auxiliar_administrativo_cordoba", price: 69, currency: "EUR" })) {
        priceTracked.current = true;
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        priceVisible.current = entry.isIntersecting;
        sendPriceView();
      },
      { threshold: 0.4 },
    );
    if (priceRef.current) observer.observe(priceRef.current);
    const onConsent = (event: Event) => {
      if ((event as CustomEvent).detail === "granted") sendPriceView();
    };
    window.addEventListener("lorman:analytics-consent", onConsent);
    return () => {
      observer.disconnect();
      window.removeEventListener("lorman:analytics-consent", onConsent);
    };
  }, []);

  const trackWhatsapp = (placement: string) => {
    trackEvent("click_whatsapp_cordoba", { course: "auxiliar_administrativo_cordoba", placement, price: 69, currency: "EUR" });
  };

  return (
    <>
      <a className="lm-skip-link" href="#contenido">Saltar al contenido</a>
      <main className="lm-page lm-cordoba" id="contenido" tabIndex={-1}>
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio">
            <img src="/lorman-logo.png" alt="Academia LORMAN" />
          </a>
          <nav className="lm-nav" aria-label="Navegación de Auxiliar Administrativo de Córdoba">
            <a className="lm-nav-back" href={PORTFOLIO_URL}>← Cursos</a>
            <a href="#contenido-pack">Qué incluye</a>
            <a href="#diagnostico">Prueba gratuita</a>
            <EnlaceInstagram size={12} />
            <a className="lm-nav-aula" href={MOODLE_URL} aria-label="Entrar al aula virtual de Academia LORMAN">Entrar al aula</a>
          </nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Ayuntamiento de Córdoba · subgrupo C2 · acceso libre</p>
          <h1>Estudia el programa.<br />Practica como en Córdoba.</h1>
          <p className="lm-lead">
            Preparación inicial basada en los 20 epígrafes oficiales, el Reglamento Orgánico vigente y el formato rectificado de los ejercicios. Empieza gratis con un diagnóstico completo y decide después.
          </p>
          <CtaContacto
            whatsapp={WHATSAPP}
            label="Quiero el pack por 69 €"
            message={whatsappMessage}
            onClick={() => trackWhatsapp("hero")}
          >
            <a className="lm-btn lm-btn-outline" href="#diagnostico">Hacer el diagnóstico</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-cordoba-exam" aria-label="Datos oficiales de la convocatoria">
          <div><strong>55 plazas</strong><span>incluidas en las bases publicadas</span></div>
          <div><strong>20 temas</strong><span>cinco comunes y quince específicos</span></div>
          <div><strong>60 preguntas</strong><span>primer ejercicio · 80 minutos</span></div>
          <div><strong>1 supuesto</strong><span>segundo ejercicio · hasta 2 horas</span></div>
          <div className="lm-cordoba-source-links">
            <a href={BASES_URL} target="_blank" rel="noreferrer">Bases oficiales</a>
            <a href={RECTIFICACION_URL} target="_blank" rel="noreferrer">Rectificación</a>
          </div>
        </section>

        <section className="lm-shell lm-cordoba-offer" id="contenido-pack" aria-labelledby="pack-title">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Producto mínimo disponible</p>
            <h2 id="pack-title">Lo que puedes usar desde el primer día.</h2>
          </div>
          <p>
            Esta primera edición no se presenta como un temario completo de veinte temas. Es un pack fundador para medir nivel, estudiar dos bloques completos y practicar con preguntas y supuestos trazables.
          </p>
        </section>

        <section className="lm-shell lm-boxes" aria-label="Contenido del pack inicial de Córdoba">
          <Cajon
            kicker="01 · TEMARIO"
            title="Dos temas completos"
            text="Constitución y organización política municipal, redactados con la misma jerarquía editorial del material LORMAN."
            figure="fuentes citadas · revisión 12/08/2026"
          />
          <Cajon
            kicker="02 · TESTS"
            title="100 preguntas revisadas"
            text="Cinco preguntas por cada epígrafe oficial, con cuatro opciones, explicación y referencia exacta."
            figure="20 temas representados"
          />
          <Cajon
            kicker="03 · PRÁCTICA"
            title="Dos supuestos completos"
            text="Versión para resolver y resolución razonada para comparar estructura, norma y decisión."
            figure="temas 6 a 20"
          />
          <CajonCierre
            kicker="04 · ACCESO FUNDADOR"
            title="Pago único de 69 €"
            text="Recibes el pack disponible y los archivos de trabajo. Antes de pagar te confirmamos por WhatsApp la entrega exacta."
            href={whatsappHref}
            label="Consultar y acceder"
            onClick={() => trackWhatsapp("content_box")}
          />
        </section>

        <CordobaDiagnostic whatsappHref={whatsappHref} />

        <section className="lm-shell lm-cordoba-rom" aria-labelledby="rom-title">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Actualización municipal</p>
            <h2 id="rom-title">El programa dice 2009. La norma cambió en 2025.</h2>
          </div>
          <div>
            <p>
              Las bases reproducen una estructura anterior del Reglamento Orgánico. El Ayuntamiento aprobó un nuevo ROM en 2025 y dejó parte del texto de 2009 en vigor de forma transitoria para determinados órganos económico-financieros y jurídicos.
            </p>
            <p>
              El material explica esa correspondencia en lugar de estudiar una fotografía desactualizada. La normativa aplicable será, en todo caso, la vigente el día del ejercicio.
            </p>
            <a href={ROM_URL} target="_blank" rel="noreferrer">Consultar el ROM vigente de 2025</a>
          </div>
        </section>

        <section className="lm-shell lm-cordoba-price" ref={priceRef} aria-labelledby="cordoba-price-title">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Acceso fundador</p>
            <h2 id="cordoba-price-title">69 € en un único pago.</h2>
            <p>Sin permanencia, clases obligatorias ni mensajes automáticos que oculten qué estás comprando.</p>
          </div>
          <div>
            <strong>Después de escribirnos</strong>
            <ol>
              <li>Te confirmamos el contenido disponible y la forma de entrega.</li>
              <li>Resolvemos cualquier duda sobre alcance y actualización.</li>
              <li>Solo si te encaja, completas el pago y abrimos el acceso.</li>
            </ol>
            <a
              className="lm-btn lm-btn-primary"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsapp("price")}
            >
              Consultar el acceso
            </a>
          </div>
        </section>

        <section className="lm-shell lm-faq lm-cordoba-faq" aria-labelledby="cordoba-faq-title">
          <h2 id="cordoba-faq-title">Preguntas frecuentes</h2>
          <div>
            <details>
              <summary>¿Es el temario completo de los 20 epígrafes?</summary>
              <p>No. El pack fundador incluye dos temas completos, 100 preguntas que recorren los 20 epígrafes, dos supuestos y el diagnóstico. Te confirmamos este alcance antes de cualquier pago.</p>
            </details>
            <details>
              <summary>¿La prueba gratuita es un examen oficial?</summary>
              <p>No. Es un diagnóstico propio de 15 preguntas teóricas, cinco aplicadas y un microcaso. Usa fuentes oficiales, pero no reproduce un cuestionario del Ayuntamiento.</p>
            </details>
            <details>
              <summary>¿Ya hay fecha de examen?</summary>
              <p>No hemos localizado una fecha oficial publicada a 12 de agosto de 2026. Las bases y las comunicaciones del Ayuntamiento prevalecen.</p>
            </details>
            <details>
              <summary>¿Hay clases o tutorías?</summary>
              <p>No. El producto está pensado para autoestudio. El soporte por WhatsApp se limita al acceso y a incidencias del material.</p>
            </details>
          </div>
        </section>

        <AvisoComun
          links={[
            { label: "Todos los cursos", href: PORTFOLIO_URL },
            { label: "WhatsApp", href: whatsappHref },
          ]}
          notice={`${AVISO_BASE} Revisión jurídica y normativa del pack Córdoba: 12 de agosto de 2026.`}
        />
        <ConsentBanner />
      </main>
    </>
  );
}
