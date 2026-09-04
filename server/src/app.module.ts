import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PollerModule } from './modules/poller/poller.module';

@Module({
  imports: [
    RedisModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        storage: new ThrottlerStorageRedisService(process.env.REDIS_URL || 'redis://localhost:6379'),
        errorMessage: 'Too many attempts. Please slow down and try again in a minute.',
        throttlers: [{ ttl: 60000, limit: 60 }],
      }),
    }),
    AuthModule,
    ProjectsModule,
    PollerModule,
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

