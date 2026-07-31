"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Offer = {
  productId: string;
  offerVersion: string;
  amountCents: number;
  currency: "EUR";
  ttlHours: number;
  seller: { legalName: string; nif: string; address: string; email: string };
  supportHours: string;
  termsVersion: string;
  privacyVersion: string;
  documents: {
    inventoryUrl: string;
    termsUrl: string;
    privacyUrl: string;
    withdrawalUrl: string;
  };
};

type OrderView = {
  reference: string;
  amountCents: number;
  currency: "EUR";
  status: string;
  expiresAt: string;
  nextAction: string;
  bizum: null | {
    mode: "professional_manual";
    recipient: string;
    displayName: string;
  };
  whatsapp: { url: string; supportHours: string };
};

type LoadState = "loading" | "closed" | "ready" | "error";
type SubmitState = "idle" | "sending" | "error";
let volatileSessionId: string | null = null;

const ORDER_STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  awaiting_payment: "Pendiente de pago",
  payment_reported: "Aviso recibido; pago sin verificar",
  needs_review: "Revisión manual necesaria",
  paid: "Pago verificado",
  refund_pending: "Devolución pendiente",
  expired: "Pedido caducado",
  cancelled: "Pedido cancelado",
  refunded: "Importe devuelto",
};

const ORDER_STATUS_MESSAGES: Record<string, string> = {
  draft: "El pedido aún no está listo para recibir un pago.",
  awaiting_payment:
    "Usa solo las instrucciones de esta página y conserva la referencia exacta.",
  payment_reported:
    "Tu aviso está registrado. No significa que el pago esté confirmado.",
  needs_review:
    "Hay una incidencia de conciliación. No realices otro pago; soporte revisará la referencia.",
  paid: "El pago figura verificado. Revisa el email de acceso a Moodle.",
  refund_pending:
    "La devolución está en proceso. Su solicitud todavía no acredita el abono.",
  expired:
    "El pedido ha caducado. No realices el pago con estas instrucciones.",
  cancelled: "El pedido está cancelado. No realices el pago.",
  refunded: "La devolución figura verificada.",
};

function sessionId() {
  volatileSessionId ??= window.crypto.randomUUID();
  return volatileSessionId;
}

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}

function formatOrderStatus(status: string) {
  return ORDER_STATUS_LABELS[status] ?? "Estado no disponible";
}

function orderStatusMessage(status: string) {
  return (
    ORDER_STATUS_MESSAGES[status] ??
    "Consulta el siguiente paso o contacta con soporte usando la referencia."
  );
}

