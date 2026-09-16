import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { PaymentsProcessor } from './payments.processor'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({
      name: 'payments',
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsProcessor],
  exports: [PaymentsService],
})
export class PaymentsModule {}
