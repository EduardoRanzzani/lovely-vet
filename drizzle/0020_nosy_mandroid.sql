ALTER TABLE "pet_attachments" ADD COLUMN "author_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "pet_weights" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "pet_attachments" ADD CONSTRAINT "pet_attachments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_weights" ADD CONSTRAINT "pet_weights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;