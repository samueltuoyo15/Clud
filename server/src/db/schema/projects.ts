import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'

export const projectSpecAuthTypeEnum = pgEnum('auth_type', ['none', 'basic'])

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspace_id: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    spec_url: text('spec_url').notNull(),
    check_interval_minutes: integer('check_interval_minutes').default(5),
    is_paused: boolean('is_paused').notNull().default(false),
    last_hash: text('last_hash'),
    last_spec: text('last_spec'),
    last_etag: text('last_etag'),
    auth_type: projectSpecAuthTypeEnum('auth_type').notNull().default('none'),
    auth_username: text('auth_username'),
    auth_password: text('auth_password'),
    drift_detected: boolean('drift_detected').notNull().default(false),
    last_polled_at: timestamp('last_polled_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('projects_workspace_id_idx').on(t.workspace_id),
    index('projects_is_paused_idx').on(t.is_paused),
    index('projects_last_polled_at_idx').on(t.last_polled_at),
  ],
)

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
