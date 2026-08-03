import test from "node:test";
import assert from "node:assert/strict";
import { ConsentStore, handleUpdate, sendFollowup } from "./bot.mjs";

const update = (chatId, text) => ({ message: { chat: { id: chatId }, text } });

test("no inicia conversaciones con un usuario que no hizo /start", async () => {
  const store = new ConsentStore();
  const sent = [];
  const result = await handleUpdate(update(1, "C2"), store, async (_chat, text) => sent.push(text));
  assert.equal(result.reason, "no_opt_in");
  assert.equal(sent.length, 0);
});

test("requiere curso y consentimiento antes de entregar el recurso", async () => {
  const store = new ConsentStore();
  const sent = [];
  const send = async (_chat, text) => sent.push(text);
  await handleUpdate(update(2, "/start campaña-c2"), store, send, 1000);
  await handleUpdate(update(2, "C2"), store, send, 2000);
  assert.equal(store.get(2).consentedAt, null);
  await handleUpdate(update(2, "ACEPTO"), store, send, 3000);
  assert.equal(store.get(2).course, "C2");
  assert.equal(store.get(2).consentedAt, 3000);
  assert.match(sent.at(-1), /Muestra C2/);
});

test("/stop corta seguimiento y /delete elimina el registro", async () => {
  const store = new ConsentStore();
  const send = async () => {};
  await handleUpdate(update(3, "/start"), store, send, 1000);
  await handleUpdate(update(3, "TAI"), store, send, 2000);
  await handleUpdate(update(3, "ACEPTO"), store, send, 3000);
  await handleUpdate(update(3, "/stop"), store, send, 4000);
  assert.equal(store.get(3).stopped, true);
  await handleUpdate(update(3, "/delete"), store, send, 5000);
  assert.equal(store.get(3), undefined);
});

test("limita seguimiento a tres mensajes y aplica intervalo", async () => {
  const store = new ConsentStore();
  const sent = [];
  const send = async (_chat, text) => sent.push(text);
  await handleUpdate(update(4, "/start"), store, send, 0);
  await handleUpdate(update(4, "SS"), store, send, 1);
  await handleUpdate(update(4, "ACEPTO"), store, send, 2);
  assert.equal((await sendFollowup(4, store, send, "uno", 3)).sent, true);
  assert.equal((await sendFollowup(4, store, send, "demasiado pronto", 4)).reason, "rate_limit");
  assert.equal((await sendFollowup(4, store, send, "dos", 24 * 60 * 60 * 1000 + 4)).sent, true);
  assert.equal((await sendFollowup(4, store, send, "tres", 2 * 24 * 60 * 60 * 1000 + 4)).sent, true);
  assert.equal((await sendFollowup(4, store, send, "cuatro", 3 * 24 * 60 * 60 * 1000 + 4)).reason, "followup_limit");
  assert.equal(sent.filter((value) => ["uno", "dos", "tres"].includes(value)).length, 3);
});

test("permite desactivar una campaña completa", async () => {
  const store = new ConsentStore();
  const sent = [];
  const send = async (_chat, text) => sent.push(text);
  await handleUpdate(update(5, "/start"), store, send, 0);
  await handleUpdate(update(5, "C2"), store, send, 1);
  await handleUpdate(update(5, "ACEPTO"), store, send, 2);
  const result = await sendFollowup(5, store, send, "no enviar", 3, { campaignEnabled: false });
  assert.equal(result.reason, "campaign_disabled");
  assert.equal(sent.includes("no enviar"), false);
});
