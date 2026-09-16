import { pgTable, uuid, text, boolean, timestamp, index } from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'
import { projects } from './projects'

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspace_id: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    project_id: uuid('project_id').references(() => projects.id, {
      onDelete: 'cascade',
    }),
    title: text('title').notNull(),
    message: text('message').notNull(),
    type: text('type').notNull().default('drift'),
    read: boolean('read').notNull().default(false),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('notifications_workspace_id_idx').on(t.workspace_id),
    index('notifications_read_idx').on(t.read),
    index('notifications_created_at_idx').on(t.created_at),
  ],
)

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
