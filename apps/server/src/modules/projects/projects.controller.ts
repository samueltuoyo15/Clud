import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { CreateProjectDTO } from './dto/create-project.dto'
import { AuthGuard } from '../auth/auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  async createProject(
    @Body() dto: CreateProjectDTO,
    @CurrentUser() user: { userId: string },
  ) {
    return await this.projectsService.createProject(dto, user.userId)
  }

  @Get()
  async getProjects(@CurrentUser() user: { userId: string }) {
    return await this.projectsService.getProjects(user.userId)
  }

  @Get(':id')
  async getProject(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return await this.projectsService.getProject(id, user.userId)
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/check')
  async checkProject(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return await this.projectsService.checkProject(id, user.userId)
  }
}
