ALTER TABLE `leads` ADD `modality` text DEFAULT 'undecided' NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `case_preference` text DEFAULT 'diagnostic' NOT NULL;