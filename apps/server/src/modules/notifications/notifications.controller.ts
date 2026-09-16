import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { AuthGuard } from '../auth/auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@CurrentUser() user: { userId: string }) {
    return this.notificationsService.getNotifications(user.userId)
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.notificationsService.markAsRead(id, user.userId)
  }
}
