ALTER TABLE `leads` ADD `experiment` text DEFAULT 'gsi-caso-0' NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `offer_variant` text DEFAULT 'legacy-290' NOT NULL;--> statement-breakpoint
DROP INDEX `leads_email_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `leads_email_experiment_unique` ON `leads` (`email`,`experiment`);--> statement-breakpoint
CREATE TABLE `funnel_events` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`experiment` text NOT NULL,
	`offer_variant` text DEFAULT 'baseline' NOT NULL,
	`event_type` text NOT NULL,
	`path` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`metadata_json` text,
	`created_at` text NOT NULL
);--> statement-breakpoint
CREATE INDEX `funnel_events_experiment_type_created_idx` ON `funnel_events` (`experiment`,`event_type`,`created_at`);
