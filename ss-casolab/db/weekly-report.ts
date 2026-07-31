import type { D1DatabaseLike } from "./orders.ts";
import type {
  UtcWeekPeriod,
  WeeklyReportSource,
} from "../lib/weekly-report.ts";

export type WeeklyReportStore = {
  readWeek(period: UtcWeekPeriod): Promise<WeeklyReportSource>;
};

type FunnelRow = {
  landing_sessions: number;
  diagnostic_starts: number;
  diagnostic_completes: number;
  offer_views: number;
  order_form_starts: number;
  bizum_instructions_viewed: number;
  whatsapp_clicks: number;
};

type ContactRow = { captured: number };

type CommerceRow = {
  orders_created: number;
  ordered_amount_cents: number;
  payment_reports: number;
  payments_verified: number;
  gross_revenue_cents: number;
  payments_needs_review: number;
  payments_rejected: number;
  expired_transitions: number;
  average_verification_seconds: number | null;
};

type DeliveryRow = {
  accesses_provisioned: number;
  accesses_failed: number;
  average_access_seconds: number | null;
  refunds_completed: number;
  refunded_amount_cents: number;
};

type ReconciliationRow = {
  paid_without_active_access: number;
  payment_reported: number;
  needs_review: number;
  active_access_outside_allowed_order: number;
  completed_refund_with_active_access: number;
};

function count(value: number | null | undefined): number {
  return Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
}

function nullableSeconds(value: number | null | undefined): number | null {
  return Number.isFinite(value) ? Math.max(0, Math.round(Number(value))) : null;
}

