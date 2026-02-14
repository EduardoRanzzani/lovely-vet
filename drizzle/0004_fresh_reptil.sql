CREATE TYPE "public"."pet_status" AS ENUM('alive', 'dead');--> statement-breakpoint
ALTER TABLE "owners_to_pets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "owners_to_pets" CASCADE;--> statement-breakpoint
ALTER TABLE "breeds" RENAME COLUMN "species_id" TO "specie_id";--> statement-breakpoint
ALTER TABLE "breeds" DROP CONSTRAINT "breeds_species_id_species_id_fk";
--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "status" SET DEFAULT 'alive'::"public"."pet_status";--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "status" SET DATA TYPE "public"."pet_status" USING "status"::"public"."pet_status";--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "breeds" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "breeds" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "customer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "species" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "species" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_specie_id_species_id_fk" FOREIGN KEY ("specie_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;