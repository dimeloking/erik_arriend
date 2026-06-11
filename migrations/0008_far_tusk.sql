CREATE TABLE "extra_payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"month" varchar(7) NOT NULL,
	"description" varchar(240) NOT NULL,
	"amount_clp" integer NOT NULL,
	"paid_on" varchar(10) NOT NULL,
	"method" varchar(32) NOT NULL,
	"notes" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "extra_payment" ADD CONSTRAINT "extra_payment_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "extra_payment_property_idx" ON "extra_payment" USING btree ("property_id");--> statement-breakpoint
ALTER TABLE "payment" DROP COLUMN "extra_amount_clp";