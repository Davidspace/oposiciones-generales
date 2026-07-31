import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    experiment: text("experiment").notNull(),
    offerVariant: text("offer_variant").notNull(),
    name: text("name").notNull(),
    email: text("email"),
    whatsapp: text("whatsapp"),
    contactKey: text("contact_key").notNull(),
    captureContract: text("capture_contract", {
      enum: ["legacy-v1", "gsi-email-v1", "ss-whatsapp-v1"],
    }).notNull(),
    modality: text("modality").notNull().default("undecided"),
    stage: text("stage").notNull(),
    challenge: text("challenge").notNull(),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    landingPath: text("landing_path"),
    referrer: text("referrer"),
    consentAt: text("consent_at").notNull(),
    whatsappConsentAt: text("whatsapp_consent_at"),
    privacyVersion: text("privacy_version"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("leads_contact_experiment_unique").on(
      table.contactKey,
      table.experiment,
    ),
    check(
      "leads_capture_contract_check",
      sql`${table.captureContract} IN ('legacy-v1','gsi-email-v1','ss-whatsapp-v1')`,
    ),
    check(
      "leads_contact_contract_check",
      sql`(
          ${table.captureContract} = 'legacy-v1'
          AND ${table.contactKey} = 'legacy:' || ${table.id}
          AND ${table.email} IS NOT NULL
        )
        OR (
          ${table.captureContract} = 'gsi-email-v1'
          AND ${table.experiment} = 'gsi-caso-0'
          AND ${table.email} IS NOT NULL
          AND length(trim(${table.email})) > 0
          AND ${table.contactKey} = 'email:' || lower(trim(${table.email}))
          AND ${table.whatsapp} IS NULL
          AND ${table.whatsappConsentAt} IS NULL
        )
        OR (
          ${table.captureContract} = 'ss-whatsapp-v1'
          AND ${table.experiment} = 'ss-casolab'
          AND ${table.whatsapp} IS NOT NULL
          AND length(${table.whatsapp}) BETWEEN 3 AND 16
          AND substr(${table.whatsapp}, 1, 1) = '+'
          AND substr(${table.whatsapp}, 2, 1) BETWEEN '1' AND '9'
          AND substr(${table.whatsapp}, 2) NOT GLOB '*[^0-9]*'
          AND ${table.contactKey} = 'whatsapp:' || ${table.whatsapp}
          AND datetime(${table.whatsappConsentAt}) IS NOT NULL
          AND ${table.privacyVersion} IS NOT NULL
          AND length(trim(${table.privacyVersion})) > 0
        )`,
    ),
    check(
      "leads_dates_check",
      sql`${table.captureContract} = 'legacy-v1'
        OR (
          datetime(${table.consentAt}) IS NOT NULL
          AND datetime(${table.createdAt}) IS NOT NULL
          AND datetime(${table.updatedAt}) IS NOT NULL
          AND datetime(${table.updatedAt}) >= datetime(${table.createdAt})
        )`,
    ),
  ],
);

export const funnelEvents = sqliteTable("funnel_events", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  experiment: text("experiment").notNull(),
  offerVariant: text("offer_variant").notNull().default("baseline"),
  eventType: text("event_type").notNull(),
  path: text("path"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at").notNull(),
});

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull(),
    lookupTokenHash: text("lookup_token_hash").notNull(),
    createIdempotencyKey: text("create_idempotency_key").notNull(),
    productId: text("product_id").notNull(),
    offerVersion: text("offer_version").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    whatsappSuffix: text("whatsapp_suffix"),
    sessionId: text("session_id"),
    status: text("status", {
      enum: [
        "draft",
        "awaiting_payment",
        "payment_reported",
        "needs_review",
        "paid",
        "refund_pending",
        "expired",
        "cancelled",
        "refunded",
      ],
    }).notNull(),
    termsVersion: text("terms_version").notNull(),
    termsAcceptedAt: text("terms_accepted_at").notNull(),
    privacyNoticeVersion: text("privacy_notice_version").notNull(),
    privacyNoticeProvidedAt: text("privacy_notice_provided_at").notNull(),
    digitalStartConsentAt: text("digital_start_consent_at"),
    withdrawalAcknowledgedAt: text("withdrawal_acknowledged_at"),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("orders_reference_unique").on(table.reference),
    uniqueIndex("orders_lookup_token_hash_unique").on(table.lookupTokenHash),
    uniqueIndex("orders_create_idempotency_unique").on(
      table.createIdempotencyKey,
    ),
    index("orders_status_expires_idx").on(table.status, table.expiresAt),
    check(
      "orders_status_check",
      sql`${table.status} IN ('draft','awaiting_payment','payment_reported','needs_review','paid','refund_pending','expired','cancelled','refunded')`,
    ),
    check("orders_amount_positive_check", sql`${table.amountCents} > 0`),
    check("orders_currency_eur_check", sql`${table.currency} = 'EUR'`),
    check(
      "orders_dates_check",
      sql`datetime(${table.createdAt}) IS NOT NULL
        AND datetime(${table.updatedAt}) IS NOT NULL
        AND datetime(${table.expiresAt}) IS NOT NULL
        AND datetime(${table.updatedAt}) >= datetime(${table.createdAt})
        AND datetime(${table.expiresAt}) > datetime(${table.createdAt})`,
    ),
    check(
      "orders_acceptance_dates_check",
      sql`datetime(${table.termsAcceptedAt}) IS NOT NULL
        AND datetime(${table.privacyNoticeProvidedAt}) IS NOT NULL`,
    ),
  ],
);

