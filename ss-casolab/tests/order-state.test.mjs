import assert from "node:assert/strict";
import test from "node:test";

import * as orderState from "../lib/order-state.ts";

function requireExport(name) {
  const value = orderState[name];
  assert.equal(typeof value, "function", `${name} must be exported`);
  return value;
}

test("payment and access expose separate state machines", () => {
  assert.deepEqual(orderState.PAYMENT_STATUSES, [
    "draft",
    "awaiting_payment",
    "payment_reported",
    "needs_review",
    "paid",
    "refund_pending",
    "expired",
    "cancelled",
    "refunded",
  ]);
  assert.deepEqual(orderState.ACCESS_STATUSES, [
    "pending",
    "provisioned",
    "failed",
    "revoked",
  ]);
  assert.equal("ORDER_STATUSES" in orderState, false);
  assert.equal("canTransitionOrder" in orderState, false);
  assert.equal("transitionOrder" in orderState, false);
});

test("an authorized operator can verify an unreported payment", () => {
  const canTransitionPayment = requireExport("canTransitionPayment");

  assert.equal(
    canTransitionPayment("awaiting_payment", "paid", "david"),
    true,
  );
  assert.equal(
    canTransitionPayment("awaiting_payment", "paid", "alba"),
    true,
  );
  assert.equal(
    canTransitionPayment("awaiting_payment", "paid", "buyer"),
    false,
  );
  assert.equal(
    canTransitionPayment("awaiting_payment", "paid", "system"),
    false,
  );
});

test("a buyer can report payment but cannot verify or cancel it afterwards", () => {
  const transitionPayment = requireExport("transitionPayment");

  assert.equal(
    transitionPayment("awaiting_payment", "payment_reported", "buyer"),
    "payment_reported",
  );
  assert.throws(
    () => transitionPayment("payment_reported", "paid", "buyer"),
    /no permitida/,
  );
  assert.throws(
    () => transitionPayment("payment_reported", "cancelled", "buyer"),
    /no permitida/,
  );
  assert.equal(
    transitionPayment("payment_reported", "cancelled", "david"),
    "cancelled",
  );
});

test("an operator can review a payment observed after expiry or cancellation", () => {
  const transitionPayment = requireExport("transitionPayment");

  for (const closedStatus of ["expired", "cancelled"]) {
    assert.equal(
      transitionPayment(closedStatus, "needs_review", "david"),
      "needs_review",
    );
    assert.equal(
      transitionPayment(closedStatus, "needs_review", "alba"),
      "needs_review",
    );
    assert.throws(
      () => transitionPayment(closedStatus, "needs_review", "buyer"),
      /no permitida/,
    );
    assert.throws(
      () => transitionPayment(closedStatus, "needs_review", "system"),
      /no permitida/,
    );
  }
});

test("a refund is pending until an operator records its completion", () => {
  const transitionPayment = requireExport("transitionPayment");

  assert.equal(
    transitionPayment("awaiting_payment", "needs_review", "system"),
    "needs_review",
  );
  assert.equal(
    transitionPayment("needs_review", "awaiting_payment", "david"),
    "awaiting_payment",
  );
  assert.equal(transitionPayment("needs_review", "paid", "alba"), "paid");
  assert.equal(
    transitionPayment("paid", "refund_pending", "david"),
    "refund_pending",
  );
  assert.equal(
    transitionPayment("refund_pending", "refunded", "alba"),
    "refunded",
  );
  assert.equal(
    transitionPayment("refund_pending", "paid", "david"),
    "paid",
  );
  assert.throws(
    () => transitionPayment("paid", "refunded", "buyer"),
    /no permitida/,
  );
  assert.throws(
    () => transitionPayment("paid", "refunded", "david"),
    /no permitida/,
  );
  assert.throws(
    () => transitionPayment("refunded", "revoked", "system"),
    /Estado de pago no válido/,
  );
});

test("same-state requests never authorize a payment or access command", () => {
  const canTransitionPayment = requireExport("canTransitionPayment");
  const transitionPayment = requireExport("transitionPayment");
  const canTransitionAccess = requireExport("canTransitionAccess");
  const transitionAccess = requireExport("transitionAccess");

  for (const status of orderState.PAYMENT_STATUSES) {
    for (const actor of orderState.ORDER_ACTORS) {
      assert.equal(canTransitionPayment(status, status, actor), false);
      assert.throws(
        () => transitionPayment(status, status, actor),
        /no permitida/,
      );
    }
  }

  for (const status of orderState.ACCESS_STATUSES) {
    for (const actor of orderState.ORDER_ACTORS) {
      assert.equal(canTransitionAccess(status, status, actor), false);
      assert.throws(
        () => transitionAccess(status, status, actor),
        /no permitida/,
      );
    }
  }
});

test("access transitions do not alter payment state", () => {
  const transitionAccess = requireExport("transitionAccess");

  assert.equal(transitionAccess("pending", "provisioned", "system"), "provisioned");
  assert.equal(transitionAccess("pending", "failed", "alba"), "failed");
  assert.equal(transitionAccess("pending", "revoked", "david"), "revoked");
  assert.equal(transitionAccess("failed", "pending", "david"), "pending");
  assert.equal(transitionAccess("provisioned", "revoked", "system"), "revoked");

  assert.throws(
    () => transitionAccess("pending", "provisioned", "buyer"),
    /no permitida/,
  );
  assert.throws(
    () => transitionAccess("pending", "refunded", "david"),
    /Estado de acceso no válido/,
  );
});

test("runtime guards reject states and actors received from invalid JSON", () => {
  const canTransitionPayment = requireExport("canTransitionPayment");
  const transitionPayment = requireExport("transitionPayment");
  const canTransitionAccess = requireExport("canTransitionAccess");
  const transitionAccess = requireExport("transitionAccess");

  for (const invalid of [null, undefined, "root_access", 1, {}, []]) {
    assert.equal(
      canTransitionPayment(invalid, "paid", "david"),
      false,
    );
    assert.equal(
      canTransitionPayment("awaiting_payment", invalid, "david"),
      false,
    );
    assert.equal(
      canTransitionAccess(invalid, "provisioned", "david"),
      false,
    );
    assert.equal(
      canTransitionAccess("pending", invalid, "david"),
      false,
    );
  }

  for (const invalidActor of [null, undefined, "admin", 1, {}, []]) {
    assert.equal(
      canTransitionPayment("awaiting_payment", "paid", invalidActor),
      false,
    );
    assert.equal(
      canTransitionAccess("pending", "provisioned", invalidActor),
      false,
    );
  }

  assert.throws(
    () => transitionPayment("access_pending", "paid", "david"),
    /Estado de pago no válido/,
  );
  assert.throws(
    () => transitionPayment("awaiting_payment", "paid", "admin"),
    /Actor de pedido no válido/,
  );
  assert.throws(
    () => transitionAccess("paid", "provisioned", "david"),
    /Estado de acceso no válido/,
  );
  assert.throws(
    () => transitionAccess("pending", "provisioned", "admin"),
    /Actor de pedido no válido/,
  );
});
