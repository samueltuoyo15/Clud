import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { IntegrationsService } from './integrations.service'
import { AuthGuard } from '../auth/auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@UseGuards(AuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('slack')
  async connectSlack(
    @Body('code') code: string,
    @Body('redirect_uri') redirectUri: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.integrationsService.connectSlack(code, redirectUri, user.userId)
  }
}