export const paymentReports = sqliteTable(
  "payment_reports",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    channel: text("channel").notNull().default("whatsapp"),
    whatsappSuffix: text("whatsapp_suffix"),
    idempotencyKey: text("idempotency_key").notNull(),
    requestFingerprint: text("request_fingerprint").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("payment_reports_idempotency_unique").on(table.idempotencyKey),
    uniqueIndex("payment_reports_fingerprint_unique").on(
      table.requestFingerprint,
    ),
    index("payment_reports_order_created_idx").on(
      table.orderId,
      table.createdAt,
    ),
    check(
      "payment_reports_channel_check",
      sql`${table.channel} IN ('whatsapp','web')`,
    ),
    check(
      "payment_reports_created_at_check",
      sql`datetime(${table.createdAt}) IS NOT NULL`,
    ),
  ],
);

export const paymentVerifications = sqliteTable(
  "payment_verifications",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    providerReferenceHmac: text("provider_reference_hmac"),
    providerReferenceHmacVersion: text("provider_reference_hmac_version"),
    observedAmountCents: integer("observed_amount_cents").notNull(),
    observedAt: text("observed_at").notNull(),
    result: text("result", {
      enum: ["matched", "needs_review", "rejected"],
    }).notNull(),
    reasonCode: text("reason_code"),
    verifiedBy: text("verified_by").notNull(),
    verifiedAt: text("verified_at").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    requestFingerprint: text("request_fingerprint").notNull(),
  },
  (table) => [
    uniqueIndex("payment_verifications_idempotency_unique").on(
      table.idempotencyKey,
    ),
    uniqueIndex("payment_verifications_fingerprint_unique").on(
      table.requestFingerprint,
    ),
    uniqueIndex("payment_verifications_matched_reference_unique")
      .on(table.providerReferenceHmac)
      .where(
        sql`${table.result} = 'matched' AND ${table.providerReferenceHmac} IS NOT NULL`,
      ),
    uniqueIndex("payment_verifications_matched_order_unique")
      .on(table.orderId)
      .where(sql`${table.result} = 'matched'`),
    index("payment_verifications_order_verified_idx").on(
      table.orderId,
      table.verifiedAt,
    ),
    check(
      "payment_verifications_amount_positive_check",
      sql`${table.observedAmountCents} > 0`,
    ),
    check(
      "payment_verifications_result_check",
      sql`${table.result} IN ('matched','needs_review','rejected')`,
    ),
    check(
      "payment_verifications_verified_by_check",
      sql`${table.verifiedBy} IN ('david','alba')`,
    ),
    check(
      "payment_verifications_dates_check",
      sql`datetime(${table.observedAt}) IS NOT NULL
        AND datetime(${table.verifiedAt}) IS NOT NULL`,
    ),
    check(
      "payment_verifications_hmac_pair_check",
      sql`(${table.providerReferenceHmac} IS NULL AND ${table.providerReferenceHmacVersion} IS NULL)
        OR (${table.providerReferenceHmac} IS NOT NULL AND ${table.providerReferenceHmacVersion} IS NOT NULL)`,
    ),
    check(
      "payment_verifications_matched_hmac_check",
      sql`${table.result} <> 'matched' OR ${table.providerReferenceHmac} IS NOT NULL`,
    ),
  ],
);

