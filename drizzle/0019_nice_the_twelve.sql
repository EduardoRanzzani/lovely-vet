CREATE TABLE "pet_tutors" (
	"pet_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	CONSTRAINT "pet_tutors_pet_id_customer_id_pk" PRIMARY KEY("pet_id","customer_id")
);
--> statement-breakpoint
ALTER TABLE "pets" DROP CONSTRAINT "pets_customer_id_customers_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_tutors" ADD CONSTRAINT "pet_tutors_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_tutors" ADD CONSTRAINT "pet_tutors_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pet_tutors_customer_id_idx" ON "pet_tutors" USING btree ("customer_id");--> statement-breakpoint
INSERT INTO "pet_tutors" ("pet_id", "customer_id")
SELECT "id", "customer_id" FROM "pets";
--> statement-breakpoint
ALTER TABLE "pets" DROP COLUMN "customer_id";
