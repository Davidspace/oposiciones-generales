import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { trackLabEvent } from "@/lib/lab-analytics";

type SampleQuestion = {
  id: string;
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  source: string;
};

const SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    id: "c2-org-001",
    topic: "Organización pública · Constitución",
    prompt: "¿Cuál de estas opciones forma parte de los valores superiores del ordenamiento jurídico?",
    options: ["La productividad", "El pluralismo político", "La rentabilidad", "La neutralidad tecnológica"],
    answer: 1,
    explanation: "El artículo 1.1 de la Constitución incluye libertad, justicia, igualdad y pluralismo político.",
    source: "BOE-A-1978-31229, artículo 1.1",
  },
  {
    id: "c2-act-001",
    topic: "Actividad administrativa · plazos",
    prompt: "Cuando una norma señala un plazo por días sin indicar que son naturales, se entiende normalmente que son días:",
    options: ["Naturales", "Hábiles", "Lectivos", "De calendario laboral privado"],
    answer: 1,
    explanation: "La regla general de la Ley 39/2015 considera hábiles los días señalados por días, salvo previsión distinta.",
    source: "BOE-A-2015-10565, artículo 30",
  },
  {
    id: "c2-ps-001",
    topic: "Psicotécnico · serie numérica",
    prompt: "Completa la serie: 2, 5, 11, 23, ...",
    options: ["35", "42", "47", "51"],
    answer: 2,
    explanation: "Cada término es el anterior multiplicado por dos y más uno: 23 × 2 + 1 = 47.",
    source: "Elaboración propia",
  },
  {
    id: "c2-of-001",
    topic: "Ofimática · Excel 365",
    prompt: "En Excel, una fórmula comienza normalmente con:",
    options: ["=", "#", "@", "%"],
    answer: 0,
    explanation: "El signo igual indica que el contenido de la celda se evaluará como fórmula.",
    source: "Microsoft Support; consulta de referencia",
  },
  {
    id: "c2-of-005",
    topic: "Ofimática · Outlook 365",
    prompt: "El campo CCO de un correo sirve para:",
    options: ["Adjuntar un archivo", "Ocultar las direcciones de los destinatarios entre sí", "Firmar digitalmente el mensaje", "Convertir el mensaje en una cita"],
    answer: 1,
    explanation: "CCO (copia oculta) evita que cada destinatario vea las direcciones incluidas en ese campo.",
    source: "Microsoft Support; consulta de referencia",
  },
];