export const refunds = sqliteTable(
  "refunds",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("EUR"),
    status: text("status", {
      enum: ["pending", "completed", "failed"],
    }).notNull(),
    providerReferenceHmac: text("provider_reference_hmac"),
    providerReferenceHmacVersion: text("provider_reference_hmac_version"),
    reasonCode: text("reason_code"),
    requestedBy: text("requested_by", {
      enum: ["david", "alba"],
    }).notNull(),
    requestedAt: text("requested_at").notNull(),
    verifiedBy: text("verified_by", { enum: ["david", "alba"] }),
    verifiedAt: text("verified_at"),
    idempotencyKey: text("idempotency_key").notNull(),
    requestFingerprint: text("request_fingerprint").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("refunds_idempotency_unique").on(table.idempotencyKey),
    uniqueIndex("refunds_fingerprint_unique").on(table.requestFingerprint),
    uniqueIndex("refunds_completed_order_unique")
      .on(table.orderId)
      .where(sql`${table.status} = 'completed'`),
    index("refunds_order_created_idx").on(table.orderId, table.createdAt),
    check("refunds_amount_positive_check", sql`${table.amountCents} > 0`),
    check("refunds_currency_eur_check", sql`${table.currency} = 'EUR'`),
    check(
      "refunds_status_check",
      sql`${table.status} IN ('pending','completed','failed')`,
    ),
    check(
      "refunds_requested_by_check",
      sql`${table.requestedBy} IN ('david','alba')`,
    ),
    check(
      "refunds_verified_by_check",
      sql`${table.verifiedBy} IS NULL OR ${table.verifiedBy} IN ('david','alba')`,
    ),
    check(
      "refunds_dates_check",
      sql`datetime(${table.requestedAt}) IS NOT NULL
        AND datetime(${table.createdAt}) IS NOT NULL
        AND datetime(${table.updatedAt}) IS NOT NULL
        AND datetime(${table.updatedAt}) >= datetime(${table.createdAt})
        AND (${table.verifiedAt} IS NULL OR datetime(${table.verifiedAt}) IS NOT NULL)`,
    ),
    check(
      "refunds_hmac_pair_check",
      sql`(${table.providerReferenceHmac} IS NULL AND ${table.providerReferenceHmacVersion} IS NULL)
        OR (${table.providerReferenceHmac} IS NOT NULL AND ${table.providerReferenceHmacVersion} IS NOT NULL)`,
    ),
    check(
      "refunds_completed_verification_check",
      sql`${table.status} <> 'completed'
        OR (${table.verifiedBy} IS NOT NULL AND datetime(${table.verifiedAt}) IS NOT NULL)`,
    ),
    check(
      "refunds_completed_hmac_check",
      sql`${table.status} <> 'completed' OR ${table.providerReferenceHmac} IS NOT NULL`,
    ),
  ],
);

export const accessGrants = sqliteTable(
  "access_grants",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    moodleUserId: text("moodle_user_id"),
    courseId: text("course_id").notNull(),
    status: text("status", {
      enum: ["pending", "provisioned", "failed", "revoked"],
    }).notNull(),
    provisionedAt: text("provisioned_at"),
    revokedAt: text("revoked_at"),
    provisionedBy: text("provisioned_by"),
    revokedBy: text("revoked_by"),
    reasonCode: text("reason_code"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("access_grants_active_order_unique")
      .on(table.orderId)
      .where(sql`${table.status} IN ('pending','provisioned')`),
    check(
      "access_grants_status_check",
      sql`${table.status} IN ('pending','provisioned','failed','revoked')`,
    ),
    check(
      "access_grants_actors_check",
      sql`(${table.provisionedBy} IS NULL OR ${table.provisionedBy} IN ('system','david','alba'))
        AND (${table.revokedBy} IS NULL OR ${table.revokedBy} IN ('system','david','alba'))`,
    ),
    check(
      "access_grants_dates_check",
      sql`datetime(${table.createdAt}) IS NOT NULL
        AND datetime(${table.updatedAt}) IS NOT NULL
        AND datetime(${table.updatedAt}) >= datetime(${table.createdAt})
        AND (${table.provisionedAt} IS NULL OR datetime(${table.provisionedAt}) IS NOT NULL)
        AND (${table.revokedAt} IS NULL OR datetime(${table.revokedAt}) IS NOT NULL)`,
    ),
    check(
      "access_grants_provisioned_at_check",
      sql`${table.status} <> 'provisioned' OR datetime(${table.provisionedAt}) IS NOT NULL`,
    ),
    check(
      "access_grants_revoked_at_check",
      sql`${table.status} <> 'revoked' OR datetime(${table.revokedAt}) IS NOT NULL`,
    ),
  ],
);

