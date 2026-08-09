import { useMemo, useRef, useState } from "react";
import { PREGUNTAS_DIAGNOSTICO } from "../data/diagnostico";
import { trackEvent } from "../lib/analytics";
import { withCampaignReference } from "../lib/attribution";

type Answers = Record<string, number>;

const WHATSAPP = "34640828654";

export function DiagnosticoAuxilio() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const question = PREGUNTAS_DIAGNOSTICO[current];
  const score = useMemo(
    () => PREGUNTAS_DIAGNOSTICO.filter((item) => answers[item.id] === item.correcta).length,
    [answers],
  );
  const percentage = Math.round((score / PREGUNTAS_DIAGNOSTICO.length) * 100);

  const breakdown = useMemo(() => {
    const areas = [...new Set(PREGUNTAS_DIAGNOSTICO.map((item) => item.area))];
    return areas.map((area) => {
      const questions = PREGUNTAS_DIAGNOSTICO.filter((item) => item.area === area);
      return {
        area,
        correct: questions.filter((item) => answers[item.id] === item.correcta).length,
        total: questions.length,
      };
    });
  }, [answers]);

  const start = () => {
    startedAt.current = Date.now();
    setStarted(true);
    trackEvent("quiz_start", { quiz_name: "diagnostico_auxilio_20", question_count: 20 });
  };

  const finish = () => {
    const duration = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    setFinished(true);
    trackEvent("quiz_complete", {
      quiz_name: "diagnostico_auxilio_20",
      score,
      percentage,
      duration_seconds: duration,
      weakest_area: [...breakdown].sort((a, b) => a.correct / a.total - b.correct / b.total)[0]?.area || "",
    });
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setFinished(false);
    startedAt.current = Date.now();
    trackEvent("quiz_restart", { quiz_name: "diagnostico_auxilio_20" });
  };

  const whatsappMessage = withCampaignReference(
    `Hola, he terminado la prueba gratuita de Auxilio Judicial con ${score}/20. Quiero información sobre el acceso completo.`,
  );
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="lm-shell lm-diagnostico" id="prueba" aria-labelledby="diagnostico-titulo">
      <div className="lm-diagnostico-head">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Prueba gratuita · 20 preguntas</p>
          <h2 id="diagnostico-titulo">Descubre por dónde empezar o qué debes repasar.</h2>
        </div>
        <p>20 preguntas con corrección explicada y resultado inmediato sobre Constitución, funciones de Auxilio Judicial y actos de comunicación civil y penal. Úsala tanto si empiezas hoy como si ya estás repasando. Es una muestra parcial del programa oficial de 26 temas, no un simulacro completo.</p>
      </div>

      {!started ? (
        <div className="lm-diagnostico-intro">
          <div>
            <strong>10–12 min</strong>
            <span>Constitución Española · Funciones de Auxilio Judicial · Actos de comunicación civil y penal</span>
          </div>
          <button className="lm-btn lm-btn-primary" type="button" onClick={start}>Empezar la prueba</button>
        </div>
      ) : !finished ? (
        <div className="lm-quiz-panel">
          <div className="lm-quiz-progress" aria-label={`Pregunta ${current + 1} de ${PREGUNTAS_DIAGNOSTICO.length}`}>
            <span>{question.area}</span>
            <strong>{String(current + 1).padStart(2, "0")} / {PREGUNTAS_DIAGNOSTICO.length}</strong>
            <i style={{ width: `${((current + 1) / PREGUNTAS_DIAGNOSTICO.length) * 100}%` }} aria-hidden="true" />
          </div>
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
            <button type="button" className="lm-quiz-secondary" onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>Anterior</button>
            {current < PREGUNTAS_DIAGNOSTICO.length - 1 ? (
              <button type="button" className="lm-quiz-primary" onClick={() => setCurrent((value) => value + 1)} disabled={answers[question.id] === undefined}>Siguiente</button>
            ) : (
              <button type="button" className="lm-quiz-primary" onClick={finish} disabled={answers[question.id] === undefined}>Ver mi resultado</button>
            )}
          </div>
        </div>
      ) : (
        <div className="lm-diagnostic-result" ref={resultRef} tabIndex={-1} aria-live="polite">
          <div className="lm-result-score">
            <span>Tu resultado</span>
            <strong>{score}/20</strong>
            <p>{percentage >= 80 ? "Buena base en estas cuatro áreas. Ahora toca ganar velocidad y ampliar el repaso al resto del programa." : percentage >= 55 ? "Tienes base en esta muestra, pero aún hay puntos concretos que recuperar." : "Ya sabes por dónde empezar: repasa las áreas con más fallos y vuelve a probar."}</p>
          </div>
          <div className="lm-result-breakdown">
            <h3>Resultado por áreas</h3>
            {breakdown.map((item) => (
              <div key={item.area}>
                <span>{item.area}</span>
                <strong>{item.correct}/{item.total}</strong>
              </div>
            ))}
            <div className="lm-result-actions">
              <a className="lm-btn lm-btn-primary" href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { placement: "quiz_result", score })}>Ver el acceso completo</a>
              <button className="lm-btn lm-btn-outline" type="button" onClick={restart}>Repetir prueba</button>
            </div>
          </div>

          <div className="lm-answer-review">
            <h3>Revisa cada respuesta</h3>
            {PREGUNTAS_DIAGNOSTICO.map((item, index) => {
              const correct = answers[item.id] === item.correcta;
              return (
                <details key={item.id} className={correct ? "is-correct" : "is-wrong"}>
                  <summary><b>{String(index + 1).padStart(2, "0")}</b><span>{item.enunciado}</span><strong>{correct ? "Correcta" : "Para repasar"}</strong></summary>
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
