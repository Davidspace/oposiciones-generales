export const PAYMENT_STATUSES = [
  "draft",
  "awaiting_payment",
  "payment_reported",
  "needs_review",
  "paid",
  "refund_pending",
  "expired",
  "cancelled",
  "refunded",
] as const;

export const ACCESS_STATUSES = [
  "pending",
  "provisioned",
  "failed",
  "revoked",
] as const;

export const ORDER_ACTORS = ["buyer", "system", "david", "alba"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type AccessStatus = (typeof ACCESS_STATUSES)[number];
export type OrderActor = (typeof ORDER_ACTORS)[number];

type Rule<Status extends string> = {
  to: Status;
  actors: ReadonlySet<OrderActor>;
};

const PAYMENT_STATUS_SET = new Set<string>(PAYMENT_STATUSES);
const ACCESS_STATUS_SET = new Set<string>(ACCESS_STATUSES);
const ORDER_ACTOR_SET = new Set<string>(ORDER_ACTORS);
const ADMIN_ACTORS = new Set<OrderActor>(["david", "alba"]);
const SYSTEM_AND_ADMIN_ACTORS = new Set<OrderActor>([
  "system",
  "david",
  "alba",
]);

const paymentRules: Record<PaymentStatus, readonly Rule<PaymentStatus>[]> = {
  draft: [
    { to: "awaiting_payment", actors: new Set<OrderActor>(["system"]) },
  ],
  awaiting_payment: [
    { to: "payment_reported", actors: new Set<OrderActor>(["buyer"]) },
    { to: "paid", actors: ADMIN_ACTORS },
    { to: "needs_review", actors: SYSTEM_AND_ADMIN_ACTORS },
    { to: "expired", actors: SYSTEM_AND_ADMIN_ACTORS },
    {
      to: "cancelled",
      actors: new Set<OrderActor>(["buyer", "david", "alba"]),
    },
  ],
  payment_reported: [
    { to: "paid", actors: ADMIN_ACTORS },
    { to: "needs_review", actors: SYSTEM_AND_ADMIN_ACTORS },
    { to: "expired", actors: SYSTEM_AND_ADMIN_ACTORS },
    { to: "cancelled", actors: ADMIN_ACTORS },
  ],
  needs_review: [
    { to: "awaiting_payment", actors: ADMIN_ACTORS },
    { to: "paid", actors: ADMIN_ACTORS },
    { to: "cancelled", actors: ADMIN_ACTORS },
  ],
  paid: [{ to: "refund_pending", actors: ADMIN_ACTORS }],
  refund_pending: [
    { to: "paid", actors: ADMIN_ACTORS },
    { to: "refunded", actors: ADMIN_ACTORS },
  ],
  expired: [{ to: "needs_review", actors: ADMIN_ACTORS }],
  cancelled: [{ to: "needs_review", actors: ADMIN_ACTORS }],
  refunded: [],
};

const accessRules: Record<AccessStatus, readonly Rule<AccessStatus>[]> = {
  pending: [
    { to: "provisioned", actors: SYSTEM_AND_ADMIN_ACTORS },
    { to: "failed", actors: SYSTEM_AND_ADMIN_ACTORS },
    { to: "revoked", actors: SYSTEM_AND_ADMIN_ACTORS },
  ],
  provisioned: [{ to: "revoked", actors: SYSTEM_AND_ADMIN_ACTORS }],
  failed: [{ to: "pending", actors: SYSTEM_AND_ADMIN_ACTORS }],
  revoked: [],
};

function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === "string" && PAYMENT_STATUS_SET.has(value);
}

function isAccessStatus(value: unknown): value is AccessStatus {
  return typeof value === "string" && ACCESS_STATUS_SET.has(value);
}

function isOrderActor(value: unknown): value is OrderActor {
  return typeof value === "string" && ORDER_ACTOR_SET.has(value);
}

function assertPaymentStatus(value: unknown): asserts value is PaymentStatus {
  if (!isPaymentStatus(value)) {
    throw new TypeError("Estado de pago no válido.");
  }
}

function assertAccessStatus(value: unknown): asserts value is AccessStatus {
  if (!isAccessStatus(value)) {
    throw new TypeError("Estado de acceso no válido.");
  }
}

function assertOrderActor(value: unknown): asserts value is OrderActor {
  if (!isOrderActor(value)) {
    throw new TypeError("Actor de pedido no válido.");
  }
}

export function canTransitionPayment(
  from: unknown,
  to: unknown,
  actor: unknown,
): boolean {
  if (
    !isPaymentStatus(from) ||
    !isPaymentStatus(to) ||
    !isOrderActor(actor) ||
    from === to
  ) {
    return false;
  }

  return paymentRules[from].some(
    (rule) => rule.to === to && rule.actors.has(actor),
  );
}

export function transitionPayment(
  from: unknown,
  to: unknown,
  actor: unknown,
): PaymentStatus {
  assertPaymentStatus(from);
  assertPaymentStatus(to);
  assertOrderActor(actor);

  if (!canTransitionPayment(from, to, actor)) {
    throw new Error(
      `Transición de pago no permitida: ${from} -> ${to} por ${actor}.`,
    );
  }

  return to;
}

export function canTransitionAccess(
  from: unknown,
  to: unknown,
  actor: unknown,
): boolean {
  if (
    !isAccessStatus(from) ||
    !isAccessStatus(to) ||
    !isOrderActor(actor) ||
    from === to
  ) {
    return false;
  }

  return accessRules[from].some(
    (rule) => rule.to === to && rule.actors.has(actor),
  );
}

export function transitionAccess(
  from: unknown,
  to: unknown,
  actor: unknown,
): AccessStatus {
  assertAccessStatus(from);
  assertAccessStatus(to);
  assertOrderActor(actor);

  if (!canTransitionAccess(from, to, actor)) {
    throw new Error(
      `Transición de acceso no permitida: ${from} -> ${to} por ${actor}.`,
    );
  }

  return to;
}
