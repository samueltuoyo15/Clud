import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspace_id: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    dodo_customer_id: text('dodo_customer_id'),
    dodo_subscription_id: text('dodo_subscription_id').notNull().unique(),
    status: text('status').notNull().default('active'),
    product_id: text('product_id'),
    current_period_end: timestamp('current_period_end', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('subscriptions_workspace_id_idx').on(t.workspace_id),
    index('subscriptions_dodo_sub_id_idx').on(t.dodo_subscription_id),
  ],
)

export const webhookEvents = pgTable(
  'webhook_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    event_id: text('event_id').notNull().unique(),
    event_type: text('event_type').notNull(),
    payload: jsonb('payload').notNull(),
    status: text('status').notNull().default('processed'),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('webhook_events_event_id_idx').on(t.event_id),
    index('webhook_events_type_idx').on(t.event_type),
  ],
)

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
export type WebhookEvent = typeof webhookEvents.$inferSelect
export type NewWebhookEvent = typeof webhookEvents.$inferInsert
