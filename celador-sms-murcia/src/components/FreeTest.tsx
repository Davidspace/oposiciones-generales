import { useMemo, useState } from "react";
import { FREE_TEST } from "../data/free-test";
import { trackEvent } from "../lib/analytics";

type FreeTestProps = { whatsappUrl: string };

export function FreeTest({ whatsappUrl }: FreeTestProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const score = useMemo(
    () => FREE_TEST.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0),
    [answers],
  );

  const setAnswer = (id: string, answer: number) => {
    setAnswers((current) => ({ ...current, [id]: answer }));
    trackEvent("free_test_answer", { course: "celador_sms_murcia", question_id: id });
  };

  const submit = () => {
    setSubmitted(true);
    trackEvent("complete_free_test", { course: "celador_sms_murcia", score, total: FREE_TEST.length });
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
      <div className="lm-sms-test-meta"><span>{answered}/{FREE_TEST.length} respondidas</span><span>Sin registro obligatorio</span><span>Corrección inmediata</span></div>
      <div className="lm-sms-question-list">
        {FREE_TEST.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.answer;
          return (
            <fieldset className={`lm-sms-question ${submitted ? (isCorrect ? "is-correct" : "is-wrong") : ""}`} key={question.id}>
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
              {submitted ? <div className="lm-sms-explanation"><strong>{isCorrect ? "Correcta" : `Respuesta: ${String.fromCharCode(65 + question.answer)}`}</strong><p>{question.explanation}</p><small>{question.source}</small></div> : null}
            </fieldset>
          );
        })}
      </div>
      <div className="lm-sms-test-actions">
        <button className="lm-btn lm-btn-primary" type="button" onClick={submit} disabled={answered < FREE_TEST.length}>Ver mi resultado</button>
        {submitted ? <div className="lm-sms-result" role="status"><strong>{score}/{FREE_TEST.length}</strong><span>{score >= 12 ? "Buen punto de partida. Ahora gana vueltas y velocidad." : "Ya tienes un mapa claro de lo que debes repasar primero."}</span><a className="lm-btn lm-btn-outline" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent("click_whatsapp", { course: "celador_sms_murcia", placement: "free_test_result" })}>Preguntar por el acceso</a></div> : <p>Responde todas para ver la explicación de cada pregunta y tu resultado orientativo.</p>}
      </div>
    </section>
  );
}