export function createD1WeeklyReportStore(
  d1: D1DatabaseLike,
): WeeklyReportStore {
  return {
    async readWeek(period) {
      const bounds = [period.startAt, period.endAt] as const;
      const [funnel, contacts, commerce, delivery, reconciliation] =
        await Promise.all([
          d1
            .prepare(
              `SELECT
                 COUNT(DISTINCT CASE WHEN event_type = 'landing_view' THEN session_id END) AS landing_sessions,
                 COUNT(DISTINCT CASE WHEN event_type = 'diagnostic_start' THEN session_id END) AS diagnostic_starts,
                 COUNT(DISTINCT CASE WHEN event_type = 'diagnostic_complete' THEN session_id END) AS diagnostic_completes,
                 COUNT(CASE WHEN event_type = 'offer_view' THEN 1 END) AS offer_views,
                 COUNT(CASE WHEN event_type = 'order_form_start' THEN 1 END) AS order_form_starts,
                 COUNT(CASE WHEN event_type = 'bizum_instructions_viewed' THEN 1 END) AS bizum_instructions_viewed,
                 COUNT(CASE WHEN event_type = 'whatsapp_click' THEN 1 END) AS whatsapp_clicks
               FROM funnel_events
               WHERE experiment = 'ss-casolab'
                 AND datetime(created_at) >= datetime(?)
                 AND datetime(created_at) < datetime(?)`,
            )
            .bind(...bounds)
            .first<FunnelRow>(),
          d1
            .prepare(
              `SELECT COUNT(*) AS captured
               FROM leads
               WHERE experiment = 'ss-casolab'
                 AND capture_contract = 'ss-whatsapp-v1'
                 AND datetime(created_at) >= datetime(?)
                 AND datetime(created_at) < datetime(?)`,
            )
            .bind(...bounds)
            .first<ContactRow>(),
          d1
            .prepare(
              `SELECT
                 (SELECT COUNT(*) FROM orders
                   WHERE datetime(created_at) >= datetime(?) AND datetime(created_at) < datetime(?)) AS orders_created,
                 (SELECT COALESCE(SUM(amount_cents), 0) FROM orders
                   WHERE datetime(created_at) >= datetime(?) AND datetime(created_at) < datetime(?)) AS ordered_amount_cents,
                 (SELECT COUNT(*) FROM payment_reports
                   WHERE datetime(created_at) >= datetime(?) AND datetime(created_at) < datetime(?)) AS payment_reports,
                 (SELECT COUNT(*) FROM payment_verifications
                   WHERE result = 'matched' AND datetime(verified_at) >= datetime(?) AND datetime(verified_at) < datetime(?)) AS payments_verified,
                 (SELECT COALESCE(SUM(observed_amount_cents), 0) FROM payment_verifications
                   WHERE result = 'matched' AND datetime(verified_at) >= datetime(?) AND datetime(verified_at) < datetime(?)) AS gross_revenue_cents,
                 (SELECT COUNT(*) FROM payment_verifications
                   WHERE result = 'needs_review' AND datetime(verified_at) >= datetime(?) AND datetime(verified_at) < datetime(?)) AS payments_needs_review,
                 (SELECT COUNT(*) FROM payment_verifications
                   WHERE result = 'rejected' AND datetime(verified_at) >= datetime(?) AND datetime(verified_at) < datetime(?)) AS payments_rejected,
                 (SELECT COUNT(*) FROM order_events
                   WHERE next_status = 'expired' AND datetime(created_at) >= datetime(?) AND datetime(created_at) < datetime(?)) AS expired_transitions,
                 (SELECT ROUND(AVG((julianday(v.verified_at) - julianday(o.created_at)) * 86400))
                    FROM payment_verifications v JOIN orders o ON o.id = v.order_id
                   WHERE v.result = 'matched' AND datetime(v.verified_at) >= datetime(?) AND datetime(v.verified_at) < datetime(?)) AS average_verification_seconds`,
            )
            .bind(
              ...bounds,
              ...bounds,
              ...bounds,
              ...bounds,
              ...bounds,
              ...bounds,
              ...bounds,
              ...bounds,
              ...bounds,
            )
            .first<CommerceRow>(),
          d1
            .prepare(
              `SELECT
                 (SELECT COUNT(*) FROM access_events
                   WHERE next_status = 'provisioned' AND datetime(created_at) >= datetime(?) AND datetime(created_at) < datetime(?)) AS accesses_provisioned,
                 (SELECT COUNT(*) FROM access_events
                   WHERE next_status = 'failed' AND datetime(created_at) >= datetime(?) AND datetime(created_at) < datetime(?)) AS accesses_failed,
                 (SELECT ROUND(AVG((julianday(a.provisioned_at) - julianday(v.verified_at)) * 86400))
                    FROM access_grants a
                    JOIN payment_verifications v ON v.order_id = a.order_id AND v.result = 'matched'
                   WHERE a.status IN ('provisioned','revoked')
                     AND a.provisioned_at IS NOT NULL
                     AND datetime(a.provisioned_at) >= datetime(?) AND datetime(a.provisioned_at) < datetime(?)) AS average_access_seconds,
                 (SELECT COUNT(*) FROM refunds
                   WHERE status = 'completed' AND datetime(verified_at) >= datetime(?) AND datetime(verified_at) < datetime(?)) AS refunds_completed,
                 (SELECT COALESCE(SUM(amount_cents), 0) FROM refunds
                   WHERE status = 'completed' AND datetime(verified_at) >= datetime(?) AND datetime(verified_at) < datetime(?)) AS refunded_amount_cents`,
            )
            .bind(...bounds, ...bounds, ...bounds, ...bounds, ...bounds)
            .first<DeliveryRow>(),
          d1
            .prepare(
              `SELECT
                 (SELECT COUNT(*) FROM orders o
                   WHERE o.status = 'paid' AND NOT EXISTS (
                     SELECT 1 FROM access_grants a
                     WHERE a.order_id = o.id AND a.status IN ('pending','provisioned')
                   )) AS paid_without_active_access,
                 (SELECT COUNT(*) FROM orders WHERE status = 'payment_reported') AS payment_reported,
                 (SELECT COUNT(*) FROM orders WHERE status = 'needs_review') AS needs_review,
                 (SELECT COUNT(*) FROM access_grants a JOIN orders o ON o.id = a.order_id
                   WHERE a.status IN ('pending','provisioned') AND o.status NOT IN ('paid','refund_pending')) AS active_access_outside_allowed_order,
                 (SELECT COUNT(*) FROM refunds r JOIN access_grants a ON a.order_id = r.order_id
                   WHERE r.status = 'completed' AND a.status IN ('pending','provisioned')) AS completed_refund_with_active_access`,
            )
            .first<ReconciliationRow>(),
        ]);

      return {
        funnel: {
          landingSessions: count(funnel?.landing_sessions),
          diagnosticStarts: count(funnel?.diagnostic_starts),
          diagnosticCompletes: count(funnel?.diagnostic_completes),
          offerViews: count(funnel?.offer_views),
          orderFormStarts: count(funnel?.order_form_starts),
          bizumInstructionsViewed: count(
            funnel?.bizum_instructions_viewed,
          ),
          whatsappClicks: count(funnel?.whatsapp_clicks),
        },
        contacts: { captured: count(contacts?.captured) },
        commerce: {
          ordersCreated: count(commerce?.orders_created),
          orderedAmountCents: count(commerce?.ordered_amount_cents),
          paymentReports: count(commerce?.payment_reports),
          paymentsVerified: count(commerce?.payments_verified),
          grossRevenueCents: count(commerce?.gross_revenue_cents),
          paymentsNeedsReview: count(commerce?.payments_needs_review),
          paymentsRejected: count(commerce?.payments_rejected),
          expiredTransitions: count(commerce?.expired_transitions),
          averageVerificationSeconds: nullableSeconds(
            commerce?.average_verification_seconds,
          ),
        },
        delivery: {
          accessesProvisioned: count(delivery?.accesses_provisioned),
          accessesFailed: count(delivery?.accesses_failed),
          averageAccessSeconds: nullableSeconds(
            delivery?.average_access_seconds,
          ),
        },
        refunds: {
          completed: count(delivery?.refunds_completed),
          amountCents: count(delivery?.refunded_amount_cents),
        },
        currentReconciliation: {
          paidWithoutActiveAccess: count(
            reconciliation?.paid_without_active_access,
          ),
          paymentReported: count(reconciliation?.payment_reported),
          needsReview: count(reconciliation?.needs_review),
          activeAccessOutsideAllowedOrder: count(
            reconciliation?.active_access_outside_allowed_order,
          ),
          completedRefundWithActiveAccess: count(
            reconciliation?.completed_refund_with_active_access,
          ),
        },
      };
    },
  };
}
