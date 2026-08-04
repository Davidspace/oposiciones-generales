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
import { PORTFOLIO_URL } from "@/lib/portfolio-links";
import { AvisoComun, AVISO_PRECIOS } from "@/components/AvisoComun";
import { Cajon, CajonCierre } from "@/components/Cajones";
import { CtaContacto } from "@/components/CtaContacto";
import { EnlaceInstagram } from "@/components/Instagram";
import { MuestraMaterial } from "@/components/MuestraMaterial";

type SubmitState = "idle" | "sending" | "success" | "error";
type EventType =
  | "landing_view"
  | "diagnostic_start"
  | "diagnostic_complete"
  | "lead_submit";

const EXPERIMENT = "ss-casolab";
const WHATSAPP = "34640828654";
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
    <>
      <a className="ss-skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>
      <main className="lm-page lm-ss ss-page" id="contenido-principal" tabIndex={-1}>
      <header className="lm-shell lm-header">
        <a className="lm-logo" href="#inicio" aria-label="Academia LORMAN, inicio">
          <img src="/lorman-logo.png" alt="Academia LORMAN" />
        </a>
        <nav className="lm-nav" aria-label="Navegación de SS CasoLab">
          <a className="lm-nav-back" href={PORTFOLIO_URL}>← Cursos</a>
          <a className="lm-nav-material" href="#acceso">Qué incluye</a>
          <EnlaceInstagram size={12} />
        </nav>
      </header>

      <section className="ss-hero" id="inicio">
        <div className="ss-hero-copy">
          <p className="ss-label">SEGURIDAD SOCIAL · SUBGRUPO C1</p>
          <h1>Administrativo de la<br />Seguridad Social</h1>
          <p className="ss-hero-lead">
            Temario general y específico, tests por tema y supuestos prácticos.
            Pago único de 49 € con acceso hasta el día del examen.
          </p>
          <CtaContacto whatsapp={WHATSAPP}>
            <a className="lm-btn lm-btn-outline" href="#acceso">Qué incluye</a>
          </CtaContacto>
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

      </section>

      <section className="lm-shell lm-boxes" aria-label="Contenido de SS CasoLab">
        <Cajon kicker="01 · TEMARIO" title="General y específico" text="Temas redactados con la normativa citada y actualizada." figure="36 temas" />
        <Cajon kicker="02 · TEST" title="Tests por tema" text="Corrección automática y referencia a la norma aplicada." figure="uno por tema" />
        <Cajon kicker="03 · PRÁCTICA" title="Supuestos prácticos" text="Aplica la regla para decidir, como en el ejercicio real." figure="14 supuestos estructurados" />
        <CajonCierre kicker="04 · PRECIO" title="Pago único de 49 €" text="Temario, tests y supuestos prácticos, con acceso hasta el día del examen." href={orderingEnabled ? "/ss-casolab/pedido" : "#acceso"} />
      </section>

      <p className="lm-fineprint ss-reference-note">Convocatoria de 31 de diciembre de 2025 · 1.056 plazas de acceso libre · ejercicio único de 120 minutos · <a href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-27158" target="_blank" rel="noreferrer">Consultar BOE</a></p>

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
          <h2>Recibe la ruta de repaso y las condiciones de acceso.</h2>
          <p>
            Indica tu fase y tu principal bloqueo. Solo pedimos los datos
            necesarios para enviarte la ruta y conocer las condiciones de acceso.
          </p>
          <ul>
            <li>Resumen del método de decisión.</li>
            <li>Condiciones de acceso y soporte.</li>
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
              <h3>Tu interés está guardado.</h3>
              <p>
                Te enviaremos por WhatsApp la ruta de repaso y las condiciones
                de acceso.
              </p>
              <a className="ss-button ss-button-dark" href="#acceso">
                Ver el acceso a CasoLab
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

      <section className="ss-preorder" id="acceso">
        <div className="ss-preorder-title">
          <p className="ss-label">ACCESO AL CURSO · PAGO ÚNICO</p>
          <h2>Prepara las dos partes con una sola ruta de estudio.</h2>
          <p>
            El producto parte del temario exacto de SS: temas redactados,
            tests por temas, simulacros, normativa y fuentes oficiales. La
            práctica digital sirve para comprobar el estudio y localizar qué
            debes repasar.
          </p>
        </div>

        <div className="ss-product-card">
          <span className="ss-product-sticker">ACCESO HASTA EL EXAMEN</span>
          <div className="ss-price">
            <span>Precio del curso</span>
            <strong>49 €</strong>
            <small>pago único</small>
          </div>
          <div className="ss-content-status" aria-label="Estado editorial del contenido">
            <div className="ss-content-status-head">
              <span>INVENTARIO DE LA VERSIÓN ACTUAL</span>
              <strong>CONTENIDO ORGANIZADO · ACCESO DIGITAL</strong>
            </div>
            <p>
              El material de Alba está organizado en ocho áreas. Cada recurso
              se presenta con su bloque de estudio, práctica y referencia
              normativa para que puedas avanzar sin horarios.
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
          <h3>Contenido incluido</h3>
          <div className="ss-product-grid">
            {BETA_ITEMS.map(([number, label]) => (
              <div key={label}>
                <strong>{number}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <h3>Cómo está organizado el aula</h3>
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
              Acceso próximamente
            </button>
          )}
          <p className="ss-checkout-notice" role="status">
            {orderingEnabled
              ? "El importe, los documentos vigentes y la referencia de Bizum profesional se muestran antes de pagar."
              : "El acceso se habilitará cuando el checkout y las condiciones de contratación estén publicados."}
          </p>
        </div>

        <div className="ss-conditions">
          <h3>Condiciones de acceso</h3>
          <dl>
            <div>
              <dt>Duración</dt>
              <dd>Acceso hasta la fecha del examen de la convocatoria vigente.</dd>
            </div>
            <div>
              <dt>Pago</dt>
              <dd>49 € en un único pago, cuando el acceso esté habilitado.</dd>
            </div>
            <div>
              <dt>Formato</dt>
              <dd>Aula digital, tests y práctica autocorregible.</dd>
            </div>
            <div>
              <dt>Soporte</dt>
              <dd>Ayuda de acceso y uso, con límites publicados antes del pago.</dd>
            </div>
          </dl>
          <p>
            No hay preventa ni reserva. El cobro permanecerá cerrado hasta que
            la página muestre identidad, impuestos, desistimiento, devolución,
            contenido disponible y límites de soporte antes del pago.
          </p>
        </div>
      </section>

      <section className="ss-faq" id="preguntas">
        <div className="ss-section-heading">
          <p className="ss-label">ANTES DE EMPEZAR</p>
          <h2>Preguntas frecuentes.</h2>
        </div>
        <div className="ss-faq-list">
          <details>
            <summary>¿Prepara las dos partes del ejercicio?</summary>
            <p>
              Sí. La fuente editorial cubre los 23 temas generales y los 13
              específicos. Antes de pagar podrás ver el inventario disponible,
              la fecha de revisión y las condiciones de acceso.
            </p>
          </details>
          <details>
            <summary>¿Incluye correcciones individuales?</summary>
            <p>
              No en el producto base. Los tests y simulacros están preparados
              para autocorrección y revisión guiada. Una revisión humana podría
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

      <MuestraMaterial
        titulo="Muestra del material"
        intro="Páginas reales del temario y preguntas de ejemplo, para que veas el formato antes de decidir."
        grupos={[{
          paginas: [{}, {}, {}, {}],
          nota: "Las páginas de muestra se incorporarán cuando el material editorial esté preparado para publicación.",
        }]}
        preguntas={[
          { enunciado: "Enunciado de muestra sobre Seguridad Social", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
          { enunciado: "Enunciado de muestra sobre cotización", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
          { enunciado: "Enunciado de muestra sobre prestaciones", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
          { enunciado: "Enunciado de muestra sobre procedimiento administrativo", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
          { enunciado: "Enunciado de muestra sobre supuesto práctico", opciones: ["Contenido de muestra visual"], respuesta: "—", explicacion: "Consulta la respuesta revisada dentro del aula." },
        ]}
        notaPreguntas="Preguntas de ejemplo; el banco completo está en el campus."
      />

      <AvisoComun
        brand="SS CasoLab · Academia LORMAN"
        tagline="Decide · corrige · repasa."
        links={[
          { label: "Todos los cursos", href: PORTFOLIO_URL },
          { label: "WhatsApp", href: `https://wa.me/${WHATSAPP}` },
          { label: "Muestra", href: "#muestra" },
        ]}
        notice={
          "Producto educativo independiente sin relación con la Administración de la Seguridad Social, el ministerio ni el tribunal. " +
          "Los criterios de la convocatoria vigente siempre tienen prioridad. Ningún curso garantiza un resultado." +
          AVISO_PRECIOS
        }
      />
      </main>
    </>
  );
}

export default function SsCasoLabPage() {
  return <SsCasoLabLanding messageVariant="method" />;
}
