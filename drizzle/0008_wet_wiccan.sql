ALTER TYPE "public"."pet_status" ADD VALUE 'missing';--> statement-breakpoint
CREATE TABLE "appointment_items" (
	"appointment_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"price_at_time_in_cents" integer NOT NULL,
	CONSTRAINT "appointment_items_appointment_id_service_id_pk" PRIMARY KEY("appointment_id","service_id")
);
--> statement-breakpoint
CREATE TABLE "medical_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointment_id" uuid,
	"pet_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"diagnosis" text NOT NULL,
	"treatment_plan" text,
	"weight_at_time_in_grams" integer,
	"observations" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" RENAME COLUMN "sex" TO "gender";--> statement-breakpoint
ALTER TABLE "doctors" RENAME COLUMN "licence_number" TO "license_number";--> statement-breakpoint
ALTER TABLE "pets" RENAME COLUMN "weight" TO "weight_in_grams";--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_service_id_services_id_fk";
--> statement-breakpoint
ALTER TABLE "pets" DROP CONSTRAINT "pets_specie_id_species_id_fk";
--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "available_from_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "available_to_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "gender" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "clerk_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "duration_minutes" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_registration_complete" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scheduled_at_idx" ON "appointments" USING btree ("scheduled_at");--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "service_id";--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN "sex";--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN "available_from_week_day";--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN "available_to_week_day";--> statement-breakpoint
ALTER TABLE "pets" DROP COLUMN "specie_id";--> statement-breakpoint
ALTER TABLE "pets" DROP COLUMN "observations";