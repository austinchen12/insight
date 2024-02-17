CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`bias` text NOT NULL,
	`sentiment` text NOT NULL,
	`embedding` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `specific_points` (
	`id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`original_excerpt` text NOT NULL,
	`embedding` text NOT NULL,
	`bias` text NOT NULL,
	`sentiment` text NOT NULL,
	`superset_point_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `superset_points` (
	`id` text PRIMARY KEY NOT NULL,
	`title_generated` text NOT NULL,
	`embedding` text NOT NULL
);
