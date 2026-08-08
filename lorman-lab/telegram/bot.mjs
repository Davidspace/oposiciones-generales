/**
 * Prototipo local de Telegram para captación con consentimiento.
 *
 * No importa usuarios, no busca usernames y no inicia conversaciones. La
 * única conversación válida comienza con /start enviado por la persona.
 */

export const COURSES = {
  TCAE: { label: "TCAE", resource: "Muestra TCAE (enlace local pendiente)" },
  TAI: { label: "TAI C1", resource: "Muestra TAI (enlace local pendiente)" },
  SS: { label: "Administrativo SS C1", resource: "Muestra SS CasoLab (enlace local pendiente)" },
  C2: { label: "Auxiliar AGE C2", resource: "Muestra C2: /c2#prueba" },
  AJ: { label: "Auxilio Judicial C2", resource: "Landing de tests: https://auxiliojudicial.academialorman.es" },
};

export const MAX_FOLLOWUPS = 3;
export const MIN_FOLLOWUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

export class ConsentStore {
  #records = new Map();

  get(chatId) {
    return this.#records.get(String(chatId));
  }

  upsert(chatId, patch) {
    const key = String(chatId);
    const next = { ...(this.#records.get(key) ?? {}), ...patch };
    this.#records.set(key, next);
    return next;
  }

  delete(chatId) {
    this.#records.delete(String(chatId));
  }

  size() {
    return this.#records.size;
  }
}

const normalize = (value) => value.trim().toLocaleUpperCase("es-ES");

function courseKey(value) {
  const normalized = normalize(value).replace(/^\//, "");
  if (normalized === "SS" || normalized.includes("SEGURIDAD")) return "SS";
  if (normalized === "TAI" || normalized.includes("INFORMÁTICA") || normalized.includes("INFORMATICA")) return "TAI";
  if (normalized === "C2" || normalized.includes("AUXILIAR")) return "C2";
  if (normalized === "AJ" || normalized.includes("AUXILIO") || normalized.includes("JUDICIAL") || normalized.includes("JURIDIC")) return "AJ";
  if (normalized.includes("TCAE")) return "TCAE";
  return null;
}

const intro = [
  "Hola. Soy el bot de Academia LORMAN.",
  "Solo te enviaré recursos si tú eliges una oposición y aceptas recibir esta secuencia.",
  "Responde con TCAE, TAI, SS, C2 o AJ para elegir tu recurso.",
].join("\n");

export async function handleUpdate(update, store, sendMessage, now = Date.now()) {
  const message = update?.message;
  const chatId = message?.chat?.id;
  const text = typeof message?.text === "string" ? message.text.trim() : "";
  if (chatId === undefined || !text) return { handled: false, reason: "no_text_message" };

  const command = normalize(text.split(/\s+/)[0]);
  if (command === "/START") {
    const campaign = text.split(/\s+/)[1] ?? "direct";
    store.upsert(chatId, { chatId: String(chatId), campaign, pending: true, stopped: false, consentedAt: null, followupsSent: 0 });
    await sendMessage(chatId, intro);
    return { handled: true, action: "start" };
  }

  if (command === "/STOP") {
    if (store.get(chatId)) store.upsert(chatId, { stopped: true, pending: false, stoppedAt: now });
    await sendMessage(chatId, "He detenido los mensajes. Puedes volver a iniciar el bot cuando quieras con /start.");
    return { handled: true, action: "stop" };
  }

  if (command === "/DELETE") {
    store.delete(chatId);
    await sendMessage(chatId, "He borrado los datos locales de esta conversación.");
    return { handled: true, action: "delete" };
  }

  const current = store.get(chatId);
  if (!current) return { handled: false, reason: "no_opt_in" };
  if (current.stopped) return { handled: false, reason: "stopped" };

  const selectedCourse = courseKey(text);
  if (selectedCourse && !current.consentedAt) {
    store.upsert(chatId, { course: selectedCourse, pending: true });
    await sendMessage(chatId, `Has elegido ${COURSES[selectedCourse].label}. Responde ACEPTO para recibir la muestra y hasta tres avisos útiles. Responde /stop para no recibirlos.`);
    return { handled: true, action: "course_selected", course: selectedCourse };
  }

  if ((command === "SI" || command === "ACEPTO" || command === "ACEPTAR") && current.course && !current.consentedAt) {
    const consented = store.upsert(chatId, { consentedAt: now, pending: false, stopped: false, followupsSent: 0 });
    await sendMessage(chatId, `Consentimiento registrado el ${new Date(now).toISOString()}. Recurso: ${COURSES[consented.course].resource}`);
    return { handled: true, action: "consent", course: consented.course };
  }

  if (command === "/CURSOS") {
    await sendMessage(chatId, Object.values(COURSES).map((course) => `· ${course.label}`).join("\n"));
    return { handled: true, action: "courses" };
  }

  await sendMessage(chatId, "No he enviado nada porque falta elegir una oposición y aceptar recibir mensajes. Responde TCAE, TAI, SS, C2 o AJ, y después ACEPTO.");
  return { handled: true, action: "consent_reminder" };
}

export async function sendFollowup(chatId, store, sendMessage, text, now = Date.now(), { campaignEnabled = true } = {}) {
  if (!campaignEnabled) return { sent: false, reason: "campaign_disabled" };
  const current = store.get(chatId);
  if (!current?.consentedAt || current.stopped) return { sent: false, reason: "no_active_consent" };
  if ((current.followupsSent ?? 0) >= MAX_FOLLOWUPS) return { sent: false, reason: "followup_limit" };
  if (current.lastFollowupAt && now - current.lastFollowupAt < MIN_FOLLOWUP_INTERVAL_MS) return { sent: false, reason: "rate_limit" };
  await sendMessage(chatId, text);
  store.upsert(chatId, { followupsSent: (current.followupsSent ?? 0) + 1, lastFollowupAt: now });
  return { sent: true, remaining: MAX_FOLLOWUPS - (current.followupsSent ?? 0) - 1 };
}

export function createTelegramSender({ token, dryRun = true, onDryRun } = {}) {
  return async function sendMessage(chatId, text) {
    if (dryRun) {
      onDryRun?.({ chatId: String(chatId), text });
      return { ok: true, dryRun: true };
    }
    if (!token) throw new Error("TELEGRAM_BOT_TOKEN es obligatorio cuando TELEGRAM_DRY_RUN=false");
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!response.ok) throw new Error(`Telegram API respondió ${response.status}`);
    return response.json();
  };
}

export async function pollOnce({ token, offset = 0, timeout = 0 } = {}) {
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN no configurado");
  const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates?timeout=${timeout}&offset=${offset}`);
  if (!response.ok) throw new Error(`Telegram API respondió ${response.status}`);
  return response.json();
}
