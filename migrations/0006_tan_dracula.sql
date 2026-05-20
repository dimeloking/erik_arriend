ALTER TABLE "payment" ADD COLUMN "tenant_name" varchar(120);--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "tenant_phone" varchar(40);--> statement-breakpoint
UPDATE "payment"
SET
  "tenant_name" = "property"."tenant_name",
  "tenant_phone" = "property"."tenant_phone"
FROM "property"
WHERE "payment"."property_id" = "property"."id";--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "is_occupied" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "vacant_since" varchar(10);--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "contract_duration_unit" varchar(12) DEFAULT 'months' NOT NULL;
