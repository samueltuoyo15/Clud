import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common'
import { WorkspacesService } from './workspaces.service'
import { AuthGuard } from '../auth/auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@UseGuards(AuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async getWorkspaces(@CurrentUser() user: { userId: string }) {
    return this.workspacesService.getWorkspaces(user.userId)
  }

  @Get(':id/members')
  async getWorkspaceMembers(
    @Param('id') workspaceId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.workspacesService.getWorkspaceMembers(workspaceId, user.userId)
  }

  @Post(':id/members')
  async addMember(
    @Param('id') workspaceId: string,
    @Body('email') email: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.workspacesService.addMember(workspaceId, email, user.userId)
  }

  @Post()
  async createWorkspace(
    @Body('name') name: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.workspacesService.createWorkspace(name, user.userId)
  }
}
