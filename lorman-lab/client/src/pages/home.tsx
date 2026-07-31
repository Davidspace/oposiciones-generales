import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardCheck,
  Laptop,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

type Course = {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  proof: string;
  href: string;
  sampleHref?: string;
  icon: typeof BookOpen;
  tone: "coral" | "blue" | "green" | "red";
};

const COURSES: Course[] = [
  {
    code: "TCAE",
    title: "Técnico en Cuidados Auxiliares de Enfermería",
    subtitle: "SAS · SMS · IMAS · SERMAS",
    description: "Temarios, resúmenes, autoevaluaciones y simulacros disponibles en la línea sanitaria.",
    status: "Contenido disponible",
    proof: "Muestras de examen",
    href: "/tcae#precios",
    sampleHref: "/test-tcae-sas",
    icon: Stethoscope,
    tone: "coral",
  },
  {
    code: "TAI",
    title: "Técnico Auxiliar de Informática",
    subtitle: "Administración del Estado · C1",
    description: "El aula de TAI reúne temas, autoevaluaciones y simulacros para las dos partes del ejercicio.",
    status: "Contenido disponible",
    proof: "33 temas · 10 simulacros",
    href: "https://tai-academia.dgarmar.chatgpt.site/",
    icon: Laptop,
    tone: "blue",
  },
  {
    code: "SS",
    title: "Administrativo de la Seguridad Social",
    subtitle: "Administración de la Seguridad Social · C1",
    description: "Temario general y específico, tests y práctica orientada al segundo ejercicio.",
    status: "Contenido disponible",
    proof: "23 temas + 13 específicos",
    href: "https://ss-casolab.dgarmar.chatgpt.site/",
    icon: ShieldCheck,
    tone: "green",
  },
  {
    code: "C2",
    title: "Auxiliar Administrativo del Estado",
    subtitle: "Administración General del Estado · C2",
    description: "MVP en elaboración: normativa, psicotécnicos, actividad administrativa y ofimática.",
    status: "Validación local",
    proof: "Muestra gratuita de práctica",
    href: "https://administrativo-estado.dgarmar.chatgpt.site/",
    sampleHref: "https://administrativo-estado.dgarmar.chatgpt.site/#prueba",
    icon: ClipboardCheck,
    tone: "red",
  },
];

function track(event: string, course?: string) {
  try {
    const payload = {
      event,
      course: course ?? null,
      path: window.location.pathname,
      at: new Date().toISOString(),
    };
    const stored = JSON.parse(window.localStorage.getItem("lorman-lab-events") ?? "[]") as unknown[];
    window.localStorage.setItem("lorman-lab-events", JSON.stringify([...stored, payload].slice(-200)));
  } catch {
    // Local analytics must never block navigation or study.
  }
}

