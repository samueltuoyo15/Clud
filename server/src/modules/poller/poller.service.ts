import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { eq } from 'drizzle-orm'
import db from '../../db'
import { projects } from '../../db/schema'
import { fetchSpec, SpecAuth } from '../projects/utils/fetch-spec'
import { validateOpenApiSpec } from '../projects/utils/validate-openapi'
import { hashSpec } from '../projects/utils/hash-spec'
import { runOasdiff } from './utils/oasdiff-runner'
import { encrypt, decrypt } from '../../utils/crypto'

@Injectable()
export class PollerService {
  private readonly logger = new Logger(PollerService.name)
  private isRunning = false

  @Cron(CronExpression.EVERY_MINUTE)
  async poll() {
    if (this.isRunning) {
      this.logger.warn('Previous poll cycle still running, skipping this tick')
      return
    }

    this.isRunning = true
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

      const due = candidates.filter((p) => {
        if (!p.last_polled_at) return true
        const intervalMs = 5 * 60 * 1000 // 5 minutes (hardcoded at code level)
        return now.getTime() - p.last_polled_at.getTime() >= intervalMs
      })

      if (due.length === 0) return
      this.logger.log(`Polling ${due.length} project(s)`)
      await Promise.allSettled(due.map((p) => this.checkOne(p.id, now)))
    } catch (err: any) {
      this.logger.error(`Poll cycle error: ${err?.message || err}`)
    } finally {
      this.isRunning = false
    }
  }

  private async checkOne(projectId: string, now: Date) {
    try {
      const [project] = await db
        .select({
          id: projects.id,
          name: projects.name,
          spec_url: projects.spec_url,
          last_hash: projects.last_hash,
          last_spec: projects.last_spec,
          auth_type: projects.auth_type,
          auth_username: projects.auth_username,
          auth_password: projects.auth_password,
        })
        .from(projects)
        .where(eq(projects.id, projectId))

      if (!project) return
      const auth: SpecAuth = {
        type: project.auth_type === 'basic' ? 'basic' : 'none',
        username: project.auth_username ?? undefined,
        password: project.auth_password
          ? decrypt(project.auth_password)
          : undefined,
      }

      const spec = await fetchSpec(project.spec_url, auth)
      validateOpenApiSpec(spec)

      const newHash = hashSpec(spec)
      if (newHash === project.last_hash) {
        await db
          .update(projects)
          .set({ last_polled_at: now })
          .where(eq(projects.id, project.id))
        return
      }

      const newSpecStr = JSON.stringify(spec)
      const prevSpecStr = project.last_spec ? decrypt(project.last_spec) : null
      if (prevSpecStr) {
        const diffResult = await runOasdiff(project.id, prevSpecStr, newSpecStr)
        if (diffResult) this.logger.warn(`Diff detected for ${project.name}`)
      }

      this.logger.warn(`[SPEC CHANGED] "${project.name}" (${project.id})`)
      await db
        .update(projects)
        .set({
          last_hash: newHash,
          last_spec: encrypt(newSpecStr),
          last_polled_at: now,
          updated_at: now,
        })
        .where(eq(projects.id, project.id))
    } catch (err: any) {
      this.logger.error(
        `Failed to poll project "${projectId}": ${err?.message || err}`,
      )
      await db
        .update(projects)
        .set({ last_polled_at: now })
        .where(eq(projects.id, projectId))
        .catch(() => {})
    }
  }
}
