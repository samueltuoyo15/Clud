import { pgEnum, pgTable, varchar, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core"

export const projectSpecAuthTypeEnum = pgEnum("auth_type", ["none", "basic"])
export const userAccountStatusEnum = pgEnum("account_status", ["active", "suspended", "banned", "inactive"])

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    first_name: text("first_name"),
    last_name: text("last_name"),
    country: varchar("country", { length: 255 }),
    profile_picture: text("profile_picture"),
    account_status: userAccountStatusEnum("account_status").notNull().default("active"),
    is_onboarded: boolean("is_onboarded").notNull().default(false),
    email_verified: boolean("email_verified").notNull().default(false),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
    index("users_email_verified_idx").on(t.email_verified),
])

export const otpCodes = pgTable("otp_codes", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    code_hash: text("code_hash").notNull(),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
    used_at: timestamp("used_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
    index("otp_codes_email_idx").on(t.email),
    index("otp_codes_expires_at_idx").on(t.expires_at),
])

export const projects = pgTable("projects", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    spec_url: text("spec_url").notNull(),
    check_interval_minutes: integer("check_interval_minutes").default(15),
    is_paused: boolean("is_paused").notNull().default(false),
    last_hash: text("last_hash"),
    last_spec: text("last_spec"),
    last_etag: text("last_etag"),
    auth_type: projectSpecAuthTypeEnum("auth_type").notNull().default("none"),
    auth_username: text("auth_username"),
    auth_password: text("auth_password"),
    drift_detected: boolean("drift_detected").notNull().default(false),
    last_polled_at: timestamp("last_polled_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
    index("projects_user_id_idx").on(t.user_id),
    index("projects_is_paused_idx").on(t.is_paused),
    index("projects_last_polled_at_idx").on(t.last_polled_at),
])

export type NewUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect

export type NewOtpCode = typeof otpCodes.$inferInsert

export type NewProject = typeof projects.$inferInsert
export type Project = typeof projects.$inferSelect
