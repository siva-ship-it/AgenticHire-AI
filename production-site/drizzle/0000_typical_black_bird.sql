CREATE TABLE `candidates` (
	`id` text PRIMARY KEY NOT NULL,
	`job_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`summary` text NOT NULL,
	`skills` text NOT NULL,
	`resume_key` text NOT NULL,
	`score` integer NOT NULL,
	`score_breakdown` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text NOT NULL,
	`employment_type` text NOT NULL,
	`description` text NOT NULL,
	`skills` text NOT NULL,
	`score_threshold` integer DEFAULT 60 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workflow_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`candidate_id` text NOT NULL,
	`step` text NOT NULL,
	`status` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON UPDATE no action ON DELETE no action
);
