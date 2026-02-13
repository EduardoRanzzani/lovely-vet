CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'::text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'doctor', 'customer');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "birth_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "birth_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "gender" SET DEFAULT 'male'::"public"."sex";--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "gender" SET DATA TYPE "public"."sex" USING "gender"::"public"."sex";--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "sex" "sex" DEFAULT 'male' NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "sex" "sex" DEFAULT 'female' NOT NULL;