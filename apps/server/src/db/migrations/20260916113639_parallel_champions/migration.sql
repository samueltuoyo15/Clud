CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"handle" text,
	"avatar_url" text,
	"quote" text NOT NULL,
	"role" text,
	"company" text,
	"rating" integer DEFAULT 5 NOT NULL,
	"is_approved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "testimonials_approved_idx" ON "testimonials" ("is_approved");