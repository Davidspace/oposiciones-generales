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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TEST_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const progressMarks = useRef(new Set<number>());
  const questionRef = useRef<HTMLFieldSetElement>(null);
  const answered = Object.keys(answers).length;
  const currentQuestion = FREE_TEST[currentIndex];
  const selected = answers[currentQuestion.id];
  const isCorrect = selected === currentQuestion.answer;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === FREE_TEST.length - 1;
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
      if (!progressMarks.current.has(100)) {
        progressMarks.current.add(100);
        trackEvent("free_test_progress", { course: "celador_sms_murcia", progress: 100 });
      }
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
    if (!progressMarks.current.has(100)) {
      progressMarks.current.add(100);
      trackEvent("free_test_progress", { course: "celador_sms_murcia", progress: 100 });
    }
    trackEvent("complete_free_test", { course: "celador_sms_murcia", score: result.net, total: FREE_TEST.length, answered });
  };

  const moveTo = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(FREE_TEST.length - 1, nextIndex));
    setCurrentIndex(boundedIndex);
    trackEvent("free_test_navigate", { course: "celador_sms_murcia", question_number: boundedIndex + 1 });
    window.requestAnimationFrame(() => questionRef.current?.focus());
  };

  const repeat = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setSecondsLeft(TEST_SECONDS);
    setTimedOut(false);
    progressMarks.current.clear();
    trackEvent("free_test_repeat", { course: "celador_sms_murcia" });
  };

  return (
    <section className="lm-sms-test" id="prueba" aria-labelledby="prueba-title">
      <div className="lm-sms-test-heading">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Prueba gratuita · 15 preguntas</p>
          <h2 id="prueba-title">Comprueba cómo vas antes de pagar.</h2>
        </div>
        <p>Practica materias comunes y específicas con cuatro opciones, penalización y corrección explicada.</p>
      </div>
      <div className="lm-sms-test-meta"><span>Pregunta {currentIndex + 1} de {FREE_TEST.length} · {answered} respondidas</span><span className="lm-sms-timer" aria-live="polite">Tiempo {formatTime(secondsLeft)}</span><span>−0,25 por error · en blanco no resta</span></div>
      <div className="lm-sms-question-stage">
        <fieldset ref={questionRef} tabIndex={-1} className={`lm-sms-question ${submitted ? (selected === undefined ? "is-blank" : isCorrect ? "is-correct" : "is-wrong") : ""}`} key={currentQuestion.id}>
          <legend>
            <span className="lm-sms-question-number">{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="lm-sms-question-copy"><b>{currentQuestion.block}</b><span>{currentQuestion.question}</span></span>
          </legend>
          <div className="lm-sms-options">
            {currentQuestion.options.map((option, optionIndex) => (
              <label className={selected === optionIndex ? "is-selected" : ""} key={option}>
                <input type="radio" name={currentQuestion.id} checked={selected === optionIndex} onChange={() => setAnswer(currentQuestion.id, optionIndex)} disabled={submitted} />
                <strong>{String.fromCharCode(65 + optionIndex)}</strong>
                <span>{option}</span>
              </label>
            ))}
          </div>
          {submitted ? <div className="lm-sms-explanation"><strong>{selected === undefined ? "Sin responder" : isCorrect ? "Correcta" : `Respuesta: ${String.fromCharCode(65 + currentQuestion.answer)}`}</strong><p>{currentQuestion.explanation}</p><small>{currentQuestion.source}</small></div> : null}
        </fieldset>
        <nav className="lm-sms-question-nav" aria-label="Navegación de la prueba">
          <button className="lm-sms-nav-button" type="button" onClick={() => moveTo(currentIndex - 1)} disabled={isFirst}>Anterior</button>
          <span aria-live="polite">Pregunta {currentIndex + 1} de {FREE_TEST.length}</span>
          {!submitted && isLast
            ? <button className="lm-sms-nav-button is-primary" type="button" onClick={submit}>Terminar y ver resultado</button>
            : <button className="lm-sms-nav-button is-primary" type="button" onClick={() => moveTo(currentIndex + 1)} disabled={isLast}>Siguiente</button>}
        </nav>
      </div>
      <div className="lm-sms-test-actions">
        {submitted ? <div className="lm-sms-result" role="status">
          <div className="lm-sms-result-score"><strong>{result.net.toFixed(2).replace(".", ",")}</strong><span>puntos netos orientativos<br />{timedOut ? "Tiempo agotado" : `con ${answered} respuestas`}</span></div>
          <div className="lm-sms-result-breakdown" aria-label="Resultado por bloques">{result.blocks.map((block) => <span key={block.block}><b>{block.block}</b>{block.correct}/{block.total} · {block.wrong} errores · {block.blank} en blanco</span>)}</div>
          <p><strong>Repaso recomendado:</strong> empieza por <b>{result.weakest.block.toLowerCase()}</b>; vuelve al resumen y repite el test del bloque antes de hacer otro simulacro.</p>
          <a className="lm-btn lm-btn-outline" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent("click_whatsapp", { course: "celador_sms_murcia", placement: "free_test_result" })}>Preguntar por el acceso</a>
          <button className="lm-btn lm-btn-outline" type="button" onClick={repeat}>Repetir la prueba</button>
        </div> : <p>Tienes 17 minutos. Al terminar verás las explicaciones y qué bloque te conviene repasar.</p>}
      </div>
    </section>
  );
}
