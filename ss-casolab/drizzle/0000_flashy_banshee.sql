CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`whatsapp` text,
	`stage` text NOT NULL,
	`challenge` text NOT NULL,
	`hours_per_week` text,
	`price_signal` text NOT NULL,
	`notes` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`landing_path` text,
	`referrer` text,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_email_unique` ON `leads` (`email`);