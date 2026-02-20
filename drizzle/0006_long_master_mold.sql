ALTER TABLE "doctors" ADD COLUMN "available_from_week_day" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "available_to_week_day" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "available_from_time" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "available_to_time" integer NOT NULL;