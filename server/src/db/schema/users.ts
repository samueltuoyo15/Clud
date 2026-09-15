import {
  pgEnum,
  pgTable,
  varchar,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'

export const userAccountStatusEnum = pgEnum('account_status', [
  'active',
  'suspended',
  'banned',
  'inactive',
])

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    first_name: text('first_name'),
    last_name: text('last_name'),
    country: varchar('country', { length: 255 }),
    profile_picture: text('profile_picture'),
    account_status: userAccountStatusEnum('account_status')
      .notNull()
      .default('active'),
    is_onboarded: boolean('is_onboarded').notNull().default(false),
    email_verified: boolean('email_verified').notNull().default(false),
    deleted_at: timestamp('deleted_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('users_email_verified_idx').on(t.email_verified)],
)

export const otpCodes = pgTable(
  'otp_codes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    code_hash: text('code_hash').notNull(),
    expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
    used_at: timestamp('used_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('otp_codes_email_idx').on(t.email),
    index('otp_codes_expires_at_idx').on(t.expires_at),
  ],
)

export type NewUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect
export type NewOtpCode = typeof otpCodes.$inferInsert