function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;
  return (
    <article className={`hub-course-card hub-card-${course.tone}`}>
      <div className="hub-course-top">
        <span className={`hub-course-code hub-tone-${course.tone}`}>{course.code}</span>
        <span className="hub-status">{course.status}</span>
      </div>
      <Icon className="hub-course-icon" aria-hidden="true" />
      <p className="hub-course-subtitle">{course.subtitle}</p>
      <h3>{course.title}</h3>
      <p className="hub-course-description">{course.description}</p>
      <div className="hub-course-proof"><Check size={15} aria-hidden="true" /> {course.proof}</div>
      <div className="hub-course-actions">
        <a className="hub-course-link" href={course.href} onClick={() => track("course_click", course.code)}>
          Explorar curso <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        {course.sampleHref && (
          <a className="hub-course-sample" href={course.sampleHref} onClick={() => track("sample_click", course.code)}>
            Ver muestra
          </a>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="hub-page" onLoad={() => track("landing_view")}>
      <header className="hub-header">
        <a className="hub-brand" href="#inicio" aria-label="Academia LORMAN, inicio">
          <span className="hub-brand-mark">L</span>
          <span><strong>Academia LORMAN</strong><small>Oposiciones online</small></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#cursos">Cursos</a>
          <a href="#metodo">Cómo estudiamos</a>
          <a className="hub-header-cta" href="#cursos">Elegir curso <ChevronRight size={15} aria-hidden="true" /></a>
        </nav>
      </header>

      <section className="hub-hero" id="inicio">
        <div className="hub-hero-copy">
          <p className="hub-kicker"><span /> ACADEMIA LORMAN · LABORATORIO LOCAL</p>
          <h1>Estudia con <em>una ruta.</em></h1>
          <p className="hub-lead">Una entrada común para nuestras academias de oposiciones. Consulta el alcance real, prueba una muestra y entra solo en el aula que encaja contigo.</p>
          <div className="hub-actions">
            <a className="hub-button hub-button-primary" href="#cursos" onClick={() => track("course_view")}>Ver cursos <ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="hub-text-link" href="#metodo">Conoce el método</a>
          </div>
          <p className="hub-note">Proyecto experimental independiente. No es una página oficial de ninguna Administración.</p>
        </div>
        <div className="hub-hero-sheet" aria-label="Ruta común de estudio">
          <div className="hub-sheet-top"><span>LO / 01</span><span>ACADEMIA LORMAN</span></div>
          <div className="hub-sheet-title"><span>UNA MARCA · VARIAS OPOSICIONES</span><strong>Contenido claro.<br />Práctica frecuente.</strong></div>
          <div className="hub-sheet-list"><div><b>01</b><span>Consulta el alcance</span></div><div><b>02</b><span>Accede a una muestra</span></div><div><b>03</b><span>Elige tu aula</span></div></div>
          <div className="hub-sheet-footer"><i /> <span>Autoestudio · acceso digital · información clara</span></div>
        </div>
      </section>

      <section className="hub-trust" aria-label="Elementos comunes">
        <p>Una forma de estudiar, adaptada a cada convocatoria</p>
        <div><span>Temario</span><span>Tests</span><span>Simulacros</span><span>Autocorrección</span><span>Acceso digital</span></div>
      </section>

      <section className="hub-courses" id="cursos">
        <div className="hub-section-heading"><div><p className="hub-kicker">Elige tu oposición</p><h2>Un aula para cada objetivo.</h2></div><p>Las fichas muestran solo lo que está inventariado. Cada curso mantiene su landing, su contenido y su estado de revisión.</p></div>
        <div className="hub-course-grid">{COURSES.map((course) => <CourseCard key={course.code} course={course} />)}</div>
      </section>

      <section className="hub-method" id="metodo">
        <div className="hub-method-heading"><p className="hub-kicker hub-kicker-light">La experiencia LORMAN</p><h2>Menos ruido.<br /><span>Más práctica.</span></h2></div>
        <div className="hub-method-copy"><p>El contenido se organiza para que puedas estudiar sin depender de una clase semanal: abre un bloque, practica, revisa el error y decide qué repetir.</p><div className="hub-method-steps"><div><b>01</b><strong>Explora</strong><span>Comprueba el alcance antes de elegir.</span></div><div><b>02</b><strong>Entrena</strong><span>Practica con preguntas y simulacros.</span></div><div><b>03</b><strong>Decide</strong><span>Compra solo cuando el formato te convenza.</span></div></div></div>
      </section>

      <section className="hub-proof"><div><p className="hub-kicker">Muestras abiertas</p><h2>Prueba el material antes de comprar.</h2></div><div><p>Hay muestras de examen y diagnósticos en los productos que ya los tienen. El laboratorio registra únicamente eventos anónimos en este dispositivo para comparar interés y navegación.</p><a className="hub-text-link" href="https://administrativo-estado.dgarmar.chatgpt.site/#prueba" onClick={() => track("sample_click", "C2")}>Probar Auxiliar del Estado C2 <ArrowUpRight size={15} aria-hidden="true" /></a></div></section>

      <footer className="hub-footer"><div><strong>Academia LORMAN</strong><p>Preparación digital independiente para oposiciones.</p></div><div className="hub-footer-links"><a href="#cursos">Cursos</a><a href="https://www.instagram.com/academialorman/" target="_blank" rel="noreferrer">Instagram</a><a href="https://wa.me/34640828654" target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click")}>WhatsApp</a></div></footer>
    </main>
  );
}
