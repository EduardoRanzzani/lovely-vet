ALTER TABLE "shifts" ADD COLUMN "requester_name" text;--> statement-breakpoint
ALTER TABLE "shifts" ADD COLUMN "amount_in_cents" integer;--> statement-breakpoint
ALTER TABLE "shifts" ADD COLUMN "is_paid" boolean DEFAULT false NOT NULL;