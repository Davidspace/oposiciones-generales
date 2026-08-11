import { useEffect, useMemo, useRef, useState } from "react";
import {
  CASOS_PRACTICOS,
  PREGUNTAS_MINI,
  PREGUNTAS_ORDINARIAS,
  PREGUNTAS_PRACTICAS,
  PREGUNTAS_TEORICAS,
  type PreguntaMini,
} from "../data/diagnostico";
import { trackEvent } from "../lib/analytics";
import { withCampaignReference } from "../lib/attribution";

type Answers = Record<string, number | undefined>;

const WHATSAPP = "34640828654";
const THEORY_SECONDS = 10 * 60;
const PRACTICAL_SECONDS = 8 * 60;
const FIRST_PRACTICAL = PREGUNTAS_MINI.findIndex((item) => item.ejercicio === "practico");
const LAST_THEORY = FIRST_PRACTICAL - 1;

function scoreSection(questions: PreguntaMini[], answers: Answers, correctValue: number, wrongValue: number) {
  const correct = questions.filter((item) => answers[item.id] === item.correcta).length;
  const wrong = questions.filter((item) => answers[item.id] !== undefined && answers[item.id] !== item.correcta).length;
  const blank = questions.length - correct - wrong;
  return { correct, wrong, blank, raw: correct * correctValue - wrong * wrongValue, max: questions.length * correctValue };
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function formatScore(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(".", ",");
}

export function DiagnosticoBiblioteca() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(THEORY_SECONDS);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const startedAt = useRef(0);
  const completedTracked = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const question = PREGUNTAS_MINI[current];

  const score = useMemo(() => {
    const theory = scoreSection(PREGUNTAS_TEORICAS, answers, 1, 0.25);
    const practical = scoreSection(PREGUNTAS_PRACTICAS, answers, 1, 0.25);
    return { theory, practical, totalCorrect: theory.correct + practical.correct, totalScored: PREGUNTAS_ORDINARIAS.length };
  }, [answers]);

  const breakdown = useMemo(() => {
    const areas = [...new Set(PREGUNTAS_ORDINARIAS.map((item) => item.bloque))];
    return areas.map((area) => {
      const questions = PREGUNTAS_ORDINARIAS.filter((item) => item.bloque === area);
      return { area, correct: questions.filter((item) => answers[item.id] === item.correcta).length, total: questions.length };
    });
  }, [answers]);

  const quizName = "mini_simulacro_biblioteca_santander";
  const start = () => {
    startedAt.current = Date.now();
    completedTracked.current = false;
    setStarted(true);
    trackEvent("quiz_start", { quiz_name: quizName, question_count: PREGUNTAS_MINI.length, scored_question_count: PREGUNTAS_ORDINARIAS.length });
  };

  useEffect(() => {
    if (!started || finished) return undefined;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value > 1) return value - 1;
        if (current < FIRST_PRACTICAL) {
          setCurrent(FIRST_PRACTICAL);
          return PRACTICAL_SECONDS;
        }
        setTimedOut(true);
        setFinished(true);
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [current, finished, started]);

  useEffect(() => {
    if (!finished || completedTracked.current) return;
    completedTracked.current = true;
    trackEvent("quiz_complete", {
      quiz_name: quizName,
      theory_score: score.theory.raw,
      practical_score: score.practical.raw,
      theory_correct: score.theory.correct,
      practical_correct: score.practical.correct,
      unanswered: score.theory.blank + score.practical.blank,
      duration_seconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
      timed_out: timedOut,
      weakest_area: [...breakdown].sort((a, b) => a.correct / a.total - b.correct / b.total)[0]?.area || "",
    });
    window.setTimeout(() => resultRef.current?.focus(), 0);
  }, [breakdown, finished, score, timedOut]);

  const moveNext = () => {
    if (current === LAST_THEORY) {
      setCurrent(FIRST_PRACTICAL);
      setRemaining(PRACTICAL_SECONDS);
      return;
    }
    if (current >= PREGUNTAS_MINI.length - 1) {
      setFinished(true);
      return;
    }
    setCurrent((value) => value + 1);
  };

  const movePrevious = () => {
    if (current === FIRST_PRACTICAL) {
      setCurrent(LAST_THEORY);
      setRemaining(THEORY_SECONDS);
      return;
    }
    setCurrent((value) => Math.max(0, value - 1));
  };

  const leaveBlankAndContinue = () => {
    setAnswers((value) => ({ ...value, [question.id]: undefined }));
    moveNext();
  };

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setRemaining(THEORY_SECONDS);
    setTimedOut(false);
    setFinished(false);
    completedTracked.current = false;
    startedAt.current = Date.now();
    trackEvent("quiz_restart", { quiz_name: quizName });
  };

  const whatsappMessage = withCampaignReference(
    `Hola, he terminado la prueba gratuita de Auxiliar de Biblioteca de Santander: ${score.theory.correct}/${PREGUNTAS_TEORICAS.length} teóricas y ${score.practical.correct}/${PREGUNTAS_PRACTICAS.length} prácticas. Quiero información sobre el aula.`,
  );
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
  const sectionLabel = question.ejercicio === "teorico" ? `Parte de programa · ${PREGUNTAS_TEORICAS.length} preguntas` : `Práctica · ${PREGUNTAS_PRACTICAS.length} preguntas`;

  return (
    <section className="lm-shell lm-diagnostico" id="prueba" aria-labelledby="diagnostico-titulo">
      <div className="lm-diagnostico-head">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Prueba gratuita · enfoque · catálogo y programa</p>
          <h2 id="diagnostico-titulo">Comprueba cómo empezarías.</h2>
        </div>
        <p>Una muestra propia para reconocer el formato: 10 preguntas sobre el programa y 4 ejercicios de búsqueda y referencia. Tiene tiempo, corrección explicada y fuentes de la convocatoria. No es un examen oficial.</p>
      </div>

      {!started ? (
        <div className="lm-diagnostico-intro">
          <div>
            <strong>Dos bloques cronometrados</strong>
            <span>10 min de programa · 8 min de práctica · casos originales de catálogo y referencia</span>
          </div>
          <button className="lm-btn lm-btn-primary" type="button" onClick={start}>Empezar la prueba</button>
        </div>
      ) : !finished ? (
        <div className="lm-quiz-panel">
          <div className="lm-quiz-progress" aria-label={`Pregunta ${current + 1} de ${PREGUNTAS_MINI.length}`}>
            <div><span>{sectionLabel} · {question.bloque}</span><strong>{String(current + 1).padStart(2, "0")} / {PREGUNTAS_MINI.length}</strong></div>
            <div className="lm-quiz-timer" aria-live="polite">Tiempo: <b>{formatTime(remaining)}</b></div>
            <i style={{ width: `${((current + 1) / PREGUNTAS_MINI.length) * 100}%` }} aria-hidden="true" />
          </div>

          {question.caso ? (
            <aside className="lm-quiz-case">
              <span>Ejercicio práctico</span>
              <strong>{CASOS_PRACTICOS[question.caso].titulo}</strong>
              <p>{CASOS_PRACTICOS[question.caso].texto}</p>
            </aside>
          ) : null}
          {question.reserva ? <p className="lm-quiz-reserve"><b>Pregunta de reserva.</b> La usamos para practicar, pero no entra en el resultado ordinario.</p> : null}

          <fieldset className="lm-diagnostic-question">
            <legend>{question.enunciado}</legend>
            <div className="lm-diagnostic-options">
              {question.opciones.map((option, index) => (
                <label key={option} className={answers[question.id] === index ? "is-selected" : ""}>
                  <input type="radio" name={question.id} checked={answers[question.id] === index} onChange={() => setAnswers((value) => ({ ...value, [question.id]: index }))} />
                  <b>{"ABCD"[index]}</b><span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="lm-quiz-nav">
            <button type="button" className="lm-quiz-secondary" onClick={movePrevious} disabled={current === 0}>Anterior</button>
            <button type="button" className="lm-quiz-secondary" onClick={leaveBlankAndContinue}>Dejar en blanco</button>
            {current < PREGUNTAS_MINI.length - 1 ? <button type="button" className="lm-quiz-primary" onClick={moveNext}>Siguiente</button> : <button type="button" className="lm-quiz-primary" onClick={() => setFinished(true)}>Ver mi resultado</button>}
          </div>
          <p className="lm-quiz-note">Puntuación orientativa de entrenamiento: +1 por acierto, −0,25 por error y 0 en blanco. No reproduce una nota oficial.</p>
        </div>
      ) : (
        <div className="lm-diagnostic-result" ref={resultRef} tabIndex={-1} aria-live="polite">
          <div className="lm-result-score">
            <span>Tu resultado orientativo</span>
            <strong>{score.totalCorrect}/{score.totalScored}</strong>
            <p>{timedOut ? "Se agotó uno de los bloques. Revisa tus respuestas y vuelve a practicar." : score.totalCorrect >= 11 ? "Buen punto de partida. Ahora toca ganar precisión en catálogo y referencias." : score.totalCorrect >= 7 ? "Ya tienes una base útil. Usa los fallos para ordenar el estudio." : "La prueba te deja un mapa claro: empieza por el programa y practica la búsqueda paso a paso."}</p>
          </div>
          <div className="lm-result-breakdown">
            <h3>Resultado por bloque</h3>
            <div className="lm-result-score-grid">
              <div><span>Programa</span><strong>{formatScore(score.theory.raw)} / {PREGUNTAS_TEORICAS.length}</strong><small>{score.theory.correct}/{PREGUNTAS_TEORICAS.length} aciertos · {score.theory.blank} en blanco</small></div>
              <div><span>Práctica</span><strong>{formatScore(score.practical.raw)} / {PREGUNTAS_PRACTICAS.length}</strong><small>{score.practical.correct}/{PREGUNTAS_PRACTICAS.length} aciertos · {score.practical.blank} en blanco</small></div>
            </div>
            <h3>Áreas que has practicado</h3>
            {breakdown.map((item) => <div key={item.area}><span>{item.area}</span><strong>{item.correct}/{item.total}</strong></div>)}
            <div className="lm-result-actions">
              <a className="lm-btn lm-btn-primary" href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { placement: "quiz_result", score: score.totalCorrect })}>Quiero información</a>
              <button className="lm-btn lm-btn-outline" type="button" onClick={restart}>Repetir la prueba</button>
            </div>
          </div>
          <div className="lm-answer-review">
            <h3>Revisa cada respuesta</h3>
            {PREGUNTAS_MINI.map((item, index) => {
              const answered = answers[item.id] !== undefined;
              const correct = answers[item.id] === item.correcta;
              const status = item.reserva ? "Reserva" : correct ? "Correcta" : answered ? "Para repasar" : "En blanco";
              return <details key={item.id} className={item.reserva ? "is-reserve" : correct ? "is-correct" : "is-wrong"}><summary><b>{String(index + 1).padStart(2, "0")}</b><span>{item.enunciado}</span><strong>{status}</strong></summary><div><p><b>Respuesta correcta:</b> {item.opciones[item.correcta]}</p><p>{item.explicacion}</p><a href={item.fuente.href} target="_blank" rel="noreferrer">Consultar {item.fuente.etiqueta}</a></div></details>;
            })}
          </div>
        </div>
      )}
    </section>
  );
}
