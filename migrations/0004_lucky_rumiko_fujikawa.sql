CREATE TABLE "expense" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"date" varchar(10) NOT NULL,
	"month" varchar(7) NOT NULL,
	"description" varchar(240) NOT NULL,
	"amount_clp" integer NOT NULL,
	"notes" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "expense_user_month_idx" ON "expense" USING btree ("user_id","month");