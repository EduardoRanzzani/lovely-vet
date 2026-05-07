ALTER TABLE "vaccines" RENAME COLUMN "applied_by_id" TO "doctor_id";--> statement-breakpoint
ALTER TABLE "appointment_items" DROP CONSTRAINT "appointment_items_appointment_id_appointments_id_fk";
--> statement-breakpoint
ALTER TABLE "breeds" DROP CONSTRAINT "breeds_specie_id_species_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" DROP CONSTRAINT "customers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "pathologies" DROP CONSTRAINT "pathologies_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_attachments" DROP CONSTRAINT "pet_attachments_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_notes" DROP CONSTRAINT "pet_notes_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_tutors" DROP CONSTRAINT "pet_tutors_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_tutors" DROP CONSTRAINT "pet_tutors_customer_id_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_weights" DROP CONSTRAINT "pet_weights_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "prescription_templates" DROP CONSTRAINT "prescription_templates_doctor_id_doctors_id_fk";
--> statement-breakpoint
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_appointment_id_appointments_id_fk";
--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "services_specie_id_species_id_fk";
--> statement-breakpoint
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_doctor_id_doctors_id_fk";
--> statement-breakpoint
ALTER TABLE "vaccines" DROP CONSTRAINT "vaccines_applied_by_id_doctors_id_fk";
--> statement-breakpoint
ALTER TABLE "vaccines" DROP CONSTRAINT "vaccines_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_weights" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "specie_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pathologies" ADD COLUMN "doctor_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_specie_id_species_id_fk" FOREIGN KEY ("specie_id") REFERENCES "public"."species"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathologies" ADD CONSTRAINT "pathologies_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pathologies" ADD CONSTRAINT "pathologies_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_attachments" ADD CONSTRAINT "pet_attachments_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_notes" ADD CONSTRAINT "pet_notes_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_tutors" ADD CONSTRAINT "pet_tutors_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_tutors" ADD CONSTRAINT "pet_tutors_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_weights" ADD CONSTRAINT "pet_weights_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription_templates" ADD CONSTRAINT "prescription_templates_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_specie_id_species_id_fk" FOREIGN KEY ("specie_id") REFERENCES "public"."species"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccines" ADD CONSTRAINT "vaccines_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccines" ADD CONSTRAINT "vaccines_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;