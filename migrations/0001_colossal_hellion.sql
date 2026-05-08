CREATE TABLE "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"month" varchar(7) NOT NULL,
	"amount_clp" integer NOT NULL,
	"paid_on" varchar(10),
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"method" varchar(32),
	"reference" varchar(80),
	"notes" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"nickname" varchar(120) NOT NULL,
	"address" varchar(240) NOT NULL,
	"tenant_name" varchar(120) NOT NULL,
	"tenant_phone" varchar(40),
	"rent_clp" integer NOT NULL,
	"deposit_clp" integer DEFAULT 0 NOT NULL,
	"start_date" varchar(10) NOT NULL,
	"contract_months" integer DEFAULT 12 NOT NULL,
	"increase_pct" integer DEFAULT 0 NOT NULL,
	"increase_anchor" varchar(2) DEFAULT '01' NOT NULL,
	"color" varchar(16) DEFAULT 'mint' NOT NULL,
	"notes" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payment_property_idx" ON "payment" USING btree ("property_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_property_month_uniq" ON "payment" USING btree ("property_id","month");--> statement-breakpoint
CREATE INDEX "property_user_idx" ON "property" USING btree ("user_id");