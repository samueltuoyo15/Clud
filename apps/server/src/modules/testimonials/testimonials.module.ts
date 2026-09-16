import { Module } from '@nestjs/common'
import { TestimonialsController } from './testimonials.controller'
import { TestimonialsService } from './testimonials.service'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [MailModule],
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}
