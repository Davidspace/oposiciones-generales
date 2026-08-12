import { useMemo, useRef, useState } from "react";
import { CORDOBA_DIAGNOSTIC, type CordobaBlock } from "@/data/cordoba-diagnostic";
import { trackEvent } from "@/lib/analytics";

type Answers = Record<string, number | undefined>;

const LETTERS = ["A", "B", "C", "D"];

function blockScores(answers: Answers) {
  const blocks = [...new Set(CORDOBA_DIAGNOSTIC.map((item) => item.block))];
  return blocks.map((block) => {
    const questions = CORDOBA_DIAGNOSTIC.filter((item) => item.block === block);
    const correct = questions.filter((item) => answers[item.id] === item.correctIndex).length;
    return { block, correct, total: questions.length, ratio: correct / questions.length };
  });
}

function resultMessage(correct: number, total: number) {
  const ratio = correct / total;
  if (ratio >= 0.8) return "Buena base en esta muestra. Tu siguiente reto es mantener el nivel y ganar soltura con supuestos.";
  if (ratio >= 0.6) return "Tienes una base útil. El resultado ya señala qué bloque puede darte más puntos con un repaso dirigido.";
  if (ratio >= 0.4) return "Hay base, pero todavía quedan huecos concretos. Empieza por el bloque con menor porcentaje y repite la prueba.";
  return "Ya tienes un mapa para empezar. Prioriza un bloque cada vez y usa las explicaciones para convertir cada fallo en un repaso.";
}

