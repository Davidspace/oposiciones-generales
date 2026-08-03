import { useEffect } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { trackLabEvent } from "@/lib/lab-analytics";
import { PRODUCT_URLS } from "@/lib/portfolio-links";
import { FICHAS } from "@/data/fichas";
import { FichaOposicion } from "@/components/FichaOposicion";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";

export default function Home() {
  useEffect(() => {
    trackLabEvent("landing_view", "hub");
  }, []);

  return (
    <>
      <a className="hub-skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>
      <main className="hub-page" id="contenido-principal" tabIndex={-1}>
      <header className="hub-header">
        <a className="hub-brand" href="#inicio" aria-label="Academia LORMAN, inicio">
          <span className="hub-brand-mark">L</span>
          <span><strong>Academia LORMAN</strong><small>Oposiciones online</small></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#cursos">Cursos</a>
          <a href="#metodo">Cómo estudiamos</a>
          <a href="#preguntas">Preguntas</a>
          <a className="hub-header-cta" href="#cursos">Elegir curso <ChevronRight size={15} aria-hidden="true" /></a>
        </nav>
      </header>

      <section className="hub-hero" id="inicio">
        <div className="hub-hero-copy">
          <p className="hub-kicker"><span /> ACADEMIA LORMAN · CUATRO OPOSICIONES</p>
          <h1>Estudia con <em>una ruta.</em></h1>
          <p className="hub-lead">Una entrada común para nuestras academias de oposiciones. Consulta el alcance real, prueba una muestra y entra solo en el aula que encaja contigo.</p>
          <div className="hub-actions">
            <a className="hub-button hub-button-primary" href="#cursos" onClick={() => trackLabEvent("course_view", "hub")}>Ver las cuatro fichas <ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="hub-text-link" href="#metodo">Conoce el método</a>
          </div>
          <p className="hub-note">Preparación digital independiente. No es una página oficial de ninguna Administración.</p>
        </div>
        <div className="hub-hero-sheet" aria-label="Ruta común de estudio">
          <div className="hub-sheet-top"><span>LO / 01</span><span>ACADEMIA LORMAN</span></div>
          <div className="hub-sheet-title"><span>UNA MARCA · CUATRO OPOSICIONES</span><strong>Contenido claro.<br />Práctica frecuente.</strong></div>
          <div className="hub-sheet-list"><div><b>01</b><span>Consulta la ficha y el estado real</span></div><div><b>02</b><span>Accede a una muestra</span></div><div><b>03</b><span>Elige tu aula</span></div></div>
          <div className="hub-sheet-footer"><i /> <span>Autoestudio · acceso digital · información clara</span></div>
        </div>
      </section>

      <section className="hub-trust" aria-label="Elementos comunes">
        <p>Una forma de estudiar, adaptada a cada convocatoria</p>
        <div><span>Temario</span><span>Tests</span><span>Simulacros</span><span>Autocorrección</span><span>Acceso digital</span></div>
      </section>

      <section className="hub-courses" id="cursos">
        <div className="hub-section-heading"><div><p className="hub-kicker">Elige tu oposición</p><h2>Una ficha por aula.</h2></div><p>Cada ficha declara código, nivel, administración, estado real e indicadores respaldados por el inventario. Ninguna cifra aparece si no está en el material.</p></div>
        <div className="of-grid">
          {FICHAS.map((ficha) => (
            <FichaOposicion
              key={ficha.code}
              {...ficha}
              primary={{ ...ficha.primary, onClick: () => trackLabEvent("course_click", ficha.code) }}
              secondary={
                ficha.secondary
                  ? { ...ficha.secondary, onClick: () => trackLabEvent("sample_click", ficha.code) }
                  : undefined
              }
            />
          ))}
        </div>
      </section>

      <section className="hub-method" id="metodo">
        <div className="hub-method-heading"><p className="hub-kicker hub-kicker-light">La experiencia LORMAN</p><h2>Menos ruido.<br /><span>Más práctica.</span></h2></div>
        <div className="hub-method-copy"><p>El contenido se organiza para que puedas estudiar sin depender de una clase semanal: abre un bloque, practica, revisa el error y decide qué repetir.</p><div className="hub-method-steps"><div><b>01</b><strong>Explora</strong><span>Comprueba el alcance antes de elegir.</span></div><div><b>02</b><strong>Entrena</strong><span>Practica con preguntas y simulacros.</span></div><div><b>03</b><strong>Decide</strong><span>Compra solo cuando el formato te convenza.</span></div></div></div>
      </section>

      <section className="hub-proof"><div><p className="hub-kicker">Muestras abiertas</p><h2>Prueba el material antes de comprar.</h2></div><div><p>Hay muestras de examen y diagnósticos en los productos que ya los tienen. El laboratorio registra únicamente eventos anónimos en este dispositivo para comparar interés y navegación.</p><a className="hub-text-link" href={`${PRODUCT_URLS.c2}#prueba`} onClick={() => trackLabEvent("sample_click", "C2")}>Probar Auxiliar del Estado C2 <ArrowUpRight size={15} aria-hidden="true" /></a></div></section>

      <section className="hub-faq" id="preguntas" aria-labelledby="hub-faq-title"><div><p className="hub-kicker">Antes de elegir</p><h2 id="hub-faq-title">Información clara, soporte con límites.</h2><p>La marca común orienta. Cada landing y cada aula debe concretar su alcance antes del acceso.</p><a className="hub-button hub-button-primary" href="https://wa.me/34640828654" target="_blank" rel="noreferrer" onClick={() => trackLabEvent("whatsapp_click", "hub-faq")}>Contactar <ArrowUpRight size={15} aria-hidden="true" /></a></div><div className="hub-faq-list"><details><summary>¿Es una página oficial?</summary><p>No. Academia LORMAN es una preparación digital independiente. La convocatoria vigente y sus criterios siempre tienen prioridad.</p></details><details><summary>¿Puedo probar el material?</summary><p>La ficha muestra una acción secundaria solo cuando el producto tiene muestra o diagnóstico. En este laboratorio la tienen TCAE, SS y C2.</p></details><details><summary>¿Hay clases o tutoría ilimitada?</summary><p>El modelo prioriza autoestudio, tests, simulacros y autocorrección. No se promete respuesta inmediata, tutoría ilimitada ni corrección manual de todo el trabajo.</p></details><details><summary>¿Qué significa el estado de una ficha?</summary><p>Indica en qué punto está el producto: contenido disponible, matrícula en preparación, publicación en revisión o validación local sin venta.</p></details><details><summary>¿Los precios de la ficha son definitivos?</summary><p>No. Son los importes previstos de lanzamiento. El importe final, los impuestos y las condiciones se muestran en la propia landing antes de pagar.</p></details></div></section>

      <AvisoComun
        brand="Academia LORMAN"
        tagline="Preparación digital independiente para oposiciones."
        links={[
          { label: "Cursos", href: "#cursos" },
          { label: "Preguntas", href: "#preguntas" },
          { label: "Instagram", href: "https://www.instagram.com/academialorman/", external: true },
          { label: "WhatsApp", href: "https://wa.me/34640828654", external: true },
        ]}
        notice={AVISO_BASE + AVISO_PRECIOS}
      />
      </main>
    </>
  );
}
