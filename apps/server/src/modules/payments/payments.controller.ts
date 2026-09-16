import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  Headers,
  BadRequestException,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { Webhook } from 'standardwebhooks'
import { PaymentsService } from './payments.service'
import { CreateCheckoutDto } from './dto/checkout.dto'
import { AuthGuard } from '../auth/auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { PaymentJobData } from './payments.processor'

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name)

  constructor(
    private readonly paymentsService: PaymentsService,
    @InjectQueue('payments') private readonly paymentsQueue: Queue<PaymentJobData>,
  ) {}

  @UseGuards(AuthGuard)
  @Post('checkout')
  async createCheckout(
    @Body() dto: CreateCheckoutDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    return this.paymentsService.createCheckoutSession(
      dto.workspace_id,
      user.userId,
      user.email,
      dto.return_url,
    )
  }

  @UseGuards(AuthGuard)
  @Get('billing/:workspaceId')
  async getBilling(@Param('workspaceId') workspaceId: string) {
    return this.paymentsService.getWorkspaceBilling(workspaceId)
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: any,
    @Headers() headers: Record<string, string>,
  ) {
    const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET
    const rawBodyBuffer = req.rawBody
    const rawBodyStr = rawBodyBuffer
      ? rawBodyBuffer.toString('utf8')
      : JSON.stringify(req.body)

    if (secret) {
      try {
        const wh = new Webhook(secret)
        wh.verify(rawBodyStr, headers)
      } catch (err: any) {
        this.logger.warn(`Webhook signature verification failed: ${err.message}`)
        throw new BadRequestException('Invalid webhook signature')
      }
    } else {
      this.logger.warn(
        'DODO_PAYMENTS_WEBHOOK_SECRET is not set; skipping signature verification in development.',
      )
    }

    const payload = typeof req.body === 'object' ? req.body : JSON.parse(rawBodyStr)
    const eventId =
      headers['webhook-id'] ||
      payload?.data?.id ||
      payload?.id ||
      `evt_${Date.now()}`
    const eventType = payload?.type || payload?.event_type || 'unknown'

    await this.paymentsQueue.add(
      'process-payment-event',
      {
        eventId,
        eventType,
        payload,
      },
      {
        jobId: eventId,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    )

    return { received: true, event_id: eventId }
  }
}
