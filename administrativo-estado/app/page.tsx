"use client";

import { useEffect, useMemo, useState } from "react";
import { PORTFOLIO_URL } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_BASE, AVISO_SIN_VENTA } from "@/components/AvisoComun";
import { FichaOposicion } from "@/components/FichaOposicion";

const EXPERIMENT = "administrativo-estado-c2";

type Question = {
  id: string;
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
};

const QUESTIONS: Question[] = [
  {
    id: "q1",
    topic: "Psicotécnico · verbal",
    prompt: "Elige la palabra que completa mejor la relación: archivo es a documento como biblioteca es a…",
    options: ["persona", "libro", "estantería", "oficina"],
    answer: 1,
  },
  {
    id: "q2",
    topic: "Organización pública",
    prompt: "¿Qué norma regula el procedimiento administrativo común de las Administraciones Públicas?",
    options: ["Ley 39/2015", "Ley 40/2015", "Ley 9/2017", "Real Decreto Legislativo 5/2015"],
    answer: 0,
  },
  {
    id: "q3",
    topic: "Actividad administrativa",
    prompt: "En un procedimiento administrativo, los plazos señalados por días se entienden, con carácter general, como:",
    options: ["Naturales", "Hábiles", "Laborales de la Administración", "Días lectivos"],
    answer: 1,
  },
  {
    id: "q4",
    topic: "Ofimática · Excel 365",
    prompt: "En Excel de escritorio, una fórmula comienza normalmente con el signo:",
    options: ["#", "@", "=", "%"],
    answer: 2,
  },
  {
    id: "q5",
    topic: "Psicotécnico · numérico",
    prompt: "Completa la serie: 3, 6, 12, 24, …",
    options: ["30", "36", "42", "48"],
    answer: 3,
  },
];

function track(eventType: string, metadata?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const sessionKey = "admin-estado-c2-session";
  const current = window.sessionStorage.getItem(sessionKey) ?? crypto.randomUUID();
  window.sessionStorage.setItem(sessionKey, current);
  const query = new URLSearchParams(window.location.search);
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventId: crypto.randomUUID(),
      sessionId: current,
      experiment: EXPERIMENT,
      offerVariant: "hub-free-sample-c2-v1",
      eventType,
      path: window.location.pathname,
      utmSource: query.get("utm_source"),
      utmMedium: query.get("utm_medium"),
      utmCampaign: query.get("utm_campaign"),
      metadata: metadata ?? {},
    }),
  }).catch(() => undefined);
}

