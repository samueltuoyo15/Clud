import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import db from '../../db'
import { testimonials } from '../../db/schema/testimonials'
import { desc, eq } from 'drizzle-orm'
import { CreateTestimonialDto } from './dto/create-testimonial.dto'

import { MailService } from '../mail/mail.service'

const DEFAULT_TESTIMONIALS = [
  {
    id: 'seed-1',
    name: 'Sarah Jenkins',
    handle: '@sarahjenkins',
    avatar_url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=SarahJenkins&backgroundColor=e9d5ff',
    quote: 'Clud has completely changed how our frontend and backend teams communicate. We catch breaking changes instantly before they hit production.',
    role: 'Frontend Lead',
    company: 'Fintech',
    rating: 5,
  },
  {
    id: 'seed-2',
    name: 'Marcus Chen',
    handle: '@marcuschen_dev',
    avatar_url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=MarcusChen&backgroundColor=d8b4fe',
    quote: 'I used to spend hours debugging silent failures. Now Clud just pings our Slack channel the second an API spec drifts. Unbelievably good.',
    role: 'Backend Architect',
    company: 'DevFlow',
    rating: 5,
  },
  {
    id: 'seed-3',
    name: 'Elena Rodriguez',
    handle: '@elena_codes',
    avatar_url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=ElenaRodriguez&backgroundColor=c084fc',
    quote: 'The easiest setup I have ever experienced. Dropped our OpenAPI spec URL in and it immediately started protecting our mobile team from unexpected breaks.',
    role: 'Mobile Engineer',
    company: 'ScaleApps',
    rating: 5,
  },
]

@Injectable()
export class TestimonialsService {
  private readonly logger = new Logger(TestimonialsService.name)

  constructor(private readonly mailService: MailService) {}

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
    const cleanHandle = dto.handle?.replace(/^@+/, '').trim()

    if (cleanHandle) {
      try {
        const checkRes = await fetch(
          `https://unavatar.io/x/${encodeURIComponent(cleanHandle)}?fallback=false`,
          { method: 'HEAD', signal: AbortSignal.timeout(4000) },
        )
        if (checkRes.status === 404) {
          throw new BadRequestException(
            `Twitter / X account "@${cleanHandle}" was not found. Please check your handle.`,
          )
        }
      } catch (err: any) {
        if (err instanceof BadRequestException) {
          throw err
        }
        this.logger.warn(`Could not verify Twitter handle @${cleanHandle}: ${err.message}`)
      }
    }

    let avatar = dto.avatar_url?.trim()
    if (!avatar) {
      if (cleanHandle) {
        avatar = `https://unavatar.io/x/${encodeURIComponent(cleanHandle)}?fallback=https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(cleanHandle)}`
      } else {
        avatar = `https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(dto.name)}`
      }
    }

    const [inserted] = await db
      .insert(testimonials)
      .values({
        name: dto.name,
        handle: cleanHandle ? `@${cleanHandle}` : null,
        avatar_url: avatar,
        quote: dto.quote,
        role: dto.role || null,
        company: dto.company || null,
        rating: dto.rating || 5,
        is_approved: false,
      })
      .returning()

    this.mailService
      .sendNewReviewAlert({
        name: dto.name,
        handle: cleanHandle ? `@${cleanHandle}` : null,
        role: dto.role || null,
        company: dto.company || null,
        rating: dto.rating || 5,
        quote: dto.quote,
      })
      .catch((err) =>
        this.logger.error(`Failed to send new review alert email: ${err.message}`),
      )

    return inserted
  }
}
