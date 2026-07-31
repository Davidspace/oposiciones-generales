"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  scoreSsAttempt,
  type SsDiagnosticPayload,
  type SsQuestion,
} from "@/lib/ss-casolab";

type SubmitState = "idle" | "sending" | "success" | "error";
type EventType =
  | "landing_view"
  | "diagnostic_start"
  | "diagnostic_complete"
  | "lead_submit";

const EXPERIMENT = "ss-casolab";
let volatileSessionId: string | null = null;
const EMPTY_QUESTIONS: SsQuestion[] = [];

const MESSAGE_VARIANTS = {
  method: {
    offerVariant: "academy-full-method-v1",
    lead: "Estudia la regla.",
    emphasis: "Úsala para decidir.",
  },
  flexible: {
    offerVariant: "academy-full-flexible-v1",
    lead: "Prepara las dos partes.",
    emphasis: "Estudia sin horarios semanales.",
  },
  feedback: {
    offerVariant: "academy-full-feedback-v1",
    lead: "Identifica el fallo.",
    emphasis: "Haz el repaso correcto.",
  },
} as const;

export type SsMessageVariant = keyof typeof MESSAGE_VARIANTS;

const BETA_ITEMS = [
  ["36", "temas redactados: 23 generales + 13 específicos"],
  ["36", "tests organizados por tema"],
  ["60", "simulacros en el banco de trabajo"],
  ["60", "documentos normativos de referencia"],
];

const COMPLETE_ITEMS = [
  ["23", "temas del bloque general"],
  ["13", "temas específicos de Seguridad Social"],
  ["36", "documentos de test por temas"],
  ["60", "simulacros para entrenar el examen"],
];

const CORPUS_STATUS_ITEMS = [
  ["08", "áreas de trabajo editorial"],
  ["36", "temas completos redactados"],
  ["36", "tests organizados por tema"],
  ["60", "simulacros y documentos de práctica"],
];

function getSessionId() {
  volatileSessionId ??= window.crypto.randomUUID();
  return volatileSessionId;
}

function postEvent(
  enabled: boolean,
  offerVariant: string,
  eventType: EventType,
  metadata?: Record<string, string | number | boolean>,
) {
  if (!enabled) return;
  const search = new URLSearchParams(window.location.search);
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventId: window.crypto.randomUUID(),
      sessionId: getSessionId(),
      experiment: EXPERIMENT,
      offerVariant,
      eventType,
      path: window.location.pathname,
      utmSource: search.get("utm_source"),
      utmMedium: search.get("utm_medium"),
      utmCampaign: search.get("utm_campaign"),
      metadata,
    }),
  });
}

