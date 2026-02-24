ALTER TABLE "doctors" ADD COLUMN "available_from_week_day" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "available_to_week_day" integer DEFAULT 5 NOT NULL;