CREATE TYPE "account_status" AS ENUM('active', 'suspended', 'banned', 'inactive');--> statement-breakpoint
CREATE TYPE "workspace_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "auth_type" AS ENUM('none', 'basic');--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL,
	"code_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"first_name" text,
	"last_name" text,
	"country" varchar(255),
	"role" varchar(255),
	"challenge" text,
	"profile_picture" text,
	"account_status" "account_status" DEFAULT 'active'::"account_status" NOT NULL,
	"is_onboarded" boolean DEFAULT false NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"workspace_id" uuid,
	"user_id" uuid,
	"role" "workspace_role" DEFAULT 'member'::"workspace_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_members_pkey" PRIMARY KEY("workspace_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"logo_url" text,
	"alert_emails" jsonb DEFAULT '"[]"',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"spec_url" text NOT NULL,
	"check_interval_minutes" integer DEFAULT 2,
	"is_paused" boolean DEFAULT false NOT NULL,
	"last_hash" text,
	"last_spec" text,
	"last_etag" text,
	"auth_type" "auth_type" DEFAULT 'none'::"auth_type" NOT NULL,
	"auth_username" text,
	"auth_password" text,
	"drift_detected" boolean DEFAULT false NOT NULL,
	"last_polled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workspace_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"access_token" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workspace_id" uuid NOT NULL,
	"project_id" uuid,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'drift' NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "otp_codes_email_idx" ON "otp_codes" ("email");--> statement-breakpoint
CREATE INDEX "otp_codes_expires_at_idx" ON "otp_codes" ("expires_at");--> statement-breakpoint
CREATE INDEX "users_email_verified_idx" ON "users" ("email_verified");--> statement-breakpoint
CREATE INDEX "wm_user_id_idx" ON "workspace_members" ("user_id");--> statement-breakpoint
CREATE INDEX "projects_workspace_id_idx" ON "projects" ("workspace_id");--> statement-breakpoint
CREATE INDEX "projects_is_paused_idx" ON "projects" ("is_paused");--> statement-breakpoint
CREATE INDEX "projects_last_polled_at_idx" ON "projects" ("last_polled_at");--> statement-breakpoint
CREATE INDEX "integrations_workspace_id_idx" ON "integrations" ("workspace_id");--> statement-breakpoint
CREATE INDEX "integrations_provider_idx" ON "integrations" ("provider");--> statement-breakpoint
CREATE INDEX "notifications_workspace_id_idx" ON "notifications" ("workspace_id");--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" ("read");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" ("created_at");--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;