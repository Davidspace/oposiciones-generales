"use client";

import { useEffect, useMemo, useState } from "react";
import { PORTFOLIO_URL } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_BASE, AVISO_PRECIOS } from "@/components/AvisoComun";
import { Cajon, CajonCierre } from "@/components/Cajones";
import { CtaContacto } from "@/components/CtaContacto";
import { MuestraMaterial } from "@/components/MuestraMaterial";

const EXPERIMENT = "administrativo-estado-c2";
const WHATSAPP = "34640828654";

type Question = { id: string; topic: string; prompt: string; options: string[]; answer: number };

const QUESTIONS: Question[] = [
  { id: "q1", topic: "Psicotécnico · verbal", prompt: "Elige la palabra que completa mejor la relación: archivo es a documento como biblioteca es a…", options: ["persona", "libro", "estantería", "oficina"], answer: 1 },
  { id: "q2", topic: "Organización pública", prompt: "¿Qué norma regula el procedimiento administrativo común de las Administraciones Públicas?", options: ["Ley 39/2015", "Ley 40/2015", "Ley 9/2017", "Real Decreto Legislativo 5/2015"], answer: 0 },
  { id: "q3", topic: "Actividad administrativa", prompt: "En un procedimiento administrativo, los plazos señalados por días se entienden, con carácter general, como:", options: ["Naturales", "Hábiles", "Laborales de la Administración", "Días lectivos"], answer: 1 },
  { id: "q4", topic: "Ofimática · Excel 365", prompt: "En Excel de escritorio, una fórmula comienza normalmente con el signo:", options: ["#", "@", "=", "%"], answer: 2 },
  { id: "q5", topic: "Psicotécnico · numérico", prompt: "Completa la serie: 3, 6, 12, 24, …", options: ["30", "36", "42", "48"], answer: 3 },
];