export default function AdministrativoEstadoLanding() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => QUESTIONS.reduce((total, item) => total + (answers[item.id] === item.answer ? 1 : 0), 0), [answers]);

  useEffect(() => track("landing_view"), []);

  function choose(question: Question, option: number) {
    setAnswers((current) => ({ ...current, [question.id]: option }));
    track("diagnostic_answered", { questionId: question.id, answerState: "chosen" });
  }

  function complete() {
    if (Object.keys(answers).length !== QUESTIONS.length) return;
    setSubmitted(true);
    track("diagnostic_complete", {
      correct: score,
      unanswered: 0,
      dominantError: score < 3 ? "fundamentos" : "consolidado",
      scoreBand: score >= 4 ? "solid" : score >= 3 ? "developing" : "priority",
    });
    window.setTimeout(() => document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  return (
    <>
      <a className="ae-skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>
      <main className="ae-page" id="contenido-principal" tabIndex={-1}>
      <header className="ae-header">
        <a className="ae-brand" href="#inicio" aria-label="Academia LORMAN, inicio">
          <span className="ae-brand-mark">L</span>
          <span><strong>Academia LORMAN</strong><small>Auxiliar de la Administración del Estado · C2</small></span>
        </a>
        <nav aria-label="Navegación principal"><a className="ae-nav-home" href={PORTFOLIO_URL}>Todos los cursos</a><a href="#examen">El examen</a><a href="#metodo">Método</a><a className="ae-nav-cta" href="#prueba" onClick={() => track("offer_view", { section: "prueba" })}>Probar gratis</a></nav>
      </header>

      <section className="ae-hero" id="inicio">
        <div><p className="ae-kicker"><span /> OPOSICIÓN AGE · SUBGRUPO C2</p><h1>Una oposición amplia. <em>Una ruta sencilla.</em></h1><p className="ae-lead">Preparación digital para el Cuerpo General Auxiliar de la Administración del Estado: normativa, psicotécnicos y ofimática en una experiencia de práctica que puedes repetir.</p><div className="ae-actions"><a className="ae-button ae-button-primary" href="#prueba" onClick={() => track("offer_view", { section: "hero" })}>Hacer la prueba gratuita <span>↘</span></a><a className="ae-text-link" href="#examen">Ver cómo es el examen</a></div><p className="ae-note">Material independiente. No es una página oficial de la Administración.</p></div>
        <FichaOposicion
          variant="compact"
          code="C2"
          tone="c2"
          admin="Administración General del Estado · subgrupo C2"
          title="Ficha del ejercicio"
          description="Un ejercicio, dos partes. Errores: −1/3 · preguntas en blanco: 0."
          status="Validación local · sin venta"
          indicators={[
            { value: "60", label: "preguntas: normativa + psicotécnicos" },
            { value: "50", label: "preguntas de actividad y ofimática" },
            { value: "90′", label: "tiempo máximo conjunto" },
            { value: "5", label: "preguntas de muestra gratuita" },
          ]}
          price={{ label: "Precio", value: "No publicado todavía", unavailable: true }}
          primary={{
            label: "Hacer la prueba",
            href: "#prueba",
            onClick: () => track("offer_view", { section: "ficha" }),
          }}
          secondary={{ label: "El examen", href: "#examen" }}
        />
      </section>

      <section className="ae-facts" id="examen"><p className="ae-kicker">La convocatoria que debes dominar</p><div className="ae-fact-grid"><div><b>1.700</b><span>plazas de ingreso libre en la convocatoria 2025</span></div><div><b>30 + 30</b><span>normativa y psicotécnicos en la primera parte</span></div><div><b>50</b><span>preguntas de actividad administrativa y ofimática</span></div><div><b>1/3</b><span>penalización por respuesta errónea</span></div></div><p className="ae-source">Datos de <a href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26262" target="_blank" rel="noreferrer">BOE-A-2025-26262</a> e <a href="https://www.inap.es/es/seleccion/procesos-selectivos-de-cuerposescalas-generales/cuerpo-general-auxiliar-de-la-administracion-del-estado" target="_blank" rel="noreferrer">INAP</a>. Windows 11 y Microsoft 365 de escritorio forman parte del bloque de ofimática.</p></section>

      <section className="ae-dark-section" id="metodo"><div className="ae-two-col"><div><p className="ae-kicker ae-kicker-light">No necesitas otra carpeta de PDFs</p><h2>Necesitas una ruta que te diga qué repetir.</h2></div><div className="ae-copy-light"><p>La plataforma separa normativa, psicotécnicos y ofimática. Cada sesión termina con una señal clara: qué dominas, qué has fallado y qué conviene volver a trabajar.</p><p>Sin horarios semanales obligatorios. Sin promesas de aprobado. Con práctica breve y medible.</p></div></div><div className="ae-method-grid"><article><b>01</b><h3>Entender</h3><p>Temario organizado por los dos bloques de la convocatoria y con fecha de revisión visible.</p></article><article><b>02</b><h3>Practicar</h3><p>Preguntas de normativa, razonamiento y Windows 11 / Microsoft 365.</p></article><article><b>03</b><h3>Repetir</h3><p>Corrección inmediata para volver al bloque que realmente necesita trabajo.</p></article></div></section>

      <section className="ae-practice" id="prueba"><div className="ae-section-heading"><div><p className="ae-kicker">Muestra gratuita · 5 preguntas</p><h2>Comprueba el enfoque antes de comprar.</h2></div><p>Preguntas de práctica propia. No son preguntas oficiales ni reproducen un examen protegido. La muestra sirve para que veas el formato de trabajo.</p></div><div className="ae-question-list">{QUESTIONS.map((question, index) => <fieldset className={`ae-question ${answers[question.id] !== undefined ? "is-answered" : ""}`} key={question.id}><legend><span>{String(index + 1).padStart(2, "0")}</span><div><small>{question.topic}</small>{question.prompt}</div></legend><div className="ae-options">{question.options.map((option, optionIndex) => <label className={answers[question.id] === optionIndex ? "is-selected" : ""} key={option}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => choose(question, optionIndex)} /><b>{String.fromCharCode(65 + optionIndex)}</b><span>{option}</span></label>)}</div></fieldset>)}</div><div className="ae-practice-footer"><p>{Object.keys(answers).length} / {QUESTIONS.length} respondidas</p><button className="ae-button ae-button-primary" disabled={Object.keys(answers).length !== QUESTIONS.length} onClick={complete}>Ver resultado <span>↘</span></button></div>{submitted && <div className="ae-result" id="resultado"><div><small>RESULTADO DE LA MUESTRA</small><strong>{score}/{QUESTIONS.length}</strong></div><div><h3>{score >= 4 ? "Buen punto de partida." : "Ya tienes un mapa de repaso."}</h3><p>{score >= 4 ? "El siguiente paso es entrenar con más preguntas y medir la segunda parte." : "La utilidad de practicar está en localizar el bloque que debes volver a estudiar."}</p><a className="ae-button ae-button-dark" href="https://wa.me/34640828654?text=Hola%20Academia%20LORMAN%2C%20he%20hecho%20la%20prueba%20de%20Auxiliar%20del%20Estado%20C2%20y%20quiero%20ver%20el%20acceso%20completo." target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click", { context: "offer" })}>Ver acceso completo <span>↗</span></a></div></div>}</section>

      <section className="ae-offer"><div><p className="ae-kicker">Acceso flexible</p><h2>Curso completo o refuerzo por bloques.</h2></div><div className="ae-offer-list"><div><b>Curso completo</b><span>Normativa + psicotécnicos + actividad administrativa + ofimática.</span></div><div><b>Pack de práctica</b><span>Tests autocorregibles y simulacros para entrenar los 90 minutos.</span></div><div><b>Refuerzo específico</b><span>Concentración en psicotécnicos o Windows 11 y Microsoft 365.</span></div></div><p className="ae-note">El precio y las condiciones deben mostrarse con claridad antes del pago. No mostramos cifras no verificadas.</p></section>
      <AvisoComun
        brand="Academia LORMAN"
        tagline="Preparación digital independiente para oposiciones."
        links={[
          { label: "Todos los cursos ↗", href: PORTFOLIO_URL },
          { label: "El examen", href: "#examen" },
          { label: "Método", href: "#metodo" },
          { label: "Prueba gratuita", href: "#prueba" },
        ]}
        notice={AVISO_BASE + AVISO_SIN_VENTA}
      />
      </main>
    </>
  );
}
