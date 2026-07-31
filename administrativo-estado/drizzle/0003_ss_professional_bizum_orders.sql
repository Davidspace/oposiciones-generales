-- Manual SQL migration. Cross-table invariants and append-only triggers in this
-- file are authoritative; see drizzle/README.md before applying or regenerating.
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`lookup_token_hash` text NOT NULL,
	`create_idempotency_key` text NOT NULL,
	`product_id` text NOT NULL,
	`offer_version` text NOT NULL,
	`amount_cents` integer NOT NULL CONSTRAINT `orders_amount_positive_check` CHECK (`amount_cents` > 0),
	`currency` text DEFAULT 'EUR' NOT NULL CONSTRAINT `orders_currency_eur_check` CHECK (`currency` = 'EUR'),
	`name` text NOT NULL,
	`email` text NOT NULL,
	`whatsapp_suffix` text,
	`session_id` text,
	`status` text NOT NULL CONSTRAINT `orders_status_check` CHECK (`status` IN ('draft','awaiting_payment','payment_reported','needs_review','paid','refund_pending','expired','cancelled','refunded')),
	`terms_version` text NOT NULL,
	`terms_accepted_at` text NOT NULL,
	`privacy_notice_version` text NOT NULL,
	`privacy_notice_provided_at` text NOT NULL,
	`digital_start_consent_at` text,
	`withdrawal_acknowledged_at` text,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `orders_dates_check` CHECK (
		datetime(`created_at`) IS NOT NULL
		AND datetime(`updated_at`) IS NOT NULL
		AND datetime(`expires_at`) IS NOT NULL
		AND datetime(`updated_at`) >= datetime(`created_at`)
		AND datetime(`expires_at`) > datetime(`created_at`)
	),
	CONSTRAINT `orders_acceptance_dates_check` CHECK (
		datetime(`terms_accepted_at`) IS NOT NULL
		AND datetime(`privacy_notice_provided_at`) IS NOT NULL
	)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_reference_unique` ON `orders` (`reference`);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_lookup_token_hash_unique` ON `orders` (`lookup_token_hash`);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_create_idempotency_unique` ON `orders` (`create_idempotency_key`);
--> statement-breakpoint
CREATE INDEX `orders_status_expires_idx` ON `orders` (`status`,`expires_at`);
--> statement-breakpoint
CREATE TABLE `payment_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`channel` text DEFAULT 'whatsapp' NOT NULL CONSTRAINT `payment_reports_channel_check` CHECK (`channel` IN ('whatsapp','web')),
	`whatsapp_suffix` text,
	`idempotency_key` text NOT NULL,
	`request_fingerprint` text NOT NULL,
	`created_at` text NOT NULL CONSTRAINT `payment_reports_created_at_check` CHECK (datetime(`created_at`) IS NOT NULL),
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_reports_idempotency_unique` ON `payment_reports` (`idempotency_key`);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_reports_fingerprint_unique` ON `payment_reports` (`request_fingerprint`);
--> statement-breakpoint
CREATE INDEX `payment_reports_order_created_idx` ON `payment_reports` (`order_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `payment_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`provider_reference_hmac` text,
	`provider_reference_hmac_version` text,
	`observed_amount_cents` integer NOT NULL CONSTRAINT `payment_verifications_amount_positive_check` CHECK (`observed_amount_cents` > 0),
	`observed_at` text NOT NULL,
	`result` text NOT NULL CONSTRAINT `payment_verifications_result_check` CHECK (`result` IN ('matched','needs_review','rejected')),
	`reason_code` text,
	`verified_by` text NOT NULL CONSTRAINT `payment_verifications_verified_by_check` CHECK (`verified_by` IN ('david','alba')),
	`verified_at` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`request_fingerprint` text NOT NULL,
	CONSTRAINT `payment_verifications_dates_check` CHECK (
		datetime(`observed_at`) IS NOT NULL
		AND datetime(`verified_at`) IS NOT NULL
	),
	CONSTRAINT `payment_verifications_hmac_pair_check` CHECK (
		(`provider_reference_hmac` IS NULL AND `provider_reference_hmac_version` IS NULL)
		OR (`provider_reference_hmac` IS NOT NULL AND `provider_reference_hmac_version` IS NOT NULL)
	),
	CONSTRAINT `payment_verifications_matched_hmac_check` CHECK (
		`result` <> 'matched' OR `provider_reference_hmac` IS NOT NULL
	),
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_verifications_idempotency_unique` ON `payment_verifications` (`idempotency_key`);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_verifications_fingerprint_unique` ON `payment_verifications` (`request_fingerprint`);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_verifications_matched_reference_unique`
	ON `payment_verifications` (`provider_reference_hmac`)
	WHERE `result` = 'matched' AND `provider_reference_hmac` IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_verifications_matched_order_unique`
	ON `payment_verifications` (`order_id`)
	WHERE `result` = 'matched';
--> statement-breakpoint
CREATE INDEX `payment_verifications_order_verified_idx` ON `payment_verifications` (`order_id`,`verified_at`);
--> statement-breakpoint
CREATE TABLE `access_grants` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`moodle_user_id` text,
	`course_id` text NOT NULL,
	`status` text NOT NULL CONSTRAINT `access_grants_status_check` CHECK (`status` IN ('pending','provisioned','failed','revoked')),
	`provisioned_at` text,
	`revoked_at` text,
	`provisioned_by` text,
	`revoked_by` text,
	`reason_code` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `access_grants_dates_check` CHECK (
		datetime(`created_at`) IS NOT NULL
		AND datetime(`updated_at`) IS NOT NULL
		AND datetime(`updated_at`) >= datetime(`created_at`)
		AND (`provisioned_at` IS NULL OR datetime(`provisioned_at`) IS NOT NULL)
		AND (`revoked_at` IS NULL OR datetime(`revoked_at`) IS NOT NULL)
	),
	CONSTRAINT `access_grants_actors_check` CHECK (
		(`provisioned_by` IS NULL OR `provisioned_by` IN ('system','david','alba'))
		AND (`revoked_by` IS NULL OR `revoked_by` IN ('system','david','alba'))
	),
	CONSTRAINT `access_grants_provisioned_at_check` CHECK (
		`status` <> 'provisioned' OR datetime(`provisioned_at`) IS NOT NULL
	),
	CONSTRAINT `access_grants_revoked_at_check` CHECK (
		`status` <> 'revoked' OR datetime(`revoked_at`) IS NOT NULL
	),
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_grants_active_order_unique`
	ON `access_grants` (`order_id`)
	WHERE `status` IN ('pending','provisioned');
--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`amount_cents` integer NOT NULL CONSTRAINT `refunds_amount_positive_check` CHECK (`amount_cents` > 0),
	`currency` text DEFAULT 'EUR' NOT NULL CONSTRAINT `refunds_currency_eur_check` CHECK (`currency` = 'EUR'),
	`status` text NOT NULL CONSTRAINT `refunds_status_check` CHECK (`status` IN ('pending','completed','failed')),
	`provider_reference_hmac` text,
	`provider_reference_hmac_version` text,
	`reason_code` text,
	`requested_by` text NOT NULL CONSTRAINT `refunds_requested_by_check` CHECK (`requested_by` IN ('david','alba')),
	`requested_at` text NOT NULL,
	`verified_by` text CONSTRAINT `refunds_verified_by_check` CHECK (`verified_by` IS NULL OR `verified_by` IN ('david','alba')),
	`verified_at` text,
	`idempotency_key` text NOT NULL,
	`request_fingerprint` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `refunds_dates_check` CHECK (
		datetime(`requested_at`) IS NOT NULL
		AND datetime(`created_at`) IS NOT NULL
		AND datetime(`updated_at`) IS NOT NULL
		AND datetime(`updated_at`) >= datetime(`created_at`)
		AND (`verified_at` IS NULL OR datetime(`verified_at`) IS NOT NULL)
	),
	CONSTRAINT `refunds_hmac_pair_check` CHECK (
		(`provider_reference_hmac` IS NULL AND `provider_reference_hmac_version` IS NULL)
		OR (`provider_reference_hmac` IS NOT NULL AND `provider_reference_hmac_version` IS NOT NULL)
	),
	CONSTRAINT `refunds_completed_verification_check` CHECK (
		`status` <> 'completed'
		OR (`verified_by` IS NOT NULL AND datetime(`verified_at`) IS NOT NULL)
	),
	CONSTRAINT `refunds_completed_hmac_check` CHECK (
		`status` <> 'completed' OR `provider_reference_hmac` IS NOT NULL
	),
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refunds_idempotency_unique` ON `refunds` (`idempotency_key`);
--> statement-breakpoint
CREATE UNIQUE INDEX `refunds_fingerprint_unique` ON `refunds` (`request_fingerprint`);
--> statement-breakpoint
CREATE UNIQUE INDEX `refunds_completed_order_unique`
	ON `refunds` (`order_id`)
	WHERE `status` = 'completed';
--> statement-breakpoint
CREATE INDEX `refunds_order_created_idx` ON `refunds` (`order_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `order_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`order_id` text NOT NULL,
	`previous_status` text CONSTRAINT `order_events_previous_status_check` CHECK (`previous_status` IS NULL OR `previous_status` IN ('draft','awaiting_payment','payment_reported','needs_review','paid','refund_pending','expired','cancelled','refunded')),
	`next_status` text NOT NULL CONSTRAINT `order_events_next_status_check` CHECK (`next_status` IN ('draft','awaiting_payment','payment_reported','needs_review','paid','refund_pending','expired','cancelled','refunded')),
	`actor_type` text NOT NULL CONSTRAINT `order_events_actor_type_check` CHECK (`actor_type` IN ('buyer','system','david','alba')),
	`actor_id` text,
	`reason_code` text,
	`idempotency_key` text NOT NULL,
	`metadata_json` text,
	`created_at` text NOT NULL CONSTRAINT `order_events_created_at_check` CHECK (datetime(`created_at`) IS NOT NULL),
	CONSTRAINT `order_events_distinct_status_check` CHECK (`previous_status` IS NULL OR `previous_status` <> `next_status`),
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `order_events_event_id_unique` ON `order_events` (`event_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `order_events_idempotency_unique` ON `order_events` (`idempotency_key`);
--> statement-breakpoint
CREATE INDEX `order_events_order_created_idx` ON `order_events` (`order_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `access_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`access_grant_id` text NOT NULL,
	`previous_status` text CONSTRAINT `access_events_previous_status_check` CHECK (`previous_status` IS NULL OR `previous_status` IN ('pending','provisioned','failed','revoked')),
	`next_status` text NOT NULL CONSTRAINT `access_events_next_status_check` CHECK (`next_status` IN ('pending','provisioned','failed','revoked')),
	`actor_type` text NOT NULL CONSTRAINT `access_events_actor_type_check` CHECK (`actor_type` IN ('system','david','alba')),
	`actor_id` text,
	`reason_code` text,
	`idempotency_key` text NOT NULL,
	`metadata_json` text,
	`created_at` text NOT NULL CONSTRAINT `access_events_created_at_check` CHECK (datetime(`created_at`) IS NOT NULL),
	CONSTRAINT `access_events_distinct_status_check` CHECK (`previous_status` IS NULL OR `previous_status` <> `next_status`),
	FOREIGN KEY (`access_grant_id`) REFERENCES `access_grants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_events_event_id_unique` ON `access_events` (`event_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_events_idempotency_unique` ON `access_events` (`idempotency_key`);
--> statement-breakpoint
CREATE INDEX `access_events_access_grant_created_idx` ON `access_events` (`access_grant_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `refund_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`refund_id` text NOT NULL,
	`previous_status` text CONSTRAINT `refund_events_previous_status_check` CHECK (`previous_status` IS NULL OR `previous_status` IN ('pending','completed','failed')),
	`next_status` text NOT NULL CONSTRAINT `refund_events_next_status_check` CHECK (`next_status` IN ('pending','completed','failed')),
	`actor_type` text NOT NULL CONSTRAINT `refund_events_actor_type_check` CHECK (`actor_type` IN ('system','david','alba')),
	`actor_id` text,
	`reason_code` text,
	`idempotency_key` text NOT NULL,
	`metadata_json` text,
	`created_at` text NOT NULL CONSTRAINT `refund_events_created_at_check` CHECK (datetime(`created_at`) IS NOT NULL),
	CONSTRAINT `refund_events_distinct_status_check` CHECK (`previous_status` IS NULL OR `previous_status` <> `next_status`),
	FOREIGN KEY (`refund_id`) REFERENCES `refunds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refund_events_event_id_unique` ON `refund_events` (`event_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `refund_events_idempotency_unique` ON `refund_events` (`idempotency_key`);
--> statement-breakpoint
CREATE INDEX `refund_events_refund_created_idx` ON `refund_events` (`refund_id`,`created_at`);
--> statement-breakpoint
CREATE TRIGGER `access_grants_require_paid_order_insert`
BEFORE INSERT ON `access_grants`
WHEN NEW.`status` IN ('pending','provisioned')
	AND NOT EXISTS (
		SELECT 1 FROM `orders`
		WHERE `id` = NEW.`order_id` AND `status` = 'paid'
	)
BEGIN
	SELECT RAISE(ABORT, 'pending or provisioned access requires paid order');
END;
--> statement-breakpoint
CREATE TRIGGER `access_grants_require_paid_order_update`
BEFORE UPDATE OF `status`,`order_id` ON `access_grants`
WHEN NEW.`status` IN ('pending','provisioned')
	AND NOT EXISTS (
		SELECT 1 FROM `orders`
		WHERE `id` = NEW.`order_id` AND `status` = 'paid'
	)
BEGIN
	SELECT RAISE(ABORT, 'pending or provisioned access requires paid order');
END;
--> statement-breakpoint
CREATE TRIGGER `access_grants_block_after_completed_refund_insert`
BEFORE INSERT ON `access_grants`
WHEN NEW.`status` IN ('pending','provisioned')
	AND EXISTS (
		SELECT 1 FROM `refunds`
		WHERE `order_id` = NEW.`order_id` AND `status` = 'completed'
	)
BEGIN
	SELECT RAISE(ABORT, 'active access forbidden after completed refund');
END;
--> statement-breakpoint
CREATE TRIGGER `access_grants_block_after_completed_refund_update`
BEFORE UPDATE OF `status`,`order_id` ON `access_grants`
WHEN NEW.`status` IN ('pending','provisioned')
	AND EXISTS (
		SELECT 1 FROM `refunds`
		WHERE `order_id` = NEW.`order_id` AND `status` = 'completed'
	)
BEGIN
	SELECT RAISE(ABORT, 'active access forbidden after completed refund');
END;
--> statement-breakpoint
CREATE TRIGGER `orders_block_active_access_outside_paid_or_refund_pending`
BEFORE UPDATE OF `status` ON `orders`
WHEN NEW.`status` NOT IN ('paid','refund_pending')
	AND EXISTS (
		SELECT 1 FROM `access_grants`
		WHERE `order_id` = NEW.`id` AND `status` IN ('pending','provisioned')
	)
BEGIN
	SELECT RAISE(ABORT, 'order has active access');
END;
--> statement-breakpoint
CREATE TRIGGER `refunds_completed_require_no_active_access_insert`
BEFORE INSERT ON `refunds`
WHEN NEW.`status` = 'completed'
	AND EXISTS (
		SELECT 1 FROM `access_grants`
		WHERE `order_id` = NEW.`order_id` AND `status` IN ('pending','provisioned')
	)
BEGIN
	SELECT RAISE(ABORT, 'completed refund requires no active access');
END;
--> statement-breakpoint
CREATE TRIGGER `refunds_completed_require_no_active_access_update`
BEFORE UPDATE OF `status`,`order_id` ON `refunds`
WHEN NEW.`status` = 'completed'
	AND EXISTS (
		SELECT 1 FROM `access_grants`
		WHERE `order_id` = NEW.`order_id` AND `status` IN ('pending','provisioned')
	)
BEGIN
	SELECT RAISE(ABORT, 'completed refund requires no active access');
END;
--> statement-breakpoint
CREATE TRIGGER `orders_refunded_requires_completed_refund_insert`
BEFORE INSERT ON `orders`
WHEN NEW.`status` = 'refunded'
	AND NOT EXISTS (
		SELECT 1 FROM `refunds`
		WHERE `order_id` = NEW.`id` AND `status` = 'completed'
	)
BEGIN
	SELECT RAISE(ABORT, 'refunded order requires completed refund');
END;
--> statement-breakpoint
CREATE TRIGGER `orders_refunded_requires_completed_refund_update`
BEFORE UPDATE OF `status` ON `orders`
WHEN NEW.`status` = 'refunded'
	AND NOT EXISTS (
		SELECT 1 FROM `refunds`
		WHERE `order_id` = NEW.`id` AND `status` = 'completed'
	)
BEGIN
	SELECT RAISE(ABORT, 'refunded order requires completed refund');
END;
--> statement-breakpoint
CREATE TRIGGER `refunds_preserve_refunded_order_update`
BEFORE UPDATE OF `status`,`order_id` ON `refunds`
WHEN OLD.`status` = 'completed'
	AND EXISTS (
		SELECT 1 FROM `orders`
		WHERE `id` = OLD.`order_id` AND `status` = 'refunded'
	)
	AND (NEW.`status` <> 'completed' OR NEW.`order_id` <> OLD.`order_id`)
BEGIN
	SELECT RAISE(ABORT, 'refunded order requires completed refund');
END;
--> statement-breakpoint
CREATE TRIGGER `refunds_preserve_refunded_order_delete`
BEFORE DELETE ON `refunds`
WHEN OLD.`status` = 'completed'
	AND EXISTS (
		SELECT 1 FROM `orders`
		WHERE `id` = OLD.`order_id` AND `status` = 'refunded'
	)
BEGIN
	SELECT RAISE(ABORT, 'refunded order requires completed refund');
END;
--> statement-breakpoint
CREATE TRIGGER `order_events_append_only_update`
BEFORE UPDATE ON `order_events`
BEGIN
	SELECT RAISE(ABORT, 'order_events is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `order_events_append_only_delete`
BEFORE DELETE ON `order_events`
BEGIN
	SELECT RAISE(ABORT, 'order_events is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `access_events_append_only_update`
BEFORE UPDATE ON `access_events`
BEGIN
	SELECT RAISE(ABORT, 'access_events is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `access_events_append_only_delete`
BEFORE DELETE ON `access_events`
BEGIN
	SELECT RAISE(ABORT, 'access_events is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `refund_events_append_only_update`
BEFORE UPDATE ON `refund_events`
BEGIN
	SELECT RAISE(ABORT, 'refund_events is append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `refund_events_append_only_delete`
BEFORE DELETE ON `refund_events`
BEGIN
	SELECT RAISE(ABORT, 'refund_events is append-only');
END;