function track(eventType: string, metadata?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const sessionKey = "admin-estado-c2-session";
  const current = window.sessionStorage.getItem(sessionKey) ?? crypto.randomUUID();
  window.sessionStorage.setItem(sessionKey, current);
  const query = new URLSearchParams(window.location.search);
  void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, body: JSON.stringify({ eventId: crypto.randomUUID(), sessionId: current, experiment: EXPERIMENT, offerVariant: "hub-free-sample-c2-v1", eventType, path: window.location.pathname, utmSource: query.get("utm_source"), utmMedium: query.get("utm_medium"), utmCampaign: query.get("utm_campaign"), metadata: metadata ?? {} }) }).catch(() => undefined);
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
    track("diagnostic_complete", { correct: score, unanswered: 0, dominantError: score < 3 ? "fundamentos" : "consolidado", scoreBand: score >= 4 ? "solid" : score >= 3 ? "developing" : "priority" });
    window.setTimeout(() => document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  return (
    <>
      <a className="ae-skip-link" href="#contenido-principal">Saltar al contenido</a>
      <main className="lm-page lm-aux" id="contenido-principal" tabIndex={-1}>
        <header className="lm-shell lm-header">
          <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio"><img src="/lorman-logo.png" alt="Academia LORMAN" /></a>
          <nav className="lm-nav" aria-label="Navegación principal"><a className="ae-nav-home" href={PORTFOLIO_URL}>Todos los cursos</a><a href="#examen">Examen</a><a href="#muestra">Muestra</a><a href="#metodo">Método</a><a href="#prueba">Prueba gratuita</a></nav>
        </header>

        <section className="lm-shell lm-hero" id="inicio">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Oposición AGE · subgrupo C2</p>
          <h1>Una oposición amplia.<br />Una ruta sencilla.</h1>
          <p className="lm-lead">Preparación digital para el Cuerpo General Auxiliar de la Administración del Estado: normativa, psicotécnicos y ofimática en una experiencia de práctica que puedes repetir.</p>
          <CtaContacto whatsapp={WHATSAPP}>
            <a className="lm-btn lm-btn-outline" href="#prueba" onClick={() => track("offer_view", { section: "hero" })}>Hacer la prueba gratuita</a>
            <a className="lm-btn lm-btn-outline" href="#examen">Ver el examen</a>
          </CtaContacto>
        </section>

        <section className="lm-shell lm-boxes" id="examen" aria-label="Datos del ejercicio">
          <Cajon kicker="01 · TEMARIO" title="Normativa y psicotécnicos" text="La primera parte combina preguntas de normativa y psicotécnicos para medir fundamentos y razonamiento." figure="30 + 30 preguntas" />
          <Cajon kicker="02 · TEST" title="Actividad y ofimática" text="La segunda parte trabaja actividad administrativa y ofimática: Windows 11 y Microsoft 365 de escritorio." figure="50 preguntas" />
          <Cajon kicker="03 · SIMULACROS" title="Práctica breve" text="Responde una muestra autocorregible y observa qué bloque merece el siguiente repaso." figure="90 minutos de examen" />
          <CajonCierre kicker="04 · PRECIO / ACCESO" title="En validación" text="El precio y las condiciones de acceso se publicarán cuando el aula esté preparada." href={`https://wa.me/${WHATSAPP}?text=Hola%20Academia%20LORMAN%2C%20quiero%20informaci%C3%B3n%20sobre%20Auxiliar%20del%20Estado%20C2.`} />
        </section>

        <MuestraMaterial
          grupos={[{
            paginas: [{}, {}, {}, {}],
            nota: "La muestra de páginas se incorporará cuando el programa editorial esté preparado.",
          }]}
          preguntas={[]}
        />

        <section className="lm-shell lm-panel" id="metodo">
          <span className="lm-panel-kicker">Método de trabajo</span>
          <div className="lm-panel-row"><strong>01 · Entender</strong><span>Temario organizado por normativa, psicotécnicos, actividad y ofimática.</span></div>
          <div className="lm-panel-row"><strong>02 · Practicar</strong><span>Preguntas de práctica propia para comprobar lo aprendido.</span></div>
          <div className="lm-panel-row"><strong>03 · Repetir</strong><span>El resultado te indica qué bloque merece el siguiente intento.</span></div>
        </section>

        <section className="lm-shell lm-quiz" id="prueba" aria-labelledby="prueba-title">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Muestra gratuita · 5 preguntas</p>
          <h2 id="prueba-title" className="lm-display">Comprueba el enfoque antes de comprar.</h2>
          <p className="lm-lead">Preguntas de práctica propia. No son preguntas oficiales ni reproducen un examen protegido.</p>
          <div className="lm-question-list">
            {QUESTIONS.map((question, index) => (
              <fieldset className={`lm-question ${answers[question.id] !== undefined ? "is-answered" : ""}`} key={question.id}>
                <legend><span>{String(index + 1).padStart(2, "0")}</span><div><small>{question.topic}</small>{question.prompt}</div></legend>
                <div className="lm-options">{question.options.map((option, optionIndex) => <label className={answers[question.id] === optionIndex ? "is-selected" : ""} key={option}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => choose(question, optionIndex)} /><b>{String.fromCharCode(65 + optionIndex)}</b><span>{option}</span></label>)}</div>
              </fieldset>
            ))}
          </div>
          <div className="lm-quiz-actions"><span>{Object.keys(answers).length} / {QUESTIONS.length} respondidas</span><button className="lm-btn lm-btn-primary" disabled={Object.keys(answers).length !== QUESTIONS.length} onClick={complete}>Ver resultado</button></div>
          {submitted ? <div className="lm-result" id="resultado" aria-live="polite"><div><span className="lm-panel-kicker">Resultado de la muestra</span><strong>{score}/{QUESTIONS.length}</strong></div><div><h3>{score >= 4 ? "Buen punto de partida." : "Ya tienes un mapa de repaso."}</h3><p>{score >= 4 ? "El siguiente paso es entrenar con más preguntas y medir la segunda parte." : "La utilidad de practicar está en localizar el bloque que debes volver a estudiar."}</p><a className="lm-btn lm-btn-outline" href={`https://wa.me/${WHATSAPP}?text=Hola%20Academia%20LORMAN%2C%20he%20hecho%20la%20prueba%20de%20Auxiliar%20del%20Estado%20C2.`} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click", { context: "offer" })}>Consultar acceso</a></div></div> : null}
        </section>

        <AvisoComun links={[{ label: "Todos los cursos", href: PORTFOLIO_URL }, { label: "Examen", href: "#examen" }, { label: "Prueba gratuita", href: "#prueba" }]} notice={AVISO_BASE + AVISO_PRECIOS} />
      </main>
    </>
  );
}
