import { PORTFOLIO_URL } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";
import { Cajon, CajonCierre } from "@/components/Cajones";
import { CtaContacto } from "@/components/CtaContacto";
import { EnlaceInstagram } from "@/components/Instagram";
import { MuestraMaterial } from "@/components/MuestraMaterial";

const WHATSAPP = "34640828654";

export default function TaiLanding() {
  return (
    <>
      <a className="tai-skip-link" href="#contenido-principal">Saltar al contenido</a>
      <main className="lm-page lm-tai" id="contenido-principal" tabIndex={-1}>
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Curso TAI, inicio"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación del curso TAI"><a className="tai-nav-home" href={PORTFOLIO_URL}>← Cursos</a><a className="lm-nav-material" href="#incluye">Qué incluye</a><EnlaceInstagram size={12} /></nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Estado · subgrupo C1</p>
          <h1>Técnico Auxiliar<br />de Informática</h1>
          <p className="lm-lead">Temario, tests, simulacros y simulacros prácticos. Pago único, acceso hasta el día del examen.</p>
          <CtaContacto
            whatsapp={WHATSAPP}
            note=""
          >
            <a className="lm-btn lm-btn-outline" href="#incluye">Qué incluye</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-boxes" id="incluye" aria-label="Contenido de TAI">
          <Cajon kicker="01 · TEMARIO" title="Todo el programa redactado" text="Bloques I a IV en PDF, listos para estudiar y repasar." figure="33 temas" />
          <Cajon kicker="02 · TEST" title="Autoevaluaciones con explicación" text="Practica tema a tema y detecta lo que falla al momento." figure="muchas más autoevaluaciones que temas" />
          <Cajon kicker="03 · SIMULACROS" title="Teóricos y prácticos" text="Ensaya las dos partes del ejercicio con corrección automática." figure="bloques III y IV + supuestos prácticos" />
          <CajonCierre kicker="04 · PRECIO" title="Pago único de 95 €" text="La compra da acceso al aula hasta el día del examen." href={`https://wa.me/${WHATSAPP}?text=Hola%20Academia%20LORMAN%2C%20quiero%20consultar%20el%20acceso%20al%20curso%20TAI.`} />
          <p className="lm-fineprint">Autoestudio: no incluye clases en directo ni corrección manual. Ejercicio único en dos partes, 120 minutos.</p>
        </section>

        <MuestraMaterial
          titulo="Muestra del material"
          intro="Páginas reales del temario y preguntas de ejemplo, para que veas el formato antes de decidir."
          grupos={[{
            paginas: [
              { src: "/muestras/tai-1.jpeg", alt: "Página de muestra del temario TAI 1" },
              { src: "/muestras/tai-2.jpeg", alt: "Página de muestra del temario TAI 2" },
              { src: "/muestras/tai-3.jpeg", alt: "Página de muestra del temario TAI 3" },
              { src: "/muestras/tai-4.jpeg", alt: "Página de muestra del temario TAI 4" },
            ],
            nota: "Páginas de muestra del temario TAI. El aula contiene el programa completo.",
          }]}
          preguntas={[
            { enunciado: "¿Qué valor superior del ordenamiento jurídico español se menciona en el artículo 1.1 de la Constitución?", opciones: ["La eficacia", "La libertad", "La jerarquía", "La coordinación"], respuesta: "b", explicacion: "El artículo 1.1 incluye la libertad entre los valores superiores del ordenamiento jurídico." },
            { enunciado: "En una base de datos relacional, una fila representa normalmente:", opciones: ["Una tabla", "Un registro", "Un campo", "Un índice"], respuesta: "b", explicacion: "Una fila contiene los valores de un registro; las columnas representan sus campos." },
            { enunciado: "¿Qué protocolo se utiliza habitualmente para obtener una dirección IP automáticamente?", opciones: ["DHCP", "FTP", "SMTP", "SNMP"], respuesta: "a", explicacion: "DHCP asigna de forma automática parámetros de configuración IP a los clientes." },
            { enunciado: "¿Qué componente gestiona la memoria y los procesos de un sistema operativo?", opciones: ["El kernel", "El compilador", "El navegador", "El periférico"], respuesta: "a", explicacion: "El kernel o núcleo coordina recursos como memoria, procesos y dispositivos." },
            { enunciado: "¿Qué estructura permite repetir un bloque mientras se cumple una condición?", opciones: ["Una secuencia", "Una selección", "Un bucle", "Una constante"], respuesta: "c", explicacion: "Un bucle repite instrucciones mientras se cumple una condición o durante un número de iteraciones." },
          ]}
          notaPreguntas="Preguntas de ejemplo; el banco completo está en el campus."
        />

        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "WhatsApp", href: `https://wa.me/${WHATSAPP}` }]} notice={AVISO_BASE + AVISO_PRECIOS} />
      </main>
    </>
  );
}