export default function C2Home() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => SAMPLE_QUESTIONS.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0), [answers]);

  useEffect(() => {
    trackLabEvent("landing_view", "c2");
    trackLabEvent("sample_view", "c2");
  }, []);

  function choose(question: SampleQuestion, option: number) {
    if (Object.keys(answers).length === 0) trackLabEvent("sample_start", "c2");
    setAnswers((current) => ({ ...current, [question.id]: option }));
  }

  function complete() {
    if (Object.keys(answers).length !== SAMPLE_QUESTIONS.length) return;
    setSubmitted(true);
    trackLabEvent("sample_complete", "c2", { score, total: SAMPLE_QUESTIONS.length });
    window.setTimeout(() => document.getElementById("c2-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  }

  return (
    <main className="c2-page">
      <header className="c2-header">
        <a className="c2-brand" href="/" aria-label="Volver a Academia LORMAN">
          <span className="c2-brand-mark">L</span>
          <span><strong>Academia LORMAN</strong><small>Auxiliar AGE · C2</small></span>
        </a>
        <nav aria-label="Navegación C2">
          <a href="#examen">El ejercicio</a>
          <a href="#prueba">Muestra</a>
          <a className="c2-nav-cta" href="#acceso" onClick={() => trackLabEvent("checkout_click", "c2")}>Preguntar por el acceso</a>
        </nav>
      </header>

      <section className="c2-hero" id="inicio">
        <div className="c2-hero-copy">
          <p className="c2-kicker"><span /> MUESTRA GRATUITA · MATERIAL PROPIO</p>
          <h1>Ordena el temario.<br /><em>Practica lo que te van a preguntar.</em></h1>
          <p className="c2-lead">Prueba cinco preguntas de normativa, psicotécnicos y ofimática. Responde, corrige y descubre qué bloque repasar.</p>
          <div className="c2-actions">
            <a className="c2-button c2-button-primary" href="#prueba" onClick={() => trackLabEvent("sample_view", "c2")}>Hacer la prueba gratis <ArrowUpRight size={16} aria-hidden="true" /></a>
            <a className="c2-text-link" href="/">Ver todos los cursos <ArrowLeft size={15} aria-hidden="true" /></a>
          </div>
          <p className="c2-note">Material independiente · no es una página oficial · convocatoria vigente siempre primero</p>
        </div>
        <div className="c2-sheet" aria-label="Ficha del ejercicio C2">
          <div className="c2-sheet-top"><span>FICHA 01 / C2</span><span>BOE · 2025</span></div>
          <div className="c2-sheet-title"><span>INGRESO LIBRE</span><strong>Practica lo que<br />tendrás que decidir.</strong></div>
          <div className="c2-sheet-grid"><div><b>1.700</b><span>plazas en la convocatoria citada</span></div><div><b>90′</b><span>tiempo máximo del ejercicio</span></div><div><b>−1/3</b><span>por respuesta errónea</span></div></div>
          <div className="c2-sheet-footer"><ShieldCheck size={17} aria-hidden="true" /><span>Datos de BOE-A-2025-26262</span></div>
        </div>
      </section>

      <section className="c2-facts" id="examen" aria-label="Datos oficiales comprobados">
        <p className="c2-kicker">La convocatoria que usamos como referencia</p>
        <div className="c2-fact-grid"><div><b>60</b><span>preguntas: organización y psicotécnicos</span></div><div><b>50</b><span>preguntas de actividad y ofimática</span></div><div><b>2</b><span>partes obligatorias y eliminatorias</span></div><div><b>25/50</b><span>mínimo de calificación por parte</span></div></div>
        <p className="c2-source">Fuente: <a href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-26262" target="_blank" rel="noreferrer">BOE-A-2025-26262</a>. Comprueba siempre la convocatoria vigente.</p>
      </section>

      <section className="c2-practice" id="prueba">
        <div className="c2-section-heading"><div><p className="c2-kicker">Muestra gratuita · 5 preguntas</p><h2>Cinco preguntas. Un mapa de repaso.</h2></div><p>Son preguntas propias, con explicación y fuente. No son preguntas oficiales ni sustituyen la convocatoria.</p></div>
        <div className="c2-question-list">
          {SAMPLE_QUESTIONS.map((question, index) => (
            <fieldset className={`c2-question ${answers[question.id] !== undefined ? "is-answered" : ""}`} key={question.id}>
              <legend><span>{String(index + 1).padStart(2, "0")}</span><div><small>{question.topic}</small>{question.prompt}</div></legend>
              <div className="c2-options">{question.options.map((option, optionIndex) => <label className={answers[question.id] === optionIndex ? "is-selected" : ""} key={option}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => choose(question, optionIndex)} /><b>{String.fromCharCode(65 + optionIndex)}</b><span>{option}</span></label>)}</div>
            </fieldset>
          ))}
        </div>
        <div className="c2-practice-footer"><p>{Object.keys(answers).length} / {SAMPLE_QUESTIONS.length} respondidas</p><button className="c2-button c2-button-primary" disabled={Object.keys(answers).length !== SAMPLE_QUESTIONS.length} onClick={complete}>Ver resultado <ArrowUpRight size={16} aria-hidden="true" /></button></div>
        {submitted && <div className="c2-result" id="c2-result"><div><small>RESULTADO DE LA MUESTRA</small><strong>{score}/{SAMPLE_QUESTIONS.length}</strong></div><div><h3>{score >= 4 ? "Buen punto de partida." : "Ya tienes un mapa de repaso."}</h3><p>La muestra identifica un área para volver a practicar. No equivale a una nota oficial ni predice el aprobado.</p><div className="c2-result-sources">{SAMPLE_QUESTIONS.map((question) => <span key={question.id}><Check size={13} aria-hidden="true" /> {question.source}</span>)}</div></div></div>}
      </section>

      <section className="c2-method"><div><p className="c2-kicker c2-kicker-light">Cómo funciona</p><h2>Un error te dice qué repasar después.</h2></div><div className="c2-method-copy"><p>La muestra separa cada error por área para que no tengas que revisar una carpeta completa: normativa, actividad, psicotécnicos u ofimática.</p><div className="c2-method-steps"><div><b>01</b><strong>Responde</strong><span>Una pregunta, una decisión.</span></div><div><b>02</b><strong>Entiende</strong><span>Explicación y fuente visible.</span></div><div><b>03</b><strong>Repite</strong><span>Repaso según el error.</span></div></div></div></section>

      <section className="c2-access" id="acceso"><div><p className="c2-kicker">Siguiente paso</p><h2>El aula completa está en preparación.</h2></div><div><p>Prueba el formato y escríbenos si quieres conocer el próximo acceso. Publicaremos precio y condiciones cuando el aula esté preparada.</p><a className="c2-button c2-button-dark" href="https://wa.me/34640828654?text=Hola%20Academia%20LORMAN%2C%20he%20probado%20la%20muestra%20de%20Auxiliar%20AGE%20C2%20y%20quiero%20informaci%C3%B3n." target="_blank" rel="noreferrer" onClick={() => trackLabEvent("checkout_click", "c2")}>Preguntar por el acceso <ArrowLeft size={16} aria-hidden="true" /></a></div></section>

      <footer className="c2-footer"><a className="c2-brand" href="/"><span className="c2-brand-mark">L</span><span><strong>Academia LORMAN</strong><small>Material independiente para preparar C2</small></span></a><p>Academia LORMAN es una marca privada de preparación de oposiciones, sin vinculación con la Administración, el Ministerio, los tribunales calificadores ni los organismos convocantes. Las bases y comunicaciones oficiales prevalecen. Ningún material garantiza la obtención de una plaza.</p><a href="/" onClick={() => trackLabEvent("telegram_click", "c2")}>Volver al selector <ArrowUpRight size={14} aria-hidden="true" /></a></footer>
    </main>
  );
}
