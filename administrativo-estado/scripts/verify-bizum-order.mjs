import { createInterface } from "node:readline/promises";

import { parseAdminPaymentInput } from "../lib/admin-orders.ts";
import { parseIdempotencyKey } from "../lib/public-orders.ts";

const HELP = `
Uso:
  npm.cmd run admin:verify-bizum -- [opciones]

Opciones obligatorias:
  --reference SS-...                 Referencia pública del pedido
  --expected-status <estado>         awaiting_payment | payment_reported | expired | cancelled
  --decision <decisión>              matched | needs_review | rejected
  --amount-cents <entero>            Importe observado en céntimos
  --observed-at <ISO>                Instante de la operación bancaria
  --reason <código>                  Motivo estructurado admitido

Opciones de control:
  --idempotency-key <UUIDv4>         Reutilizar en un reintento; se genera si falta
  --execute                          Envía la mutación; sin esta opción solo valida
  --help                             Muestra esta ayuda

Variables de entorno (nunca argumentos):
  SS_CASOLAB_ADMIN_API_URL
  SS_CASOLAB_ADMIN_ACTOR             david | alba
  SS_CASOLAB_ADMIN_DAVID_SECRET o SS_CASOLAB_ADMIN_ALBA_SECRET

Una decisión matched pide la referencia bancaria por entrada estándar. El script
no imprime ni guarda esa referencia. No ejecutes una conciliación real sin la
autorización operativa correspondiente.
`.trim();

function parseArguments(argv) {
  const values = new Map();
  let execute = false;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--execute") {
      execute = true;
      continue;
    }
    if (argument === "--help") return { help: true };
    if (!argument.startsWith("--") || index + 1 >= argv.length) {
      throw new Error(`Argumento incompleto o no reconocido: ${argument}`);
    }
    values.set(argument.slice(2), argv[index + 1]);
    index += 1;
  }
  return { help: false, execute, values };
}

function normalizedApiUrl(value) {
  const url = new URL(value);
  const local = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
    throw new Error("La API administrativa debe usar HTTPS o localhost.");
  }
  url.pathname = `${url.pathname.replace(/\/$/, "")}/api/admin/orders/verify-payment`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

async function readProviderTransactionId() {
  if (!process.stdin.isTTY) {
    let input = "";
    for await (const chunk of process.stdin) input += chunk;
    return input.trim();
  }
  const prompt = createInterface({ input: process.stdin, output: process.stderr });
  try {
    return (
      await prompt.question(
        "Referencia estable de la operación bancaria (no se guardará en claro): ",
      )
    ).trim();
  } finally {
    prompt.close();
  }
}

async function main() {
  const parsedArguments = parseArguments(process.argv.slice(2));
  if (parsedArguments.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }

  const actor = process.env.SS_CASOLAB_ADMIN_ACTOR?.trim();
  if (actor !== "david" && actor !== "alba") {
    throw new Error("SS_CASOLAB_ADMIN_ACTOR debe ser david o alba.");
  }
  const secretName =
    actor === "david"
      ? "SS_CASOLAB_ADMIN_DAVID_SECRET"
      : "SS_CASOLAB_ADMIN_ALBA_SECRET";
  const secret = process.env[secretName]?.trim() ?? "";
  if (secret.length < 48) {
    throw new Error(`${secretName} no está configurado de forma segura.`);
  }

  const values = parsedArguments.values;
  const decision = values.get("decision");
  const providerTransactionId =
    decision === "matched" ? await readProviderTransactionId() : undefined;
  const candidate = {
    reference: values.get("reference"),
    expectedStatus: values.get("expected-status"),
    decision,
    observedAmountCents: Number(values.get("amount-cents")),
    observedAt: values.get("observed-at"),
    providerTransactionId,
    reasonCode: values.get("reason"),
  };
  const parsedInput = parseAdminPaymentInput(candidate);
  if (parsedInput.kind !== "valid") throw new Error(parsedInput.message);

  const suppliedKey = values.get("idempotency-key") ?? crypto.randomUUID();
  const idempotencyKey = parseIdempotencyKey(suppliedKey);
  if (!idempotencyKey) throw new Error("La clave de idempotencia no es un UUIDv4.");

  const safeSummary = {
    actor,
    decision: parsedInput.input.decision,
    expectedStatus: parsedInput.input.expectedStatus,
    idempotencyKey,
    observedAmountCents: parsedInput.input.observedAmountCents,
    observedAt: parsedInput.input.observedAt,
    reasonCode: parsedInput.input.reasonCode,
    reference: parsedInput.input.reference,
    providerReferenceProvided: providerTransactionId !== undefined,
  };
  process.stdout.write(`${JSON.stringify(safeSummary, null, 2)}\n`);
  if (!parsedArguments.execute) {
    process.stdout.write("DRY RUN: no se ha enviado ninguna mutación.\n");
    return;
  }

  const apiBase = process.env.SS_CASOLAB_ADMIN_API_URL?.trim();
  if (!apiBase) throw new Error("Falta SS_CASOLAB_ADMIN_API_URL.");
  const response = await fetch(normalizedApiUrl(apiBase), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(parsedInput.input),
  });
  const payload = await response.json();
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  if (!response.ok) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Error administrativo no identificado."}\n`,
  );
  process.exitCode = 1;
});
