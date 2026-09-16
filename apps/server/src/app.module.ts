import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis'
import { ScheduleModule } from '@nestjs/schedule'
import { BullModule } from '@nestjs/bullmq'
import { RedisModule } from './modules/redis/redis.module'
import { AuthModule } from './modules/auth/auth.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { PollerModule } from './modules/poller/poller.module'
import { IntegrationsModule } from './modules/integrations/integrations.module'
import { WorkspacesModule } from './modules/workspaces/workspaces.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { ContactModule } from './modules/contact/contact.module'
import { TestimonialsModule } from './modules/testimonials/testimonials.module'
import { PaymentsModule } from './modules/payments/payments.module'

@Module({
  imports: [
    RedisModule,
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: () => {
        const rawUrl = process.env.REDIS_URL || 'redis://localhost:6379'
        try {
          const parsed = new URL(rawUrl)
          return {
            connection: {
              host: parsed.hostname || 'localhost',
              port: Number(parsed.port) || 6379,
              password: parsed.password || undefined,
              username: parsed.username || undefined,
            },
          }
        } catch {
          return {
            connection: {
              host: 'localhost',
              port: 6379,
            },
          }
        }
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        storage: new ThrottlerStorageRedisService(
          process.env.REDIS_URL || 'redis://localhost:6379',
        ),
        errorMessage:
          'Too many attempts. Please slow down and try again in a minute.',
        throttlers: [{ ttl: 60000, limit: 60 }],
      }),
    }),
    AuthModule,
    ProjectsModule,
    PollerModule,
    IntegrationsModule,
    WorkspacesModule,
    NotificationsModule,
    ContactModule,
    TestimonialsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
