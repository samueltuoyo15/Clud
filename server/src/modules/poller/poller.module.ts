import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { PollerService } from './poller.service'
import { PollerProcessor } from './poller.processor'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [
    MailModule,
    BullModule.registerQueue({
      name: 'api-poller',
    }),
  ],
  providers: [PollerService, PollerProcessor],
  exports: [PollerService],
})
export class PollerModule {}
