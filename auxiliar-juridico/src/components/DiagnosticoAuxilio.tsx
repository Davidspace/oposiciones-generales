import { useEffect, useMemo, useRef, useState } from "react";
import {
  CASOS_PRACTICOS,
  PREGUNTAS_MINI,
  PREGUNTAS_ORDINARIAS,
  type PreguntaMini,
} from "../data/diagnostico";
import { trackEvent } from "../lib/analytics";
import { withCampaignReference } from "../lib/attribution";

type Answers = Record<string, number | undefined>;

const WHATSAPP = "34640828654";
const THEORY_SECONDS = 20 * 60;
const PRACTICAL_SECONDS = 12 * 60;
const FIRST_PRACTICAL = PREGUNTAS_MINI.findIndex((item) => item.ejercicio === "practico");
const LAST_THEORY = FIRST_PRACTICAL - 1;
const SCORED_THEORY = PREGUNTAS_ORDINARIAS.filter((item) => item.ejercicio === "teorico");
const SCORED_PRACTICAL = PREGUNTAS_ORDINARIAS.filter((item) => item.ejercicio === "practico");

function scoreSection(questions: PreguntaMini[], answers: Answers, correctValue: number, wrongValue: number) {
  const correct = questions.filter((item) => answers[item.id] === item.correcta).length;
  const wrong = questions.filter((item) => answers[item.id] !== undefined && answers[item.id] !== item.correcta).length;
  const blank = questions.length - correct - wrong;
  return { correct, wrong, blank, raw: correct * correctValue - wrong * wrongValue, max: questions.length * correctValue };
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

function formatScore(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(".", ",");
}

export function DiagnosticoAuxilio() {
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
    const theory = scoreSection(SCORED_THEORY, answers, 0.6, 0.15);
    const practical = scoreSection(SCORED_PRACTICAL, answers, 1, 0.25);
    return {
      theory,
      practical,
      totalCorrect: theory.correct + practical.correct,
      totalScored: SCORED_THEORY.length + SCORED_PRACTICAL.length,
    };
  }, [answers]);

  const breakdown = useMemo(() => {
    const areas = [...new Set(PREGUNTAS_ORDINARIAS.map((item) => item.bloque))];
    return areas.map((area) => {
      const questions = PREGUNTAS_ORDINARIAS.filter((item) => item.bloque === area);
      return {
        area,
        correct: questions.filter((item) => answers[item.id] === item.correcta).length,
        total: questions.length,
      };
    });
  }, [answers]);

  const weakestArea = useMemo(
    () => [...breakdown].sort((a, b) => a.correct / a.total - b.correct / b.total)[0],
    [breakdown],
  );

  const start = () => {
    startedAt.current = Date.now();
    completedTracked.current = false;
    setStarted(true);
    trackEvent("quiz_start", {
      quiz_name: "mini_simulacro_auxilio_20_8",
      question_count: PREGUNTAS_MINI.length,
      scored_question_count: PREGUNTAS_ORDINARIAS.length,
    });
  };

  const finish = () => {
    setFinished(true);
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
    const duration = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    trackEvent("quiz_complete", {
      quiz_name: "mini_simulacro_auxilio_20_8",
      theory_score: score.theory.raw,
      practical_score: score.practical.raw,
      theory_correct: score.theory.correct,
      practical_correct: score.practical.correct,
      unanswered: score.theory.blank + score.practical.blank,
      duration_seconds: duration,
      timed_out: timedOut,
      weakest_area: weakestArea?.area || "",
    });
    window.setTimeout(() => resultRef.current?.focus(), 0);
  }, [breakdown, finished, score, timedOut, weakestArea]);

  const moveNext = () => {
    if (current === LAST_THEORY) {
      setCurrent(FIRST_PRACTICAL);
      setRemaining(PRACTICAL_SECONDS);
      return;
    }
    if (current >= PREGUNTAS_MINI.length - 1) {
      finish();
      return;
    }
    setCurrent((value) => value + 1);
  };

  const movePrevious = () => {
    setCurrent((value) => Math.max(value < FIRST_PRACTICAL ? 0 : FIRST_PRACTICAL, value - 1));
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
    trackEvent("quiz_restart", { quiz_name: "mini_simulacro_auxilio_20_8" });
  };

  const whatsappMessage = withCampaignReference(
    `Hola, he terminado el mini simulacro gratuito de Auxilio Judicial: ${score.theory.correct}/20 teóricas y ${score.practical.correct}/8 prácticas. Quiero acceder al aula completa por 29 € hasta el examen.`,
  );
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
  const sectionLabel = question.ejercicio === "teorico" ? "Ejercicio teórico · 20 preguntas" : "Ejercicio práctico · 8 preguntas";

  return (
    <section className="lm-shell lm-diagnostico" id="prueba" aria-labelledby="diagnostico-titulo">
      <div className="lm-diagnostico-head">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Prueba gratuita · mini simulacro · 20 teóricas + 8 prácticas</p>
          <h2 id="diagnostico-titulo">Haz una prueba seria antes de pagar.</h2>
        </div>
        <p>Comprueba ahora cómo preguntamos, cómo corregimos y qué te llevarás al aula. Son 20 preguntas teóricas en 20 minutos y 8 prácticas en 12 minutos, sobre dos casos originales. Sin registro y con todas las explicaciones al terminar.</p>
      </div>

      {!started ? (
        <div className="lm-diagnostico-start">
          <div className="lm-diagnostico-benefits" aria-label="Qué incluye la prueba gratuita">
            <div><span>01</span><strong>Sin registro</strong><p>Entras directamente. No pedimos email ni datos personales.</p></div>
            <div><span>02</span><strong>Resultado útil</strong><p>Verás tu puntuación por ejercicio y una prioridad concreta de repaso.</p></div>
            <div><span>03</span><strong>Corrección explicada</strong><p>Revisa cada respuesta y consulta la norma consolidada en el BOE.</p></div>
          </div>
          <div className="lm-diagnostico-intro">
            <div>
              <span className="lm-diagnostico-kicker">Tu sesión de práctica</span>
              <strong>20 min para teoría · 12 min para práctica</strong>
              <span>28 puntuables + 2 de reserva · dos casos originales · puntuación con penalización</span>
            </div>
            <div className="lm-diagnostico-start-action">
              <button className="lm-btn lm-btn-primary" type="button" onClick={start}>Empezar gratis ahora</button>
              <small>Muestra propia, no examen oficial. El contador comienza al pulsar y puedes dejar preguntas en blanco.</small>
            </div>
          </div>
        </div>
      ) : !finished ? (
        <div className="lm-quiz-panel">
          <div className="lm-quiz-progress" aria-label={`Pregunta ${current + 1} de ${PREGUNTAS_MINI.length}`}>
            <div>
              <span>{sectionLabel} · {question.bloque}</span>
              <strong>{String(current + 1).padStart(2, "0")} / {PREGUNTAS_MINI.length}</strong>
            </div>
            <div className="lm-quiz-timer" aria-live="polite">Tiempo: <b>{formatTime(remaining)}</b></div>
            <i style={{ width: `${((current + 1) / PREGUNTAS_MINI.length) * 100}%` }} aria-hidden="true" />
          </div>

          {question.caso ? (
            <aside className="lm-quiz-case">
              <span>Supuesto práctico</span>
              <strong>{CASOS_PRACTICOS[question.caso].titulo}</strong>
              <p>{CASOS_PRACTICOS[question.caso].texto}</p>
            </aside>
          ) : null}

          {question.reserva ? <p className="lm-quiz-reserve"><b>Pregunta de reserva.</b> No entra en la puntuación ordinaria del mini simulacro.</p> : null}

          <fieldset className="lm-diagnostic-question">
            <legend>{question.enunciado}</legend>
            <div className="lm-diagnostic-options">
              {question.opciones.map((option, index) => (
                <label key={option} className={answers[question.id] === index ? "is-selected" : ""}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === index}
                    onChange={() => setAnswers((value) => ({ ...value, [question.id]: index }))}
                  />
                  <b>{"ABCD"[index]}</b>
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="lm-quiz-nav">
            <button type="button" className="lm-quiz-secondary" onClick={movePrevious} disabled={current === 0 || current === FIRST_PRACTICAL}>Anterior</button>
            <button type="button" className="lm-quiz-secondary" onClick={leaveBlankAndContinue}>Dejar en blanco</button>
            {current < PREGUNTAS_MINI.length - 1 ? (
              <button type="button" className="lm-quiz-primary" onClick={moveNext}>Siguiente</button>
            ) : (
              <button type="button" className="lm-quiz-primary" onClick={finish}>Ver mi resultado</button>
            )}
          </div>
          <p className="lm-quiz-note">Puntuación orientativa: +0,60 / −0,15 en teoría y +1 / −0,25 en práctica. Las preguntas en blanco no penalizan.</p>
        </div>
      ) : (
        <div className="lm-diagnostic-result" ref={resultRef} tabIndex={-1} aria-live="polite">
          <div className="lm-result-score">
            <span>Tu resultado orientativo</span>
            <strong>{score.totalCorrect}/{score.totalScored}</strong>
            <p>{timedOut ? "Se agotó el tiempo de uno de los bloques. Revisa tus respuestas y vuelve a practicar." : score.totalCorrect >= 22 ? "Buena base en esta muestra. Ahora toca ganar velocidad y dar más vueltas al programa." : score.totalCorrect >= 15 ? "Tienes una base útil, pero aún hay puntos concretos que recuperar antes del examen." : "Ya tienes un mapa claro para empezar: repasa tus fallos y vuelve a intentarlo."}</p>
          </div>

          <div className="lm-result-breakdown">
            <h3>Puntuación por ejercicio</h3>
            <div className="lm-result-score-grid">
              <div><span>Teórico</span><strong>{formatScore(score.theory.raw)} / 12</strong><small>{score.theory.correct}/20 aciertos · {score.theory.blank} en blanco</small></div>
              <div><span>Práctico</span><strong>{formatScore(score.practical.raw)} / 8</strong><small>{score.practical.correct}/8 aciertos · {score.practical.blank} en blanco</small></div>
            </div>
            <h3>Bloques que has practicado</h3>
            {breakdown.map((item) => (
              <div key={item.area}>
                <span>{item.area}</span>
                <strong>{item.correct}/{item.total}</strong>
              </div>
            ))}
          </div>

          <section className="lm-result-next" aria-labelledby="siguiente-paso-titulo">
            <div className="lm-result-priority">
              <span>Tu prioridad sugerida</span>
              <h3 id="siguiente-paso-titulo">{weakestArea?.area || "Revisar las respuestas"}</h3>
              <p>Es el área con menor proporción de aciertos en esta muestra. Abre las explicaciones de abajo, repasa la fuente y vuelve a intentarlo.</p>
            </div>
            <div className="lm-result-continuity">
              <span>Si quieres seguir</span>
              <h3>Practica los 26 temas hasta octubre.</h3>
              <ul>
                <li>Tests por temas y repasos acumulativos.</li>
                <li>Supuestos prácticos y simulacros.</li>
                <li>Corrección automática para repetir a tu ritmo.</li>
              </ul>
              <div className="lm-result-actions">
                <a className="lm-btn lm-btn-primary" href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { placement: "quiz_result", score: score.totalCorrect })}>Seguir practicando por 29 €</a>
                <button className="lm-btn lm-btn-outline" type="button" onClick={restart}>Repetir la prueba</button>
              </div>
              <small>Un solo pago · acceso hasta el examen · el botón abre WhatsApp.</small>
            </div>
          </section>

          <div className="lm-answer-review">
            <div className="lm-answer-review-head">
              <h3>Revisa cada respuesta</h3>
              <p>Abre cada pregunta para ver la solución, la explicación y su fuente oficial.</p>
            </div>
            {PREGUNTAS_MINI.map((item, index) => {
              const answered = answers[item.id] !== undefined;
              const correct = answers[item.id] === item.correcta;
              const status = item.reserva ? "Reserva" : correct ? "Correcta" : answered ? "Para repasar" : "En blanco";
              return (
                <details key={item.id} className={item.reserva ? "is-reserve" : correct ? "is-correct" : "is-wrong"}>
                  <summary><b>{String(index + 1).padStart(2, "0")}</b><span>{item.enunciado}</span><strong>{status}</strong></summary>
                  <div>
                    <p><b>Respuesta correcta:</b> {item.opciones[item.correcta]}</p>
                    <p>{item.explicacion}</p>
                    <a href={item.fuente.href} target="_blank" rel="noreferrer">Consultar {item.fuente.etiqueta} en el BOE</a>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
