import { Module } from '@nestjs/common'
import { WorkspacesController } from './workspaces.controller'
import { WorkspacesService } from './workspaces.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
