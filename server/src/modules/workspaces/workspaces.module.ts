import { Module } from '@nestjs/common'
import { WorkspacesController } from './workspaces.controller'
import { WorkspacesService } from './workspaces.service'
import { AuthModule } from '../auth/auth.module'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [AuthModule, MailModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
