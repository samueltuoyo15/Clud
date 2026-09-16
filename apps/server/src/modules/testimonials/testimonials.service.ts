import { Injectable, Logger } from '@nestjs/common'
import db from '../../db'
import { testimonials } from '../../db/schema/testimonials'
import { desc, eq } from 'drizzle-orm'
import { CreateTestimonialDto } from './dto/create-testimonial.dto'

const DEFAULT_TESTIMONIALS = [
  {
    id: 'seed-1',
    name: 'Sarah Jenkins',
    handle: '@sarahjenkins',
    avatar_url: 'https://i.pravatar.cc/150?img=47',
    quote: 'Clud has completely changed how our frontend and backend teams communicate. We catch breaking changes instantly before they hit production.',
    role: 'Frontend Lead',
    company: 'Fintech',
    rating: 5,
  },
  {
    id: 'seed-2',
    name: 'Marcus Chen',
    handle: '@marcuschen_dev',
    avatar_url: 'https://i.pravatar.cc/150?img=11',
    quote: 'I used to spend hours debugging silent failures. Now Clud just pings our Slack channel the second an API spec drifts. Unbelievably good.',
    role: 'Backend Architect',
    company: 'DevFlow',
    rating: 5,
  },
  {
    id: 'seed-3',
    name: 'Elena Rodriguez',
    handle: '@elena_codes',
    avatar_url: 'https://i.pravatar.cc/150?img=32',
    quote: 'The easiest setup I have ever experienced. Dropped our OpenAPI spec URL in and it immediately started protecting our mobile team from unexpected breaks.',
    role: 'Mobile Engineer',
    company: 'ScaleApps',
    rating: 5,
  },
]

@Injectable()
export class TestimonialsService {
  private readonly logger = new Logger(TestimonialsService.name)

  async getApproved() {
    try {
      const records = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.is_approved, true))
        .orderBy(desc(testimonials.created_at))

      if (!records || records.length === 0) {
        return DEFAULT_TESTIMONIALS
      }
      return records
    } catch (err: any) {
      this.logger.warn(`Could not fetch testimonials from DB: ${err.message}`)
      return DEFAULT_TESTIMONIALS
    }
  }

  async create(dto: CreateTestimonialDto) {
    const avatar = dto.avatar_url?.trim() || `https://i.pravatar.cc/150?u=${encodeURIComponent(dto.name)}`
    const [inserted] = await db
      .insert(testimonials)
      .values({
        name: dto.name,
        handle: dto.handle?.startsWith('@') ? dto.handle : dto.handle ? `@${dto.handle}` : null,
        avatar_url: avatar,
        quote: dto.quote,
        role: dto.role || null,
        company: dto.company || null,
        rating: dto.rating || 5,
        is_approved: true,
      })
      .returning()

    return inserted
  }
}