export default function OrderPage() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [order, setOrder] = useState<OrderView | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const createKey = useRef<string | null>(null);
  const reportKey = useRef<string | null>(null);
  const formStarted = useRef(false);

  function postEvent(
    eventType:
      | "offer_view"
      | "order_form_start"
      | "bizum_instructions_viewed"
      | "whatsapp_click",
    metadata: Record<string, string>,
  ) {
    if (!analyticsEnabled) return;
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventId: window.crypto.randomUUID(),
        sessionId: sessionId(),
        experiment: "ss-casolab",
        offerVariant: offer?.offerVersion ?? "order-page",
        eventType,
        path: window.location.pathname,
        metadata,
      }),
    });
  }

  async function fetchStatus(reference: string) {
    const response = await fetch(
      `/api/orders/status?reference=${encodeURIComponent(reference)}`,
      { cache: "no-store" },
    );
    const body = (await response.json()) as {
      ok?: boolean;
      order?: OrderView;
      message?: string;
    };
    if (!response.ok || !body.order) {
      throw new Error(body.message || "No se ha podido recuperar el pedido.");
    }
    setOrder(body.order);
  }

  useEffect(() => {
    let active = true;
    void Promise.all([
      fetch("/api/orders/disclosures", { cache: "no-store" }),
      fetch("/api/public-config?experiment=ss-casolab", { cache: "no-store" }),
    ])
      .then(async ([offerResponse, configResponse]) => {
        const config = (await configResponse.json()) as {
          analyticsEnabled?: boolean;
        };
        if (active) setAnalyticsEnabled(config.analyticsEnabled === true);

        const payload = (await offerResponse.json()) as {
          ok?: boolean;
          offer?: Offer;
          message?: string;
        };
        if (!offerResponse.ok || !payload.offer) {
          if (active) {
            setLoadState("closed");
            setMessage(
              payload.message || "La oferta todavía no está abierta a contratación.",
            );
          }
          return;
        }
        if (!active) return;
        setOffer(payload.offer);
        setLoadState("ready");

        const reference = new URLSearchParams(window.location.search).get(
          "reference",
        );
        if (reference) {
          try {
            await fetchStatus(reference);
          } catch (error) {
            if (active) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : "No se ha podido recuperar el pedido.",
              );
            }
          }
        }
      })
      .catch(() => {
        if (active) {
          setLoadState("error");
          setMessage("No se ha podido comprobar la apertura de pedidos.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  function startForm() {
    if (formStarted.current || !offer) return;
    formStarted.current = true;
    postEvent("order_form_start", {
      productId: offer.productId,
      offerVersion: offer.offerVersion,
    });
  }

  async function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!offer) return;
    setSubmitState("sending");
    setMessage("");
    createKey.current ??= window.crypto.randomUUID();
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": createKey.current,
        },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          termsAccepted: data.get("termsAccepted") === "on",
          privacyNoticeAcknowledged:
            data.get("privacyNoticeAcknowledged") === "on",
          digitalStartConsent: data.get("digitalStartConsent") === "on",
          withdrawalAcknowledged:
            data.get("withdrawalAcknowledged") === "on",
          sessionId: sessionId(),
          company: data.get("company"),
        }),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        order?: OrderView;
        message?: string;
      };
      if (!response.ok || !body.order) {
        throw new Error(body.message || "No se ha podido crear el pedido.");
      }
      setOrder(body.order);
      setSubmitState("idle");
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?reference=${encodeURIComponent(body.order.reference)}`,
      );
      if (body.order.status === "awaiting_payment") {
        postEvent("bizum_instructions_viewed", {
          orderStatus: "awaiting-payment",
        });
      }
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error ? error.message : "No se ha podido crear el pedido.",
      );
    }
  }

  async function reportPayment() {
    if (!order) return;
    setSubmitState("sending");
    setMessage("");
    reportKey.current ??= window.crypto.randomUUID();
    try {
      const response = await fetch("/api/orders/report-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": reportKey.current,
        },
        body: JSON.stringify({ reference: order.reference }),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        order?: OrderView;
        message?: string;
      };
      if (!response.ok || !body.order) {
        throw new Error(body.message || "No se ha podido registrar el aviso.");
      }
      setOrder(body.order);
      setSubmitState("idle");
      setMessage(
        "Aviso recibido. El pago sigue pendiente de comprobación manual.",
      );
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No se ha podido registrar el aviso.",
      );
    }
  }

  return (
    <main className="ss-page ss-order-page">
      <header className="ss-order-header">
        <a className="ss-brand" href="/ss-casolab" aria-label="Volver a SS CasoLab">
          <span className="ss-brand-stamp" aria-hidden="true">SS</span>
          <span><strong>SS CasoLab</strong><small>Pedido Bizum profesional</small></span>
        </a>
        <a className="ss-text-link" href="/ss-casolab">Volver al curso</a>
      </header>

      <section className="ss-order-hero">
        <p className="ss-label">HOJA DE REMESA · PEDIDO SEGURO</p>
        <h1>Primero revisa. Después crea la referencia. Por último, paga.</h1>
        <ol className="ss-order-steps" aria-label="Pasos del pedido">
          <li className={order ? "is-done" : "is-current"}><span>01</span><strong>Pedido</strong><small>Oferta y aceptaciones</small></li>
          <li className={order?.status === "awaiting_payment" ? "is-current" : order ? "is-done" : ""}><span>02</span><strong>Bizum</strong><small>Importe y referencia exactos</small></li>
          <li className={order && order.status !== "awaiting_payment" ? "is-current" : ""}><span>03</span><strong>Revisión</strong><small>Comprobación humana</small></li>
        </ol>
      </section>

      {loadState === "loading" ? (
        <section className="ss-order-sheet" aria-live="polite">
          <p className="ss-label">COMPROBANDO APERTURA</p>
          <h2>Verificamos la oferta y sus documentos.</h2>
        </section>
      ) : loadState !== "ready" || !offer ? (
        <section className="ss-order-sheet ss-order-closed" role="status">
          <p className="ss-label">PEDIDOS CERRADOS</p>
          <h2>No se puede crear un pedido ahora.</h2>
          <p>{message}</p>
          <p>No se ha recogido ningún dato ni se ha iniciado ningún pago.</p>
          <a className="ss-button ss-button-dark" href="/ss-casolab#captacion">Volver a la lista de apertura</a>
        </section>
      ) : order ? (
        <section className="ss-order-sheet" aria-live="polite">
          <div className="ss-order-folio">
            <span>REFERENCIA</span>
            <strong>{order.reference}</strong>
          </div>
          <h2>{order.status === "awaiting_payment" ? "Realiza el Bizum profesional" : "Estado del pedido"}</h2>
          <dl className="ss-order-summary">
            <div><dt>Importe</dt><dd>{formatMoney(order.amountCents, order.currency)}</dd></div>
            <div><dt>Estado</dt><dd>{formatOrderStatus(order.status)}</dd></div>
            <div><dt>Caducidad</dt><dd>{formatDate(order.expiresAt)}</dd></div>
          </dl>
          {order.bizum ? (
            <div className="ss-bizum-slip">
              <p><strong>Destinatario:</strong> {order.bizum.recipient}</p>
              <p><strong>Nombre mostrado:</strong> {order.bizum.displayName}</p>
              <p><strong>Concepto obligatorio:</strong> {order.reference}</p>
              <p className="ss-order-warning">Comprueba importe, destinatario y concepto dentro de tu aplicación bancaria. No envíes capturas, IBAN, DNI ni claves por WhatsApp.</p>
              <button className="ss-button ss-button-primary" type="button" disabled={submitState === "sending"} onClick={reportPayment}>
                He realizado el Bizum; avisar para revisión
              </button>
            </div>
          ) : (
            <div className="ss-order-status-copy">
              <p>{orderStatusMessage(order.status)}</p>
            </div>
          )}
          {message ? <p className={submitState === "error" ? "ss-form-error" : "ss-order-message"} role="status">{message}</p> : null}
          <div className="ss-order-actions">
            <button className="ss-text-button" type="button" onClick={() => fetchStatus(order.reference).catch((error) => setMessage(error.message))}>Actualizar estado</button>
            <a href={order.whatsapp.url} target="_blank" rel="noreferrer" onClick={() => postEvent("whatsapp_click", { context: "order-status" })}>Abrir soporte en WhatsApp</a>
          </div>
          <p className="ss-beta-note">Horario comunicado: {order.whatsapp.supportHours}. WhatsApp es un canal de soporte; no confirma el ingreso.</p>
        </section>
      ) : (
        <section className="ss-order-sheet">
          <div className="ss-order-offer">
            <div>
              <p className="ss-label">OFERTA VIGENTE · {offer.offerVersion}</p>
              <h2>{formatMoney(offer.amountCents, offer.currency)}</h2>
              <p>Importe total comunicado por el servidor. El pedido caduca en {offer.ttlHours} horas si no se registra el pago.</p>
            </div>
            <dl>
              <div><dt>Vendedor</dt><dd>{offer.seller.legalName}</dd></div>
              <div><dt>NIF</dt><dd>{offer.seller.nif}</dd></div>
              <div><dt>Contacto</dt><dd><a href={`mailto:${offer.seller.email}`}>{offer.seller.email}</a></dd></div>
            </dl>
          </div>
          <nav className="ss-order-documents" aria-label="Documentos de la oferta">
            <a href={offer.documents.inventoryUrl} target="_blank" rel="noreferrer">Inventario exacto</a>
            <a href={offer.documents.termsUrl} target="_blank" rel="noreferrer">Condiciones {offer.termsVersion}</a>
            <a href={offer.documents.privacyUrl} target="_blank" rel="noreferrer">Privacidad {offer.privacyVersion}</a>
            <a href={offer.documents.withdrawalUrl} target="_blank" rel="noreferrer">Desistimiento</a>
          </nav>
          <form className="ss-order-form" onSubmit={createOrder} onFocus={startForm}>
            <div className="ss-field-row">
              <label>Nombre completo<input name="name" type="text" autoComplete="name" minLength={2} maxLength={80} required /></label>
              <label>Email de acceso<input name="email" type="email" autoComplete="email" maxLength={160} required /></label>
            </div>
            <label className="ss-consent"><input name="termsAccepted" type="checkbox" required /><span>He leído y acepto las condiciones y el inventario exacto de la oferta.</span></label>
            <label className="ss-consent"><input name="privacyNoticeAcknowledged" type="checkbox" required /><span>Confirmo que he recibido la información de privacidad.</span></label>
            <label className="ss-consent"><input name="digitalStartConsent" type="checkbox" required /><span>Solicito que el acceso digital comience cuando el pago quede verificado, aunque continúe el plazo legal de desistimiento.</span></label>
            <label className="ss-consent"><input name="withdrawalAcknowledged" type="checkbox" required /><span>He leído la información específica sobre el inicio anticipado y sus posibles efectos sobre el desistimiento.</span></label>
            <label className="ss-honeypot" aria-hidden="true">Empresa<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
            {message ? <p className="ss-form-error" role="alert">{message}</p> : null}
            <button className="ss-button ss-button-primary" type="submit" disabled={submitState === "sending"}>
              {submitState === "sending" ? "Creando pedido…" : "Crear pedido con obligación de pago"}
            </button>
            <p className="ss-beta-note">Este botón crea la referencia y las instrucciones. No carga una tarjeta ni confirma por sí solo un pago.</p>
          </form>
        </section>
      )}
    </main>
  );
}
