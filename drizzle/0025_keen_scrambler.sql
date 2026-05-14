ALTER TABLE "clinics" ADD COLUMN "postal_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "address_number" text DEFAULT 'S/N' NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "neighborhood" text NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "state" text DEFAULT 'MS' NOT NULL;