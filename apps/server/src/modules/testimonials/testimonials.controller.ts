import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { TestimonialsService } from './testimonials.service'
import { CreateTestimonialDto } from './dto/create-testimonial.dto'

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  async getTestimonials() {
    const data = await this.testimonialsService.getApproved()
    return {
      success: true,
      data,
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submitTestimonial(@Body() dto: CreateTestimonialDto) {
    const created = await this.testimonialsService.create(dto)
    return {
      success: true,
      message: 'Testimonial submitted successfully.',
      data: created,
    }
  }
}
