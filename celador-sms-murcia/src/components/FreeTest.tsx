import { useEffect, useMemo, useRef, useState } from "react";
import { FREE_TEST } from "../data/free-test";
import { trackEvent } from "../lib/analytics";

type FreeTestProps = { whatsappUrl: string };
const TEST_SECONDS = 17 * 60;
const PROGRESS_MARKS = [25, 50, 75, 100];

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function FreeTest({ whatsappUrl }: FreeTestProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TEST_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const progressMarks = useRef(new Set<number>());
  const answered = Object.keys(answers).length;
  const result = useMemo(() => {
    const blocks = (["Común", "Específica"] as const).map((block) => {
      const questions = FREE_TEST.filter((question) => question.block === block);
      const correct = questions.filter((question) => answers[question.id] === question.answer).length;
      const wrong = questions.filter((question) => answers[question.id] !== undefined && answers[question.id] !== question.answer).length;
      const blank = questions.length - correct - wrong;
      return { block, total: questions.length, correct, wrong, blank, net: correct - wrong * 0.25 };
    });
    const net = blocks.reduce((total, block) => total + block.net, 0);
    const weakest = [...blocks].sort((a, b) => (a.net / a.total) - (b.net / b.total))[0];
    return { blocks, net, weakest };
  }, [answers]);

  useEffect(() => {
    if (submitted) return undefined;
    if (secondsLeft <= 0) {
      setTimedOut(true);
      setSubmitted(true);
      trackEvent("free_test_timeout", { course: "celador_sms_murcia", answered });
      return undefined;
    }
    const timer = window.setInterval(() => setSecondsLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [answered, secondsLeft, submitted]);

  const setAnswer = (id: string, answer: number) => {
    const nextAnswers = { ...answers, [id]: answer };
    setAnswers(nextAnswers);
    trackEvent("free_test_answer", { course: "celador_sms_murcia", answered_count: Object.keys(nextAnswers).length });
    const nextProgress = (Object.keys(nextAnswers).length / FREE_TEST.length) * 100;
    PROGRESS_MARKS.forEach((mark) => {
      if (nextProgress >= mark && !progressMarks.current.has(mark)) {
        progressMarks.current.add(mark);
        trackEvent("free_test_progress", { course: "celador_sms_murcia", progress: mark });
      }
    });
  };

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    trackEvent("complete_free_test", { course: "celador_sms_murcia", score: result.net, total: FREE_TEST.length, answered });
  };

  return (
    <section className="lm-sms-test" id="prueba" aria-labelledby="prueba-title">
      <div className="lm-sms-test-heading">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Prueba gratuita · 15 preguntas</p>
          <h2 id="prueba-title">Comprueba cómo vas antes de pagar.</h2>
        </div>
        <p>Una muestra propia con el formato del ejercicio del SMS: materias comunes y específicas, preguntas prácticas, cuatro opciones y corrección explicada. No es un examen oficial.</p>
      </div>
      <div className="lm-sms-test-meta"><span>{answered}/{FREE_TEST.length} respondidas</span><span className="lm-sms-timer" aria-live="polite">Tiempo {formatTime(secondsLeft)}</span><span>−0,25 por error · en blanco no resta</span><span>Sin registro obligatorio</span></div>
      <div className="lm-sms-question-list">
        {FREE_TEST.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.answer;
          return (
            <fieldset className={`lm-sms-question ${submitted ? (selected === undefined ? "is-blank" : isCorrect ? "is-correct" : "is-wrong") : ""}`} key={question.id}>
              <legend><span>{String(index + 1).padStart(2, "0")}</span><b>{question.block}</b>{question.question}</legend>
              <div className="lm-sms-options">
                {question.options.map((option, optionIndex) => (
                  <label className={selected === optionIndex ? "is-selected" : ""} key={option}>
                    <input type="radio" name={question.id} checked={selected === optionIndex} onChange={() => setAnswer(question.id, optionIndex)} />
                    <strong>{String.fromCharCode(65 + optionIndex)}</strong>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {submitted ? <div className="lm-sms-explanation"><strong>{selected === undefined ? "Sin responder" : isCorrect ? "Correcta" : `Respuesta: ${String.fromCharCode(65 + question.answer)}`}</strong><p>{question.explanation}</p><small>{question.source}</small></div> : null}
            </fieldset>
          );
        })}
      </div>
      <div className="lm-sms-test-actions">
        <button className="lm-btn lm-btn-primary" type="button" onClick={submit} disabled={submitted}>{submitted ? "Prueba completada" : "Terminar y ver mi resultado"}</button>
        {submitted ? <div className="lm-sms-result" role="status">
          <div className="lm-sms-result-score"><strong>{result.net.toFixed(2).replace(".", ",")}</strong><span>puntos netos orientativos<br />{timedOut ? "Tiempo agotado" : `con ${answered} respuestas`}</span></div>
          <div className="lm-sms-result-breakdown" aria-label="Resultado por bloques">{result.blocks.map((block) => <span key={block.block}><b>{block.block}</b>{block.correct}/{block.total} · {block.wrong} errores · {block.blank} en blanco</span>)}</div>
          <p><strong>Repaso recomendado:</strong> empieza por <b>{result.weakest.block.toLowerCase()}</b>; vuelve al resumen y repite el test del bloque antes de hacer otro simulacro.</p>
          <a className="lm-btn lm-btn-outline" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent("click_whatsapp", { course: "celador_sms_murcia", placement: "free_test_result" })}>Preguntar por el acceso</a>
        </div> : <p>Responde las que puedas en 17 minutos para ver la explicación, la penalización y el bloque que conviene repasar primero.</p>}
      </div>
    </section>
  );
}
