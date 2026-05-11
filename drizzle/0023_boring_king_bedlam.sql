ALTER TABLE "appointment_items" DROP CONSTRAINT "appointment_items_appointment_id_appointments_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment_items" ADD CONSTRAINT "appointment_items_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;