export const orderEvents = sqliteTable(
  "order_events",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id").notNull(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    previousStatus: text("previous_status", {
      enum: [
        "draft",
        "awaiting_payment",
        "payment_reported",
        "needs_review",
        "paid",
        "refund_pending",
        "expired",
        "cancelled",
        "refunded",
      ],
    }),
    nextStatus: text("next_status", {
      enum: [
        "draft",
        "awaiting_payment",
        "payment_reported",
        "needs_review",
        "paid",
        "refund_pending",
        "expired",
        "cancelled",
        "refunded",
      ],
    }).notNull(),
    actorType: text("actor_type", {
      enum: ["buyer", "system", "david", "alba"],
    }).notNull(),
    actorId: text("actor_id"),
    reasonCode: text("reason_code"),
    idempotencyKey: text("idempotency_key").notNull(),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("order_events_event_id_unique").on(table.eventId),
    uniqueIndex("order_events_idempotency_unique").on(table.idempotencyKey),
    index("order_events_order_created_idx").on(table.orderId, table.createdAt),
    check(
      "order_events_previous_status_check",
      sql`${table.previousStatus} IS NULL
        OR ${table.previousStatus} IN ('draft','awaiting_payment','payment_reported','needs_review','paid','refund_pending','expired','cancelled','refunded')`,
    ),
    check(
      "order_events_next_status_check",
      sql`${table.nextStatus} IN ('draft','awaiting_payment','payment_reported','needs_review','paid','refund_pending','expired','cancelled','refunded')`,
    ),
    check(
      "order_events_actor_type_check",
      sql`${table.actorType} IN ('buyer','system','david','alba')`,
    ),
    check(
      "order_events_created_at_check",
      sql`datetime(${table.createdAt}) IS NOT NULL`,
    ),
    check(
      "order_events_distinct_status_check",
      sql`${table.previousStatus} IS NULL OR ${table.previousStatus} <> ${table.nextStatus}`,
    ),
  ],
);

export const accessEvents = sqliteTable(
  "access_events",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id").notNull(),
    accessGrantId: text("access_grant_id")
      .notNull()
      .references(() => accessGrants.id),
    previousStatus: text("previous_status", {
      enum: ["pending", "provisioned", "failed", "revoked"],
    }),
    nextStatus: text("next_status", {
      enum: ["pending", "provisioned", "failed", "revoked"],
    }).notNull(),
    actorType: text("actor_type", {
      enum: ["system", "david", "alba"],
    }).notNull(),
    actorId: text("actor_id"),
    reasonCode: text("reason_code"),
    idempotencyKey: text("idempotency_key").notNull(),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("access_events_event_id_unique").on(table.eventId),
    uniqueIndex("access_events_idempotency_unique").on(table.idempotencyKey),
    index("access_events_access_grant_created_idx").on(
      table.accessGrantId,
      table.createdAt,
    ),
    check(
      "access_events_previous_status_check",
      sql`${table.previousStatus} IS NULL
        OR ${table.previousStatus} IN ('pending','provisioned','failed','revoked')`,
    ),
    check(
      "access_events_next_status_check",
      sql`${table.nextStatus} IN ('pending','provisioned','failed','revoked')`,
    ),
    check(
      "access_events_actor_type_check",
      sql`${table.actorType} IN ('system','david','alba')`,
    ),
    check(
      "access_events_created_at_check",
      sql`datetime(${table.createdAt}) IS NOT NULL`,
    ),
    check(
      "access_events_distinct_status_check",
      sql`${table.previousStatus} IS NULL OR ${table.previousStatus} <> ${table.nextStatus}`,
    ),
  ],
);

export const refundEvents = sqliteTable(
  "refund_events",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id").notNull(),
    refundId: text("refund_id")
      .notNull()
      .references(() => refunds.id),
    previousStatus: text("previous_status", {
      enum: ["pending", "completed", "failed"],
    }),
    nextStatus: text("next_status", {
      enum: ["pending", "completed", "failed"],
    }).notNull(),
    actorType: text("actor_type", {
      enum: ["system", "david", "alba"],
    }).notNull(),
    actorId: text("actor_id"),
    reasonCode: text("reason_code"),
    idempotencyKey: text("idempotency_key").notNull(),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("refund_events_event_id_unique").on(table.eventId),
    uniqueIndex("refund_events_idempotency_unique").on(table.idempotencyKey),
    index("refund_events_refund_created_idx").on(
      table.refundId,
      table.createdAt,
    ),
    check(
      "refund_events_previous_status_check",
      sql`${table.previousStatus} IS NULL
        OR ${table.previousStatus} IN ('pending','completed','failed')`,
    ),
    check(
      "refund_events_next_status_check",
      sql`${table.nextStatus} IN ('pending','completed','failed')`,
    ),
    check(
      "refund_events_actor_type_check",
      sql`${table.actorType} IN ('system','david','alba')`,
    ),
    check(
      "refund_events_created_at_check",
      sql`datetime(${table.createdAt}) IS NOT NULL`,
    ),
    check(
      "refund_events_distinct_status_check",
      sql`${table.previousStatus} IS NULL OR ${table.previousStatus} <> ${table.nextStatus}`,
    ),
  ],
);
