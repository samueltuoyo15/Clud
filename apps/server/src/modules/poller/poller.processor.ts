import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { eq, and } from 'drizzle-orm'
import db from '../../db'
import { projects, workspaces, integrations, notifications } from '../../db/schema'
import { fetchSpec, SpecAuth } from '../projects/utils/fetch-spec'
import { validateOpenApiSpec } from '../projects/utils/validate-openapi'
import { hashSpec } from '../projects/utils/hash-spec'
import { runOasdiff } from './utils/oasdiff-runner'
import { encrypt, decrypt } from '../../utils/crypto'
import { MailService } from '../mail/mail.service'

export interface PollJobData {
  projectId: string
  projectName: string
}

@Processor('api-poller', { concurrency: 5 })
export class PollerProcessor extends WorkerHost {
  private readonly logger = new Logger(PollerProcessor.name)

  constructor(private readonly mailService: MailService) {
    super()
  }

  async process(job: Job<PollJobData>): Promise<void> {
    const { projectId } = job.data
    const now = new Date()

    this.logger.log(
      `Processing job ${job.id} for project "${job.data.projectName}" (${projectId})`,
    )

    const [project] = await db
      .select({
        id: projects.id,
        workspace_id: projects.workspace_id,
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

    let spec: any
    try {
      spec = await fetchSpec(project.spec_url, auth)
      validateOpenApiSpec(spec)
    } catch (fetchErr: any) {
      this.logger.error(
        `Spec unreachable for "${project.name}": ${fetchErr.message}`,
      )

      const unreachableMsg = `OpenAPI spec at ${project.spec_url} is no longer accessible (${fetchErr.message || 'Endpoint unreachable'}). Your service might be down or returning an error.`

      const [ws] = await db
        .select({ alert_emails: workspaces.alert_emails })
        .from(workspaces)
        .where(eq(workspaces.id, project.workspace_id))

      const slacks = await db
        .select()
        .from(integrations)
        .where(
          and(
            eq(integrations.workspace_id, project.workspace_id),
            eq(integrations.provider, 'slack'),
          ),
        )

      const alertEmails = (ws?.alert_emails as string[]) || []
      if (alertEmails.length) {
        this.mailService
          .sendSpecUnreachableAlert(
            alertEmails,
            project.name,
            project.spec_url,
            fetchErr.message,
          )
          .catch((err) =>
            this.logger.error(`Mail unreachable alert failed: ${err.message}`),
          )
      }

      for (const slack of slacks) {
        const webhookUrl = (slack.metadata as any)?.webhook_url
        if (webhookUrl) {
          const text = `*API Spec Unreachable: ${project.name}*\n\n${unreachableMsg}`
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          }).catch((err) =>
            this.logger.error(`Slack alert failed: ${err.message}`),
          )
        }
      }

      // Insert in-app notification
      await db
        .insert(notifications)
        .values({
          workspace_id: project.workspace_id,
          project_id: project.id,
          title: `API Spec Unreachable: ${project.name}`,
          message: unreachableMsg,
          type: 'error',
        })
        .catch(() => {})

      await db
        .update(projects)
        .set({ last_polled_at: now })
        .where(eq(projects.id, project.id))

      return
    }

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
    let hasDrift = false

    if (prevSpecStr) {
      const diffResult = await runOasdiff(project.id, prevSpecStr, newSpecStr)
      if (diffResult?.hasChanges) {
        hasDrift = true
        this.logger.warn(`Diff detected for ${project.name}`)

        const changelogText = diffResult.changelog || 'Schema changes detected in OpenAPI specification.'

        const [ws] = await db
          .select({ alert_emails: workspaces.alert_emails })
          .from(workspaces)
          .where(eq(workspaces.id, project.workspace_id))

        const slacks = await db
          .select()
          .from(integrations)
          .where(
            and(
              eq(integrations.workspace_id, project.workspace_id),
              eq(integrations.provider, 'slack'),
            ),
          )

        const alertEmails = (ws?.alert_emails as string[]) || []
        if (alertEmails.length) {
          this.mailService
            .sendDriftAlert(alertEmails, project.name, changelogText)
            .catch((err) =>
              this.logger.error(`Mail alert failed: ${err.message}`),
            )
        }

        for (const slack of slacks) {
          const webhookUrl = (slack.metadata as any)?.webhook_url
          if (webhookUrl) {
            const text = `*API Drift Detected: ${project.name}*\n\n${changelogText}`
            fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text }),
            }).catch((err) =>
              this.logger.error(`Slack alert failed: ${err.message}`),
            )
          }
        }

        // Insert in-app notification
        await db
          .insert(notifications)
          .values({
            workspace_id: project.workspace_id,
            project_id: project.id,
            title: `API Drift Detected: ${project.name}`,
            message: changelogText.substring(0, 500),
            type: 'drift',
          })
          .catch(() => {})
      }
    }

    this.logger.warn(`[SPEC CHANGED] "${project.name}" (${project.id})`)
    await db
      .update(projects)
      .set({
        last_hash: newHash,
        last_spec: encrypt(newSpecStr),
        last_polled_at: now,
        updated_at: now,
        ...(hasDrift ? { drift_detected: true } : {}),
      })
      .where(eq(projects.id, project.id))
  }
}