export function CordobaDiagnostic({ whatsappHref }: { whatsappHref: string }) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const startedAt = useRef(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const question = CORDOBA_DIAGNOSTIC[current];
  const scores = useMemo(() => blockScores(answers), [answers]);
  const correct = useMemo(
    () => CORDOBA_DIAGNOSTIC.filter((item) => answers[item.id] === item.correctIndex).length,
    [answers],
  );
  const answered = Object.values(answers).filter((value) => value !== undefined).length;
  const weakest = [...scores].sort((a, b) => a.ratio - b.ratio)[0];

  const start = () => {
    startedAt.current = Date.now();
    setStarted(true);
    trackEvent("start_test_cordoba", {
      course: "auxiliar_administrativo_cordoba",
      test_name: "diagnostico_cordoba_15_5_microcaso",
      question_count: CORDOBA_DIAGNOSTIC.length,
      theory_questions: 15,
      applied_questions: 5,
      microcases: 1,
    });
  };

  const finish = () => {
    setFinished(true);
    const duration = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    trackEvent("complete_test_cordoba", {
      course: "auxiliar_administrativo_cordoba",
      test_name: "diagnostico_cordoba_15_5_microcaso",
      score: correct,
      max_score: CORDOBA_DIAGNOSTIC.length,
      microcase_opened: answers["COR-D21"] !== undefined,
      correct_answers: correct,
      answered_questions: answered,
      total_questions: CORDOBA_DIAGNOSTIC.length,
      score_percent: Math.round((correct / CORDOBA_DIAGNOSTIC.length) * 100),
      weakest_block: weakest?.block || "",
      duration_seconds: duration,
    });
    window.setTimeout(() => resultRef.current?.focus(), 0);
  };

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setFinished(false);
    startedAt.current = Date.now();
    trackEvent("start_test_cordoba", {
      course: "auxiliar_administrativo_cordoba",
      test_name: "diagnostico_cordoba_15_5_microcaso",
      question_count: CORDOBA_DIAGNOSTIC.length,
      restart: true,
    });
  };

  return (
    <section className="lm-shell lm-cordoba-diagnostic" id="diagnostico" aria-labelledby="cordoba-diagnostic-title">
      <div className="lm-cordoba-diagnostic-head">
        <div>
          <p className="lm-eyebrow"><i aria-hidden="true" /> Diagnóstico gratuito · 15 teóricas + 5 aplicadas + microcaso</p>
          <h2 id="cordoba-diagnostic-title">Descubre por dónde empezar.</h2>
        </div>
        <p>
          Recorre los veinte epígrafes de la convocatoria y termina con un caso breve. Obtendrás un resultado por bloques y la explicación de cada respuesta, con su fuente.
        </p>
      </div>

      {!started ? (
        <div className="lm-cordoba-test-intro">
          <div>
            <strong>21 decisiones · unos 25 minutos</strong>
            <span>Sin registro, sin enviar tus respuestas y sin preguntas de relleno.</span>
          </div>
          <button className="lm-btn lm-btn-primary" type="button" onClick={start}>Empezar diagnóstico</button>
        </div>
      ) : !finished ? (
        <div className="lm-cordoba-test-panel">
          <div className="lm-cordoba-progress" aria-label={`Pregunta ${current + 1} de ${CORDOBA_DIAGNOSTIC.length}`}>
            <div>
              <span>{question.kind === "teorica" ? "Teoría" : question.kind === "aplicada" ? "Aplicación" : "Microcaso"} · tema {question.topic}</span>
              <strong>{String(current + 1).padStart(2, "0")} / {CORDOBA_DIAGNOSTIC.length}</strong>
            </div>
            <i style={{ width: `${((current + 1) / CORDOBA_DIAGNOSTIC.length) * 100}%` }} aria-hidden="true" />
          </div>

          {question.caseText ? (
            <aside className="lm-cordoba-case">
              <span>Microcaso</span>
              <p>{question.caseText}</p>
            </aside>
          ) : null}

          <fieldset className="lm-cordoba-question">
            <legend>{question.stem}</legend>
            <div className="lm-cordoba-options">
              {question.options.map((option, index) => (
                <label key={option} className={answers[question.id] === index ? "is-selected" : ""}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === index}
                    onChange={() => setAnswers((value) => ({ ...value, [question.id]: index }))}
                  />
                  <b>{LETTERS[index]}</b>
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="lm-cordoba-test-nav">
            <button type="button" className="lm-cordoba-secondary" onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>
              Anterior
            </button>
            <button type="button" className="lm-cordoba-secondary" onClick={() => setAnswers((value) => ({ ...value, [question.id]: undefined }))}>
              Dejar en blanco
            </button>
            {current < CORDOBA_DIAGNOSTIC.length - 1 ? (
              <button type="button" className="lm-cordoba-primary" onClick={() => setCurrent((value) => value + 1)}>Siguiente</button>
            ) : (
              <button type="button" className="lm-cordoba-primary" onClick={finish}>Ver resultado</button>
            )}
          </div>
        </div>
      ) : (
        <div className="lm-cordoba-result" ref={resultRef} tabIndex={-1} aria-live="polite">
          <div className="lm-cordoba-score">
            <span>Resultado orientativo</span>
            <strong>{correct}/{CORDOBA_DIAGNOSTIC.length}</strong>
            <p>{resultMessage(correct, CORDOBA_DIAGNOSTIC.length)}</p>
          </div>
          <div className="lm-cordoba-breakdown">
            <h3>Resultado por bloques</h3>
            {scores.map((item) => (
              <div key={item.block}>
                <span>{item.block}</span>
                <strong>{item.correct}/{item.total}</strong>
              </div>
            ))}
            <p className="lm-cordoba-priority">
              <b>Prioridad sugerida:</b> {weakest?.block}. Empieza por revisar las explicaciones de ese bloque.
            </p>
            <div className="lm-result-actions">
              <a
                className="lm-btn lm-btn-primary"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("click_whatsapp_cordoba", { course: "auxiliar_administrativo_cordoba", placement: "diagnostic_result", score: correct })}
              >
                Ver el pack Córdoba
              </a>
              <button className="lm-btn lm-btn-outline" type="button" onClick={restart}>Repetir diagnóstico</button>
            </div>
          </div>
          <div className="lm-cordoba-review">
            <h3>Corrección explicada</h3>
            {CORDOBA_DIAGNOSTIC.map((item, index) => {
              const selected = answers[item.id];
              const isCorrect = selected === item.correctIndex;
              return (
                <details key={item.id} className={isCorrect ? "is-correct" : "is-wrong"}>
                  <summary>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <span>{item.stem}</span>
                    <strong>{isCorrect ? "Correcta" : selected === undefined ? "En blanco" : "Para repasar"}</strong>
                  </summary>
                  <div>
                    <p><b>Respuesta correcta:</b> {item.options[item.correctIndex]}</p>
                    <p>{item.explanation}</p>
                    <a href={item.source.href} target="_blank" rel="noreferrer">
                      Consultar {item.source.label}, {item.source.locator}
                    </a>
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
