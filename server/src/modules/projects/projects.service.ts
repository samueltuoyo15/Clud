import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import { CreateProjectDTO } from './dto/create-project.dto'
import { fetchSpec, SpecAuth } from './utils/fetch-spec'
import { validateOpenApiSpec } from './utils/validate-openapi'
import { hashSpec } from './utils/hash-spec'
import { computeSpecDiff } from './utils/diff-spec'
import { encrypt, decrypt } from '../../utils/crypto'
import db from '../../db'
import { projects, NewProject } from '../../db/schema'

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name)

  async createProject(dto: CreateProjectDTO, userId: string) {
    const {
      name,
      spec_url,
      check_interval_minutes,
      auth_type,
      auth_username,
      auth_password,
    } = dto
    const auth: SpecAuth = {
      type: auth_type,
      username: auth_username,
      password: auth_password,
    }

    const spec = await fetchSpec(spec_url, auth)
    validateOpenApiSpec(spec)
    const hashed = hashSpec(spec)

    const newProj: NewProject = {
      user_id: userId,
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
      .where(eq(projects.user_id, userId))
  }

  async getProject(id: string, userId: string) {
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
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))

    if (!project) throw new NotFoundException('Project Not Found.')
    return project
  }

  async checkProject(id: string, userId: string) {
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
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))

    if (!project) throw new NotFoundException('Project Not Found.')

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
        .set({ last_polled_at: new Date() })
        .where(and(eq(projects.id, id), eq(projects.user_id, userId)))
      return { changed: false, diff: null }
    }

    const newSpecStr = JSON.stringify(spec)
    const prevSpecStr = project.last_spec ? decrypt(project.last_spec) : null
    const diff = prevSpecStr
      ? await computeSpecDiff(prevSpecStr, newSpecStr)
      : null

    await db
      .update(projects)
      .set({
        last_hash: newHash,
        last_spec: encrypt(newSpecStr),
        last_polled_at: new Date(),
        drift_detected: diff?.breakingChangesFound ?? false,
        updated_at: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))

    return { changed: true, diff }
  }
}
