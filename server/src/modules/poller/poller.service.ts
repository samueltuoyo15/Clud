import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { eq } from 'drizzle-orm'
import db from '../../db'
import { projects } from '../../db/schema'
import type { PollJobData } from './poller.processor'

@Injectable()
export class PollerService {
  private readonly logger = new Logger(PollerService.name)
  private isEnqueuing = false

  constructor(
    @InjectQueue('api-poller')
    private readonly pollerQueue: Queue<PollJobData>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async poll() {
    if (this.isEnqueuing) {
      this.logger.warn('Previous enqueue cycle still running, skipping tick')
      return
    }

    this.isEnqueuing = true
    try {
      const now = new Date()
      const candidates = await db
        .select({
          id: projects.id,
          name: projects.name,
          last_polled_at: projects.last_polled_at,
        })
        .from(projects)
        .where(eq(projects.is_paused, false))

      const intervalMs = 5 * 60 * 1000 // 5 minutes
      const due = candidates.filter((p) => {
        if (!p.last_polled_at) return true
        return now.getTime() - p.last_polled_at.getTime() >= intervalMs
      })

      if (due.length === 0) return

      this.logger.log(`Enqueuing ${due.length} project(s) into BullMQ queue`)
      for (const p of due) {
        await this.pollerQueue.add(
          'poll-spec',
          {
            projectId: p.id,
            projectName: p.name,
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 3000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          },
        )
      }
    } catch (err: any) {
      this.logger.error(`Poll enqueue error: ${err?.message || err}`)
    } finally {
      this.isEnqueuing = false
    }
  }

  async enqueueManualCheck(projectId: string, projectName: string) {
    return this.pollerQueue.add(
      'manual-check',
      {
        projectId,
        projectName,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    )
  }
}
