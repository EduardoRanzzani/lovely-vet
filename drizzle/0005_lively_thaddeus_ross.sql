ALTER TABLE "appointments" RENAME COLUMN "veterinarian_id" TO "doctor_id";--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_veterinarian_id_doctors_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;