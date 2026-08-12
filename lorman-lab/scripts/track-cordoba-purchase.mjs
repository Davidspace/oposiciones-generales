/**
 * Registra purchase_cordoba únicamente después de confirmar un pago real.
 * No se importa desde el navegador y no contiene secretos.
 */

const measurementId = process.env.GA4_MEASUREMENT_ID?.trim() || "G-ZD1KT7K2JM";
const apiSecret = process.env.GA4_API_SECRET?.trim();
const clientId = process.env.GA4_CLIENT_ID?.trim();
const transactionId = process.env.CORDOBA_TRANSACTION_ID?.trim() || `cordoba-${Date.now()}`;
const price = Number(process.env.CORDOBA_PRICE_EUR || 69);

if (!apiSecret || !clientId) {
  console.error("Faltan GA4_API_SECRET o GA4_CLIENT_ID. No se ha enviado ningún evento.");
  process.exit(1);
}
if (!Number.isFinite(price) || price <= 0) {
  console.error("CORDOBA_PRICE_EUR debe ser un importe positivo. No se ha enviado ningún evento.");
  process.exit(1);
}

const endpoint = new URL("https://www.google-analytics.com/mp/collect");
endpoint.searchParams.set("measurement_id", measurementId);
endpoint.searchParams.set("api_secret", apiSecret);

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    client_id: clientId,
    events: [
      {
        name: "purchase_cordoba",
        params: {
          course: "auxiliar_administrativo_cordoba",
          transaction_id: transactionId,
          value: price,
          currency: "EUR",
        },
      },
    ],
  }),
});

if (!response.ok) {
  console.error(`GA4 rechazó el evento (${response.status}).`);
  process.exit(1);
}

console.log(`purchase_cordoba registrado para la transacción ${transactionId}.`);
