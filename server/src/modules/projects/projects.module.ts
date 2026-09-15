import { Module } from '@nestjs/common'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { AuthModule } from '../auth/auth.module'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [AuthModule, MailModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
