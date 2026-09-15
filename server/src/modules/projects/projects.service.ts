import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import { CreateProjectDTO } from './dto/create-project.dto'
import { fetchSpec, SpecAuth } from './utils/fetch-spec'
import { validateOpenApiSpec } from './utils/validate-openapi'
import { hashSpec } from './utils/hash-spec'
import { computeSpecDiff } from './utils/diff-spec'
import { runOasdiff } from '../poller/utils/oasdiff-runner'
import { encrypt, decrypt } from '../../utils/crypto'
import db from '../../db'
import { projects, NewProject, workspaceMembers, workspaces, integrations, notifications } from '../../db/schema'
import { MailService } from '../mail/mail.service'

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name)
  constructor(private readonly mailService: MailService) {}

  async createProject(dto: CreateProjectDTO, userId: string) {
    const { name, spec_url, check_interval_minutes, auth_type, auth_username, auth_password } = dto
    const auth: SpecAuth = { type: auth_type, username: auth_username, password: auth_password }

    const [member] = await db
      .select({ workspace_id: workspaceMembers.workspace_id })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.user_id, userId))
      .limit(1)
    if (!member) throw new UnauthorizedException('User has no workspace')

    const spec = await fetchSpec(spec_url, auth)
    validateOpenApiSpec(spec)
    const hashed = hashSpec(spec)

    const newProj: NewProject = {
      workspace_id: member.workspace_id,
      name,
      spec_url,
      check_interval_minutes,
      auth_type,
      auth_username: auth_username ?? null,
      auth_password: auth_password ? encrypt(auth_password) : null,
      last_hash: hashed,
      last_spec: encrypt(JSON.stringify(spec)),
      last_polled_at: new Date(),
    }

    const [project] = await db.insert(projects).values(newProj).returning({
      id: projects.id,
      name: projects.name,
      spec_url: projects.spec_url,
      check_interval_minutes: projects.check_interval_minutes,
      is_paused: projects.is_paused,
      auth_type: projects.auth_type,
      auth_username: projects.auth_username,
      last_polled_at: projects.last_polled_at,
      created_at: projects.created_at,
      updated_at: projects.updated_at,
    })

    this.logger.log(`Project ${project.name} created successfully`)
    return project
  }

  async getProjects(userId: string) {
    const userWorkspaces = await db
      .select({ id: workspaceMembers.workspace_id })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.user_id, userId))

    if (!userWorkspaces.length) return []
    const workspaceId = userWorkspaces[0].id

    return await db
      .select({
        id: projects.id,
        name: projects.name,
        spec_url: projects.spec_url,
        check_interval_minutes: projects.check_interval_minutes,
        is_paused: projects.is_paused,
        auth_type: projects.auth_type,
        auth_username: projects.auth_username,
        drift_detected: projects.drift_detected,
        last_polled_at: projects.last_polled_at,
        created_at: projects.created_at,
        updated_at: projects.updated_at,
      })
      .from(projects)
      .where(eq(projects.workspace_id, workspaceId))
  }

  async getProject(id: string, userId: string) {
    const userWorkspaces = await db
      .select({ id: workspaceMembers.workspace_id })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.user_id, userId))

    if (!userWorkspaces.length) throw new NotFoundException('Project Not Found.')
    const workspaceId = userWorkspaces[0].id

    const [project] = await db
      .select({
        id: projects.id,
        name: projects.name,
        spec_url: projects.spec_url,
        check_interval_minutes: projects.check_interval_minutes,
        is_paused: projects.is_paused,
        auth_type: projects.auth_type,
        auth_username: projects.auth_username,
        drift_detected: projects.drift_detected,
        last_polled_at: projects.last_polled_at,
        created_at: projects.created_at,
        updated_at: projects.updated_at,
      })
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.workspace_id, workspaceId)))

    if (!project) throw new NotFoundException('Project Not Found.')
    return project
  }

  async checkProject(id: string, userId: string) {
    const userWorkspaces = await db
      .select({ id: workspaceMembers.workspace_id })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.user_id, userId))

    if (!userWorkspaces.length) throw new NotFoundException('Project Not Found.')
    const workspaceId = userWorkspaces[0].id

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
      .where(and(eq(projects.id, id), eq(projects.workspace_id, workspaceId)))

    if (!project) throw new NotFoundException('Project Not Found.')

    const auth: SpecAuth = {
      type: project.auth_type === 'basic' ? 'basic' : 'none',
      username: project.auth_username ?? undefined,
      password: project.auth_password ? decrypt(project.auth_password) : undefined,
    }

    const spec = await fetchSpec(project.spec_url, auth)
    validateOpenApiSpec(spec)

    const newHash = hashSpec(spec)
    if (newHash === project.last_hash) {
      await db
        .update(projects)
        .set({ last_polled_at: new Date() })
        .where(and(eq(projects.id, id), eq(projects.workspace_id, workspaceId)))
      return { changed: false, diff: null }
    }

    const newSpecStr = JSON.stringify(spec)
    const prevSpecStr = project.last_spec ? decrypt(project.last_spec) : null
    const diff = prevSpecStr ? await computeSpecDiff(prevSpecStr, newSpecStr) : null
    const oasdiffResult = prevSpecStr ? await runOasdiff(project.id, prevSpecStr, newSpecStr) : null

    if (diff?.breakingChangesFound || oasdiffResult?.hasChanges) {
      const changelogText =
        oasdiffResult?.changelog ||
        'Breaking changes were detected in the OpenAPI specification.'

      const [ws] = await db.select({ alert_emails: workspaces.alert_emails }).from(workspaces).where(eq(workspaces.id, workspaceId))
      const slacks = await db.select().from(integrations).where(and(eq(integrations.workspace_id, workspaceId), eq(integrations.provider, 'slack')))
      
      const alertEmails = (ws?.alert_emails as string[]) || []
      if (alertEmails.length) {
        this.mailService.sendDriftAlert(alertEmails, project.name, changelogText).catch(err => this.logger.error(`Mail alert failed: ${err.message}`))
      }

      for (const slack of slacks) {
        const webhookUrl = (slack.metadata as any)?.webhook_url
        if (webhookUrl) {
          const text = `*API Drift Detected: ${project.name}*\n\n${changelogText}`
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
          }).catch(err => this.logger.error(`Slack alert failed: ${err.message}`))
        }
      }

      await db
        .insert(notifications)
        .values({
          workspace_id: workspaceId,
          project_id: project.id,
          title: `API Drift Detected: ${project.name}`,
          message: changelogText.substring(0, 500),
          type: 'drift',
        })
        .catch(() => {})
    }

    await db
      .update(projects)
      .set({
        last_hash: newHash,
        last_spec: encrypt(newSpecStr),
        last_polled_at: new Date(),
        drift_detected: diff?.breakingChangesFound ?? oasdiffResult?.hasChanges ?? false,
        updated_at: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.workspace_id, workspaceId)))

    return { changed: true, diff }
  }
}