export function SsCasoLabLanding({
  messageVariant,
}: {
  messageVariant: SsMessageVariant;
}) {
  const message = MESSAGE_VARIANTS[messageVariant];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [diagnosticError, setDiagnosticError] = useState("");
  const [confirmBlankSubmission, setConfirmBlankSubmission] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [leadError, setLeadError] = useState("");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [captureEnabled, setCaptureEnabled] = useState(false);
  const [capturePrivacyUrl, setCapturePrivacyUrl] = useState<string | null>(null);
  const [orderingEnabled, setOrderingEnabled] = useState(false);
  const [diagnostic, setDiagnostic] = useState<SsDiagnosticPayload | null>(null);
  const [diagnosticLoaded, setDiagnosticLoaded] = useState(false);
  const started = useRef(false);
  const completed = useRef(false);

  const questions = diagnostic?.questions ?? EMPTY_QUESTIONS;
  const caseContext = diagnostic?.caseContext ?? null;
  const caseSources = diagnostic?.sources ?? [];
  const diagnosticPublicable = diagnostic !== null;
  const result = useMemo(
    () => scoreSsAttempt(answers, questions),
    [answers, questions],
  );
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    void fetch("/api/public-config?experiment=ss-casolab")
      .then((response) => response.json())
      .then(
        (data: {
          analyticsEnabled?: boolean;
          captureEnabled?: boolean;
          capturePrivacyUrl?: string | null;
          orderingEnabled?: boolean;
        }) => {
          const analyticsIsEnabled = data.analyticsEnabled === true;
          setAnalyticsEnabled(analyticsIsEnabled);
          setCaptureEnabled(data.captureEnabled === true);
          setCapturePrivacyUrl(
            data.captureEnabled === true &&
              typeof data.capturePrivacyUrl === "string"
              ? data.capturePrivacyUrl
              : null,
          );
          setOrderingEnabled(data.orderingEnabled === true);
          postEvent(analyticsIsEnabled, message.offerVariant, "landing_view");
        },
      )
      .catch(() => {
        setAnalyticsEnabled(false);
        setCaptureEnabled(false);
        setCapturePrivacyUrl(null);
        setOrderingEnabled(false);
      });

    void fetch("/api/ss-diagnostic", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: SsDiagnosticPayload | { publicable?: false }) => {
        if (
          data.publicable === true &&
          Array.isArray(data.questions) &&
          data.questions.length > 0 &&
          data.caseContext &&
          Array.isArray(data.sources)
        ) {
          setDiagnostic(data);
        } else {
          setDiagnostic(null);
        }
      })
      .catch(() => setDiagnostic(null))
      .finally(() => setDiagnosticLoaded(true));

  }, [message.offerVariant]);

  function chooseAnswer(questionId: string, optionIndex: number) {
    if (revealed) return;
    if (!started.current) {
      started.current = true;
      postEvent(
        analyticsEnabled,
        message.offerVariant,
        "diagnostic_start",
      );
    }
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
    setDiagnosticError("");
    setConfirmBlankSubmission(false);
  }

  function correctDiagnostic() {
    const blankCount = questions.length - answeredCount;
    if (blankCount > 0 && !confirmBlankSubmission) {
      setConfirmBlankSubmission(true);
      setDiagnosticError(
        `Quedan ${blankCount} decisiones en blanco. Respóndelas o confirma la entrega; las preguntas en blanco no restan.`,
      );
      return;
    }

    setRevealed(true);
    if (!completed.current) {
      completed.current = true;
      postEvent(analyticsEnabled, message.offerVariant, "diagnostic_complete", {
        correct: result.correct,
        unanswered: result.unanswered,
        dominantError: result.dominantError?.id ?? "none",
        scoreBand: result.band.id,
      });
    }
    window.setTimeout(() => {
      document
        .getElementById("resultado")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function restartDiagnostic() {
    setAnswers({});
    setRevealed(false);
    setDiagnosticError("");
    setConfirmBlankSubmission(false);
    started.current = false;
    completed.current = false;
    document
      .getElementById("microcaso")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captureEnabled) {
      setSubmitState("error");
      setLeadError(
        "La captación todavía no está activa. No hemos enviado ningún dato.",
      );
      return;
    }
    setSubmitState("sending");
    setLeadError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const search = new URLSearchParams(window.location.search);
    const payload = {
      experiment: EXPERIMENT,
      offerVariant: message.offerVariant,
      name: data.get("name"),
      whatsapp: data.get("whatsapp"),
      email: data.get("email"),
      modality: "free",
      stage: data.get("stage"),
      challenge: data.get("challenge"),
      whatsappConsent: data.get("whatsappConsent") === "on",
      company: data.get("company"),
      utmSource: search.get("utm_source"),
      utmMedium: search.get("utm_medium"),
      utmCampaign: search.get("utm_campaign"),
      landingPath: window.location.pathname,
      referrer: document.referrer || null,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !body.ok) {
        throw new Error(body.message || "No hemos podido guardar tus datos.");
      }

      form.reset();
      postEvent(analyticsEnabled, message.offerVariant, "lead_submit", {
        completedDiagnostic: revealed,
        scoreBand: revealed ? result.band.id : "not-completed",
      });
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setLeadError(
        error instanceof Error
          ? error.message
          : "No hemos podido guardar tus datos. Inténtalo de nuevo.",
      );
    }
  }

  return (
    <main className="ss-page">
      <header className="ss-header">
        <a className="ss-brand" href="#inicio" aria-label="SS CasoLab. Inicio">
          <span className="ss-brand-stamp" aria-hidden="true">
            SS
          </span>
          <span>
            <strong>SS CasoLab</strong>
            <small>Administrativo · C1</small>
          </span>
        </a>
        <nav className="ss-nav" aria-label="Navegación de SS CasoLab">
          <a href="#microcaso">Microcaso</a>
          <a href="#preventa">Preventa</a>
          <a className="ss-nav-action" href="#microcaso">
            Empezar
          </a>
        </nav>
      </header>

      <section className="ss-hero" id="inicio">
        <div className="ss-hero-copy">
          <p className="ss-label">ACADEMIA EN CONSTRUCCIÓN · TURNO LIBRE</p>
          <h1>
            {message.lead} <em>{message.emphasis}</em>
          </h1>
          <p className="ss-hero-lead">
            Un temario completo y ordenado para Administrativo de la Seguridad
            Social C1: 23 temas generales, 13 temas específicos, tests por
            tema, simulacros, normativa y documentación oficial. El producto
            se publicará por fases después de revisar cada bloque.
          </p>
          <div className="ss-actions">
            <a className="ss-button ss-button-primary" href="#microcaso">
              Resolver el microcaso
            </a>
            <a className="ss-text-link" href="#como-funciona">
              Ver cómo funciona
            </a>
          </div>
          <dl className="ss-facts">
            <div>
              <dt>15</dt>
              <dd>preguntas en el supuesto oficial de turno libre</dd>
            </div>
            <div>
              <dt>−0,25</dt>
              <dd>por cada error en puntuación directa</dd>
            </div>
            <div>
              <dt>0</dt>
              <dd>correcciones manuales para ver tu resultado</dd>
            </div>
          </dl>
        </div>

        <div className="ss-workbook" aria-label="Vista previa del microcaso">
          <span className="ss-tape" aria-hidden="true" />
          <div className="ss-workbook-head">
            <span>SS / C1</span>
            <span>CASO · 001</span>
          </div>
          <p className="ss-hand">Lee. Decide. Corrige. Repasa.</p>
          <h2>
            {caseContext?.title ??
              (diagnosticLoaded ? "Microcaso en revisión" : "Comprobando microcaso")}
          </h2>
          <div className="ss-preview-question">
            <span>01</span>
            <p>
              {questions[0]?.prompt ??
                "El contenido se abrirá cuando termine la revisión."}
            </p>
          </div>
          <div className="ss-preview-options" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="ss-preview-result">
            <strong>Tu mapa de errores</strong>
            <span>se genera al terminar</span>
          </div>
        </div>
      </section>

      <section className="ss-strip" aria-label="Datos de la convocatoria">
        <p>
          Convocatoria publicada el 31 de diciembre de 2025 · 1.056 plazas de
          acceso libre · ejercicio único de 120 minutos
        </p>
        <a
          href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-27158"
          target="_blank"
          rel="noreferrer"
        >
          Consultar BOE
        </a>
      </section>

      <section className="ss-method" id="como-funciona">
        <div className="ss-section-heading">
          <p className="ss-label">TEORÍA, DECISIÓN Y REPASO</p>
          <h2>Un temario completo. Una práctica que te dice qué repasar.</h2>
        </div>
        <ol className="ss-method-grid">
          <li>
            <span>01</span>
            <h3>Lee el contexto</h3>
            <p>Estudia el tema completo antes de pasar a la práctica.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Toma decisiones</h3>
            <p>Comprueba la regla con tests y simulacros organizados.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Corrige al instante</h3>
            <p>Revisa la explicación y la fuente normativa relacionada.</p>
          </li>
          <li>
            <span>04</span>
            <h3>Recibe una ruta</h3>
            <p>Vuelve al tema, al test o al simulacro que necesitas.</p>
          </li>
        </ol>
      </section>

      <section className="ss-diagnostic" id="microcaso">
        {diagnosticPublicable && caseContext ? (
          <div className="ss-diagnostic-intro">
            <p className="ss-label">MICROCASO DE PRÁCTICA</p>
            <h2>{caseContext.title}</h2>
            <p>{caseContext.body}</p>
            <div className="ss-case-note">
              <strong>Regla de corrección</strong>
              <span>+1 acierto · −0,25 error · 0 sin respuesta</span>
            </div>
            <p className="ss-beta-note">
              Corte normativo: {caseContext.legislationCutoffAt}. Fuentes
              comprobadas: {caseContext.sourceCheckedAt}. No equivale a una
              plantilla del tribunal ni sustituye el temario completo.
            </p>
          </div>
        ) : null}

        {diagnosticPublicable ? (
        <div className="ss-question-list">
          {questions.map((question, questionIndex) => {
            const selected = answers[question.id];
            const correctIndex = question.options.findIndex(
              (option) => option.isCorrect,
            );
            const selectedOption =
              typeof selected === "number"
                ? question.options[selected]
                : undefined;
            const isCorrect = selected === correctIndex;
            const isUnanswered = typeof selected !== "number";

            return (
              <fieldset
                className={`ss-question ${
                  revealed
                    ? isUnanswered
                      ? "is-unanswered"
                      : isCorrect
                        ? "is-correct"
                        : "is-wrong"
                    : ""
                }`}
                key={question.id}
              >
                <legend>
                  <span>{String(questionIndex + 1).padStart(2, "0")}</span>
                  {question.prompt}
                </legend>
                <div className="ss-option-list">
                  {question.options.map((option, optionIndex) => {
                    const optionSelected = selected === optionIndex;
                    const correctOption =
                      revealed && option.isCorrect;
                    return (
                      <label
                        className={`ss-option ${
                          optionSelected ? "is-selected" : ""
                        } ${correctOption ? "is-answer" : ""}`}
                        key={option.text}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={optionIndex}
                          checked={optionSelected}
                          disabled={revealed}
                          onChange={() =>
                            chooseAnswer(question.id, optionIndex)
                          }
                        />
                        <span className="ss-option-key" aria-hidden="true">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span>{option.text}</span>
                      </label>
                    );
                  })}
                </div>
                {revealed ? (
                  <div className="ss-explanation">
                    <p>
                      <strong>
                        {isUnanswered
                          ? "Sin respuesta."
                          : isCorrect
                            ? "Decisión correcta."
                            : "La decisión correcta era otra."}
                      </strong>
                    </p>
                    {isUnanswered ? (
                      <p>
                        En la convocatoria, una pregunta sin contestar no resta
                        puntuación.
                      </p>
                    ) : null}
                    <ol
                      className="ss-option-feedback-list"
                      aria-label="Explicación de las cuatro alternativas"
                    >
                      {question.options.map((option, optionIndex) => (
                        <li
                          className={`${
                            option.isCorrect ? "is-correct" : ""
                          } ${selected === optionIndex ? "is-selected" : ""}`}
                          key={option.text}
                        >
                          <strong>
                            {String.fromCharCode(65 + optionIndex)}. {option.text}
                          </strong>
                          <span>{option.feedback}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="ss-review-line">
                      <span>Repasa:</span>{" "}
                      {selectedOption?.review ??
                        question.options[correctIndex].review}
                    </p>
                    <a
                      href={question.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Fuente: {question.sourceLabel}
                    </a>
                  </div>
                ) : null}
              </fieldset>
            );
          })}

          <div className="ss-diagnostic-actions">
            <p aria-live="polite">
              {answeredCount} respondidas ·{" "}
              {questions.length - answeredCount} en blanco
            </p>
            {diagnosticError ? (
              <p className="ss-form-error" role="alert">
                {diagnosticError}
              </p>
            ) : null}
            {!revealed ? (
              <button
                className="ss-button ss-button-primary"
                type="button"
                onClick={correctDiagnostic}
              >
                {confirmBlankSubmission
                  ? `Entregar con ${questions.length - answeredCount} en blanco`
                  : "Corregir mis decisiones"}
              </button>
            ) : null}
          </div>
        </div>
        ) : (
          <div className="ss-success ss-capture-locked" role="status">
            <span>REVISIÓN EN CURSO</span>
            <h3>El microcaso aún no está publicado.</h3>
            <p>
              La muestra permanece cerrada hasta completar la revisión académica
              y jurídica exigida. No mostramos un borrador como contenido definitivo.
            </p>
          </div>
        )}
      </section>

      {diagnosticPublicable && revealed ? (
        <section className="ss-result" id="resultado" aria-live="polite">
          <div className="ss-score-card">
            <span className="ss-score-label">PUNTUACIÓN DIRECTA</span>
            <strong>{result.raw.toFixed(2).replace(".", ",")} / 5</strong>
            <p>
              {result.correct} aciertos · {result.incorrect} errores ·{" "}
              {result.unanswered} en blanco
            </p>
          </div>
          <div className="ss-result-copy">
            <p className="ss-label">TU DIAGNÓSTICO</p>
            <h2>{result.band.title}</h2>
            <p>{result.band.text}</p>
            {result.dominantError ? (
              <div className="ss-error-map">
                <span>ERROR DOMINANTE</span>
                <strong>{result.dominantError.label}</strong>
                <p>
                  {result.reviewTargets[0] ??
                    "Revisa la regla asociada antes de repetir el caso."}
                </p>
              </div>
            ) : result.correct === questions.length ? (
              <div className="ss-error-map is-clear">
                <span>MAPA DE ERRORES</span>
                <strong>Sin fallos en este intento</strong>
                <p>Repite más adelante para comprobar que la regla se mantiene.</p>
              </div>
            ) : null}
            <p className="ss-result-caveat">
              Esta puntuación aplica la penalización directa de la convocatoria.
              El tribunal publica después el baremo de puntuación transformada.
            </p>
            <div className="ss-result-actions">
              <a className="ss-button ss-button-dark" href="#captacion">
                Recibir mi ruta de repaso
              </a>
              <button
                className="ss-text-button"
                type="button"
                onClick={restartDiagnostic}
              >
                Repetir el microcaso
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="ss-capture" id="captacion">
        <div className="ss-capture-copy">
          <p className="ss-label">GUARDA EL SIGUIENTE PASO</p>
          <h2>Recibe la ruta de repaso y la apertura de la preventa.</h2>
          <p>
            Indica tu fase y tu principal bloqueo. Solo pedimos los datos
            necesarios para enviarte la ruta y avisarte de la apertura.
          </p>
          <ul>
            <li>Resumen del método de decisión.</li>
            <li>Aviso antes de abrir la preventa.</li>
            <li>Puedes pedir la baja en el mismo chat de WhatsApp.</li>
          </ul>
        </div>

        <div className="ss-form-card">
          {!captureEnabled || !capturePrivacyUrl ? (
            <div className="ss-success ss-capture-locked" role="status">
              <span>CAPTACIÓN PREPARADA</span>
              <h3>El formulario todavía no recoge datos.</h3>
              <p>
                Lo activaremos cuando la información de privacidad identifique
                al responsable del tratamiento. El microcaso se podrá resolver
                sin registro cuando supere también su revisión editorial.
              </p>
            </div>
          ) : submitState === "success" ? (
            <div className="ss-success" role="status">
              <span>RECIBIDO</span>
              <h3>Tu acceso prioritario está guardado.</h3>
              <p>
                Te enviaremos por WhatsApp la ruta de repaso y las condiciones
                antes de activar cualquier cobro.
              </p>
              <a className="ss-button ss-button-dark" href="#preventa">
                Ver qué incluirá CasoLab
              </a>
            </div>
          ) : (
            <form onSubmit={submitLead}>
              <div className="ss-form-index">
                <span>FICHA / 01</span>
                <span>4 datos obligatorios · email opcional</span>
              </div>
              <div className="ss-field-row">
                <label>
                  Nombre
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    required
                    placeholder="Tu nombre"
                  />
                </label>
                <label>
                  WhatsApp
                  <input
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={16}
                    pattern="[+][1-9][0-9]{1,14}"
                    required
                    placeholder="+34612345678"
                  />
                </label>
              </div>
              <label>
                Email <span aria-hidden="true">(opcional)</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={160}
                  placeholder="tu@email.com"
                />
              </label>
              <label>
                Fase de preparación
                <select name="stage" defaultValue="" required>
                  <option value="" disabled>
                    Selecciona tu fase
                  </option>
                  <option value="exploring">Valoro preparar SS C1</option>
                  <option value="starting">He empezado ahora</option>
                  <option value="studying">Estudio el temario</option>
                  <option value="practicing">Practico supuestos</option>
                  <option value="previous-exam">Ya hice un examen</option>
                </select>
              </label>
              <label>
                Principal bloqueo
                <select name="challenge" defaultValue="" required>
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  <option value="knowledge">Confundo reglas y plazos</option>
                  <option value="time">Dudo demasiado entre respuestas</option>
                  <option value="feedback">No sé por qué fallo</option>
                  <option value="structure">No conecto el caso completo</option>
                  <option value="starting">No sé cómo empezar a practicar</option>
                </select>
              </label>
              <label className="ss-consent">
                <input name="whatsappConsent" type="checkbox" required />
                <span>
                  He leído la{" "}
                  <a href={capturePrivacyUrl} target="_blank" rel="noreferrer">
                    información de privacidad
                  </a>{" "}
                  y acepto que SS CasoLab use este número para enviarme por
                  WhatsApp el diagnóstico y comunicaciones sobre el proyecto.
                  No se me añadirá a un grupo. Puedo retirar el consentimiento
                  en cualquier momento.
                </span>
              </label>
              <label className="ss-honeypot" aria-hidden="true">
                Empresa
                <input
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
              {submitState === "error" ? (
                <p className="ss-form-error" role="alert">
                  {leadError}
                </p>
              ) : null}
              <button
                className="ss-button ss-button-primary"
                type="submit"
                disabled={submitState === "sending"}
              >
                {submitState === "sending"
                  ? "Guardando…"
                  : "Recibir la ruta de repaso"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="ss-preorder" id="preventa">
        <div className="ss-preorder-title">
          <p className="ss-label">BETA PROGRESIVA · EDICIÓN FUNDADORA</p>
          <h2>Prepara las dos partes con una sola ruta de estudio.</h2>
          <p>
            El producto parte del temario exacto de SS: temas redactados,
            tests por temas, simulacros, normativa y fuentes oficiales. La
            práctica digital sirve para comprobar el estudio y localizar qué
            debes repasar.
          </p>
        </div>

        <div className="ss-product-card">
          <span className="ss-product-sticker">ACCESO 6 MESES</span>
          <div className="ss-price">
            <span>Precio fundador previsto</span>
            <strong>49 €</strong>
            <small>pago único</small>
          </div>
          <div className="ss-content-status" aria-label="Estado editorial del contenido">
            <div className="ss-content-status-head">
              <span>INVENTARIO DE LA VERSIÓN ACTUAL</span>
              <strong>ESTRUCTURA COMPLETA · PUBLICACIÓN CERRADA</strong>
            </div>
            <p>
              El material de Alba está organizado en ocho áreas. Antes de
              publicar cada recurso comprobaremos su vigencia, formato y
              trazabilidad normativa.
            </p>
            <div className="ss-product-grid">
              {CORPUS_STATUS_ITEMS.map(([number, label]) => (
                <div key={label}>
                  <strong>{number}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <h3>Contenido disponible en el temario fuente</h3>
          <div className="ss-product-grid">
            {BETA_ITEMS.map(([number, label]) => (
              <div key={label}>
                <strong>{number}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <h3>Cómo se transformará en el producto digital</h3>
          <div className="ss-product-grid">
            {COMPLETE_ITEMS.map(([number, label]) => (
              <div key={label}>
                <strong>{number}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <ul className="ss-boundaries">
            <li>Temario general y específico en la misma ruta.</li>
            <li>Tests por tema y simulacros para practicar sin horarios.</li>
            <li>Normativa, fuentes oficiales y control de actualización.</li>
            <li>Sin clases semanales.</li>
            <li>Sin tutoría individual ilimitada.</li>
            <li>Sin corrección manual de cada intento.</li>
            <li>Soporte individual por WhatsApp en dos ventanas semanales.</li>
          </ul>
          {orderingEnabled ? (
            <a className="ss-button ss-button-primary" href="/ss-casolab/pedido">
              Ver oferta y crear pedido
            </a>
          ) : (
            <button
              className="ss-button ss-button-disabled"
              type="button"
              disabled
            >
              Pedidos cerrados hasta superar los gates
            </button>
          )}
          <p className="ss-checkout-notice" role="status">
            {orderingEnabled
              ? "El importe, los documentos vigentes y la referencia de Bizum profesional se muestran antes de pagar."
              : "El pedido Bizum profesional se activará aquí solo después de las pruebas jurídicas, bancarias y de acceso."}
          </p>
        </div>

        <div className="ss-conditions">
          <h3>Calendario propuesto antes de abrir el cobro</h3>
          <dl>
            <div>
              <dt>Apertura beta</dt>
              <dd>14 de agosto de 2026, sujeta a revisión y pruebas.</dd>
            </div>
            <div>
              <dt>Mínimo</dt>
              <dd>10 reservas para producir la edición completa.</dd>
            </div>
            <div>
              <dt>Entrega completa</dt>
              <dd>Objetivo: 27 de octubre de 2026.</dd>
            </div>
            <div>
              <dt>Si no se lanza</dt>
              <dd>Devolución íntegra del importe cobrado.</dd>
            </div>
          </dl>
          <p>
            Estas fechas no son todavía una oferta de contratación. El checkout
            solo se abrirá cuando muestre identidad, impuestos, desistimiento,
            devolución, contenido disponible y soporte antes del pago.
          </p>
        </div>
      </section>

      <section className="ss-faq" id="preguntas">
        <div className="ss-section-heading">
          <p className="ss-label">ANTES DE RESERVAR</p>
          <h2>Preguntas frecuentes.</h2>
        </div>
        <div className="ss-faq-list">
          <details>
            <summary>¿Prepara las dos partes del ejercicio?</summary>
            <p>
              Sí. La fuente editorial cubre los 23 temas generales y los 13
              específicos. La publicación digital será progresiva: antes de
              pagar podrás ver qué materiales están disponibles y qué recursos
              siguen en revisión.
            </p>
          </details>
          <details>
            <summary>¿Incluye correcciones individuales?</summary>
            <p>
              No en el producto base. Los tests y simulacros se diseñarán para
              autocorrección y revisión guiada. Una revisión humana podría
              ofrecerse después como servicio limitado y separado.
            </p>
          </details>
          <details>
            <summary>¿La puntuación equivale a la del tribunal?</summary>
            <p>
              No. Aplicamos la penalización directa publicada. El tribunal fija
              y publica el baremo que transforma la puntuación de la prueba.
            </p>
          </details>
          <details>
            <summary>¿Cuánto soporte incluye?</summary>
            <p>
              El soporte cubre acceso y uso. Las dudas recurrentes se agrupan y
              responden por WhatsApp en dos ventanas semanales. No hay
              mensajería inmediata ni tutoría ilimitada.
            </p>
          </details>
          <details>
            <summary>¿Es material oficial?</summary>
            <p>
              No. SS CasoLab es un producto educativo independiente y no tiene
              relación con la Seguridad Social, el ministerio ni el tribunal.
            </p>
          </details>
        </div>
      </section>

      <section className="ss-sources">
        {diagnosticPublicable ? (
          <>
            <div>
              <p className="ss-label">FUENTES DEL MICROCASO</p>
              <h2>La corrección enlaza la regla que aplica.</h2>
            </div>
            <ul>
              {caseSources.map((source) => (
                <li key={`${source.url}|${source.location}`}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.location}
                  </a>{" "}
                  <span>(consulta: {source.consultedAt})</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div>
            <p className="ss-label">CONTROL EDITORIAL</p>
            <h2>El caso y sus fuentes permanecen cerrados durante la revisión.</h2>
          </div>
        )}
        <p className="ss-legal-note">
          Formato y plazas: {" "}
          <a
            href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-27158"
            target="_blank"
            rel="noreferrer"
          >
            convocatoria en el BOE
          </a>{" "}
          y {" "}
          <a
            href="https://www.boe.es/buscar/doc.php?id=BOE-A-2026-5351"
            target="_blank"
            rel="noreferrer"
          >
            corrección de errores
          </a>
          . Estas fuentes describen el proceso y no sustituyen las fuentes de
          corrección listadas arriba.
        </p>
        <p className="ss-legal-note">
          {diagnosticPublicable && caseContext
            ? `Contenido beta con revisión académica y jurídica registrada. Corte normativo: ${caseContext.legislationCutoffAt}.`
            : "Contenido beta pendiente de revisión académica y jurídica externa antes de su publicación."}{" "}
          Consulta siempre la convocatoria y la normativa vigente.
        </p>
      </section>

      <footer className="ss-footer">
        <a className="ss-brand" href="#inicio">
          <span className="ss-brand-stamp" aria-hidden="true">
            SS
          </span>
          <span>
            <strong>SS CasoLab</strong>
            <small>Decide · corrige · repasa</small>
          </span>
        </a>
        <p>
          Producto educativo independiente. No está vinculado con la
          Administración de la Seguridad Social.
        </p>
        <a href="#inicio">Volver al inicio</a>
      </footer>
    </main>
  );
}

export default function SsCasoLabPage() {
  return <SsCasoLabLanding messageVariant="method" />;
}
