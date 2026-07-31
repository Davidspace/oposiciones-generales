CREATE TABLE `leads_next` (
	`id` text PRIMARY KEY NOT NULL,
	`experiment` text NOT NULL,
	`offer_variant` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`whatsapp` text,
	`contact_key` text NOT NULL,
	`capture_contract` text NOT NULL,
	`modality` text NOT NULL DEFAULT 'undecided',
	`stage` text NOT NULL,
	`challenge` text NOT NULL,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`landing_path` text,
	`referrer` text,
	`consent_at` text NOT NULL,
	`whatsapp_consent_at` text,
	`privacy_version` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `leads_capture_contract_check` CHECK (
		`capture_contract` IN ('legacy-v1','gsi-email-v1','ss-whatsapp-v1')
	),
	CONSTRAINT `leads_contact_contract_check` CHECK (
		(
			`capture_contract` = 'legacy-v1'
			AND `contact_key` = 'legacy:' || `id`
			AND `email` IS NOT NULL
		)
		OR (
			`capture_contract` = 'gsi-email-v1'
			AND `experiment` = 'gsi-caso-0'
			AND `email` IS NOT NULL
			AND length(trim(`email`)) > 0
			AND `contact_key` = 'email:' || lower(trim(`email`))
			AND `whatsapp` IS NULL
			AND `whatsapp_consent_at` IS NULL
		)
		OR (
			`capture_contract` = 'ss-whatsapp-v1'
			AND `experiment` = 'ss-casolab'
			AND `whatsapp` IS NOT NULL
			AND length(`whatsapp`) BETWEEN 3 AND 16
			AND substr(`whatsapp`, 1, 1) = '+'
			AND substr(`whatsapp`, 2, 1) BETWEEN '1' AND '9'
			AND substr(`whatsapp`, 2) NOT GLOB '*[^0-9]*'
			AND `contact_key` = 'whatsapp:' || `whatsapp`
			AND datetime(`whatsapp_consent_at`) IS NOT NULL
			AND `privacy_version` IS NOT NULL
			AND length(trim(`privacy_version`)) > 0
		)
	),
	CONSTRAINT `leads_dates_check` CHECK (
		`capture_contract` = 'legacy-v1'
		OR (
			datetime(`consent_at`) IS NOT NULL
			AND datetime(`created_at`) IS NOT NULL
			AND datetime(`updated_at`) IS NOT NULL
			AND datetime(`updated_at`) >= datetime(`created_at`)
		)
	)
);
--> statement-breakpoint
INSERT INTO `leads_next` (
	`id`, `experiment`, `offer_variant`, `name`, `email`, `whatsapp`,
	`contact_key`, `capture_contract`, `modality`, `stage`, `challenge`,
	`utm_source`, `utm_medium`, `utm_campaign`, `landing_path`, `referrer`,
	`consent_at`, `whatsapp_consent_at`, `privacy_version`, `created_at`, `updated_at`
)
SELECT
	`id`, `experiment`, `offer_variant`, `name`, `email`, `whatsapp`,
	'legacy:' || `id`, 'legacy-v1', `modality`, `stage`, `challenge`,
	`utm_source`, `utm_medium`, `utm_campaign`, `landing_path`, `referrer`,
	`consent_at`, NULL, NULL, `created_at`, `updated_at`
FROM `leads`;
--> statement-breakpoint
DROP TABLE `leads`;
--> statement-breakpoint
ALTER TABLE `leads_next` RENAME TO `leads`;
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_contact_experiment_unique`
	ON `leads` (`contact_key`, `experiment`);
