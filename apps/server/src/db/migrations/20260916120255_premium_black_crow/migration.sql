CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workspace_id" uuid NOT NULL,
	"dodo_customer_id" text,
	"dodo_subscription_id" text NOT NULL UNIQUE,
	"status" text DEFAULT 'active' NOT NULL,
	"product_id" text,
	"current_period_end" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" text NOT NULL UNIQUE,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'processed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "plan" text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "subscription_status" text DEFAULT 'inactive' NOT NULL;--> statement-breakpoint
CREATE INDEX "subscriptions_workspace_id_idx" ON "subscriptions" ("workspace_id");--> statement-breakpoint
CREATE INDEX "subscriptions_dodo_sub_id_idx" ON "subscriptions" ("dodo_subscription_id");--> statement-breakpoint
CREATE INDEX "webhook_events_event_id_idx" ON "webhook_events" ("event_id");--> statement-breakpoint
CREATE INDEX "webhook_events_type_idx" ON "webhook_events" ("event_type");--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;