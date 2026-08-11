"use client";

import { useMemo, useState } from "react";
import {
  developmentQuestions,
  generalQuestions,
  systemsQuestions,
  TAI_BOE_URL,
  type TaiQuestion,
} from "@/data/tai-diagnostic";

type Route = "development" | "systems";

const routeCopy: Record<Route, { kicker: string; label: string; detail: string }> = {
  development: {
    kicker: "Ruta práctica · bloque III",
    label: "Desarrollo de sistemas",
    detail: "Datos, programación, aplicaciones web, seguridad y pruebas.",
  },
  systems: {
    kicker: "Ruta práctica · bloque IV",
    label: "Sistemas y comunicaciones",
    detail: "Sistemas operativos, redes, continuidad, operación y seguridad.",
  },
};

export function TaiDiagnostic({ whatsapp }: { whatsapp: string }) {
  const [route, setRoute] = useState<Route | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = useMemo<TaiQuestion[]>(
    () => route ? [...generalQuestions, ...(route === "development" ? developmentQuestions : systemsQuestions)] : [],
    [route],
  );

  const question = questions[current];
  const answered = Object.keys(answers).length;

  function reset() {
    setRoute(null);
    setAnswers({});
    setCurrent(0);
    setFinished(false);
  }

  if (!route) {
    return (
      <section className="lm-shell tai-diagnostic" id="prueba" aria-labelledby="tai-diagnostic-title">
        <div className="tai-section-heading">
          <div>
            <p className="lm-eyebrow"><i aria-hidden="true" /> Prueba gratuita · 12 preguntas</p>
            <h2 id="tai-diagnostic-title">Haz una prueba seria antes de pagar.</h2>
          </div>
          <p>Comprueba cómo preguntamos y cómo explicamos cada respuesta. Harás una muestra de la parte general y elegirás una de las dos rutas prácticas. Entras directamente y recibes el resultado al terminar.</p>
        </div>

        <div className="tai-diagnostic-benefits" aria-label="Qué obtienes con la prueba gratuita">
          <div><span>01</span><strong>Sin registro</strong><p>No pedimos email ni datos personales para empezar.</p></div>
          <div><span>02</span><strong>Resultado por partes</strong><p>Verás por separado la parte general y la ruta práctica elegida.</p></div>
          <div><span>03</span><strong>Corrección explicada</strong><p>Revisa cada acierto, cada fallo y el razonamiento de la respuesta.</p></div>
        </div>

        <div className="tai-route-intro">
          <div>
            <span className="tai-route-kicker">Tu prueba</span>
            <strong>8 preguntas comunes + 4 de la ruta práctica</strong>
          </div>
          <p>Elige el bloque práctico que quieras comprobar hoy. Después podrás repetir la prueba con la otra ruta.</p>
        </div>

        <div className="tai-route-picker" aria-label="Elige la ruta práctica">
          {(Object.keys(routeCopy) as Route[]).map((key) => (
            <button className="tai-route-card" key={key} type="button" onClick={() => setRoute(key)}>
              <span className="tai-route-kicker">{routeCopy[key].kicker}</span>
              <strong>{routeCopy[key].label}</strong>
              <span>{routeCopy[key].detail}</span>
              <b>Elegir esta ruta →</b>
            </button>
          ))}
        </div>

        <div className="tai-diagnostic-note">
          <strong>Sin registro y con corrección explicada.</strong>
          <span>Es una muestra propia y parcial inspirada en la estructura vigente. No es un simulacro oficial.</span>
          <a href={TAI_BOE_URL} target="_blank" rel="noreferrer">Consultar la convocatoria en el BOE ↗</a>
        </div>
      </section>
    );
  }

  if (finished) {
    const correct = questions.filter((item) => answers[item.id] === item.correctIndex).length;
    const generalCorrect = generalQuestions.filter((item) => answers[item.id] === item.correctIndex).length;
    const practical = route === "development" ? developmentQuestions : systemsQuestions;
    const practicalCorrect = practical.filter((item) => answers[item.id] === item.correctIndex).length;
    const weakAreas = questions
      .filter((item) => answers[item.id] !== item.correctIndex)
      .map((item) => item.area)
      .filter((area, index, all) => all.indexOf(area) === index);
    const priorityArea = weakAreas[0] ?? "Ganar velocidad y resistencia";
    const whatsappMessage = encodeURIComponent(
      `Hola, he terminado la prueba gratuita de TAI con ${correct}/${questions.length} aciertos (${generalCorrect}/8 en la parte general y ${practicalCorrect}/4 en ${routeCopy[route].label}). Quiero acceder al curso completo por 69 € hasta el examen.`,
    );

    return (
      <section className="lm-shell tai-diagnostic" id="prueba" aria-labelledby="tai-result-title">
        <div className="tai-result-hero" aria-live="polite">
          <p className="lm-eyebrow"><i aria-hidden="true" /> Resultado orientativo</p>
          <h2 id="tai-result-title">{correct} de {questions.length} correctas.</h2>
          <p>{weakAreas.length ? "Ya tienes una prioridad concreta para el siguiente repaso." : "Buena base en esta muestra. El siguiente paso es ganar velocidad y resistencia."}</p>
          <div className="tai-result-split" aria-label="Desglose del resultado">
            <span><b>{generalCorrect}/8</b> Parte general</span>
            <span><b>{practicalCorrect}/4</b> {routeCopy[route].label}</span>
          </div>
        </div>

        <div className="tai-result-next">
          <div className="tai-result-priority">
            <span>Tu prioridad sugerida</span>
            <h3>{priorityArea}</h3>
            <p>Empieza por las explicaciones de este bloque y vuelve a intentarlo con la otra ruta práctica cuando termines el repaso.</p>
          </div>
          <div className="tai-result-offer">
            <span>Si quieres continuar</span>
            <h3>Practica TAI completo hasta el examen.</h3>
            <ul>
              <li>33 temas redactados y listos para estudiar.</li>
              <li>Autoevaluaciones por tema con corrección inmediata.</li>
              <li>Simulacros de la parte general y de los bloques prácticos.</li>
            </ul>
            <div className="tai-result-actions">
              <a className="lm-btn lm-btn-primary" href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}>Seguir practicando por 69 €</a>
              <button className="lm-btn lm-btn-outline" type="button" onClick={reset}>Repetir con otra ruta</button>
            </div>
            <small>Pago único · acceso hasta el examen · el botón abre WhatsApp.</small>
          </div>
        </div>

        <div className="tai-review-list">
          <div className="tai-review-heading">
            <h3>Revisa cada respuesta</h3>
            <p>Abre cada pregunta para ver la solución y entender por qué es correcta.</p>
          </div>
          {questions.map((item, index) => {
            const selected = answers[item.id];
            const isCorrect = selected === item.correctIndex;
            return (
              <details className={`tai-review-item ${isCorrect ? "is-correct" : "is-wrong"}`} key={item.id} open={!isCorrect}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{item.prompt}</b>
                  <em>{isCorrect ? "Correcta" : selected === undefined ? "En blanco" : "A revisar"}</em>
                </summary>
                <div>
                  <p><strong>Respuesta correcta:</strong> {item.options[item.correctIndex]}</p>
                  <p>{item.explanation}</p>
                  <small>{item.area}</small>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="lm-shell tai-diagnostic" id="prueba" aria-labelledby="tai-question-title">
      <div className="tai-quiz-topline">
        <div>
          <span>{current < generalQuestions.length ? "Primera parte" : routeCopy[route].label}</span>
          <b>{question.area}</b>
        </div>
        <strong>{String(current + 1).padStart(2, "0")} / {questions.length}</strong>
      </div>
      <div className="tai-progress" aria-label={`${answered} de ${questions.length} preguntas respondidas`}>
        <span style={{ width: `${(answered / questions.length) * 100}%` }} />
      </div>

      <fieldset className="tai-question">
        <legend id="tai-question-title">{question.prompt}</legend>
        <div className="tai-options">
          {question.options.map((option, index) => (
            <label key={option} className={answers[question.id] === index ? "is-selected" : ""}>
              <input
                type="radio"
                name={question.id}
                value={index}
                checked={answers[question.id] === index}
                onChange={() => setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: index }))}
              />
              <b>{String.fromCharCode(65 + index)}</b>
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="tai-quiz-actions">
        <button className="lm-btn lm-btn-outline" type="button" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>Anterior</button>
        {current === questions.length - 1 ? (
          <button className="lm-btn lm-btn-primary" type="button" onClick={() => setFinished(true)}>Ver resultado</button>
        ) : (
          <button className="lm-btn lm-btn-primary" type="button" onClick={() => setCurrent((value) => value + 1)}>Siguiente</button>
        )}
      </div>
      <p className="tai-quiz-note">Puedes avanzar sin responder: la pregunta quedará marcada en blanco para la corrección.</p>
      <button className="tai-change-route" type="button" onClick={reset}>Cambiar ruta práctica</button>
    </section>
  );
}
