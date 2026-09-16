import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'

export const testimonials = pgTable(
  'testimonials',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    handle: text('handle'),
    avatar_url: text('avatar_url'),
    quote: text('quote').notNull(),
    role: text('role'),
    company: text('company'),
    rating: integer('rating').notNull().default(5),
    is_approved: boolean('is_approved').notNull().default(false),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('testimonials_approved_idx').on(t.is_approved)],
)

export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert
