import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { MailService } from '../mail/mail.service'
import { ContactDto } from './dto/contact.dto'

@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async submitContact(@Body() dto: ContactDto) {
    await this.mailService.sendContactMessage(
      dto.email,
      dto.name,
      dto.company || '',
      dto.message,
    )
    return {
      success: true,
      message: 'Your inquiry has been received. We will respond shortly.',
    }
  }
}
