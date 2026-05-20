CREATE TABLE "balance_snapshot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"income_clp" integer DEFAULT 0 NOT NULL,
	"expenses_clp" integer DEFAULT 0 NOT NULL,
	"balance_clp" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "balance_snapshot_user_uniq" ON "balance_snapshot" USING btree ("user_id");