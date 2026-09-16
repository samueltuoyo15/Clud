import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  public client!: Redis

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL
    if (!redisUrl) throw new Error('Redis URL is missing from env vars')

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        return Math.min(times * 100, 3000)
      },
    })

    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully')
    })

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error:', err)
    })
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key)
      if (!data) return null
      return JSON.parse(data) as T
    } catch {
      return null
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      if (ttlSeconds) {
        await this.client.set(key, serialized, 'EX', ttlSeconds)
      } else {
        await this.client.set(key, serialized)
      }
    } catch (err) {
      this.logger.error(`Error setting Redis key ${key}`, err)
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (err) {
      this.logger.error(`Error deleting Redis key ${key}`, err)
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(...keys)
      }
    } catch (err) {
      this.logger.error(`Error deleting Redis pattern ${pattern}`, err)
    }
  }

  async onModuleDestroy() {
    await this.client?.quit()
  }
}
