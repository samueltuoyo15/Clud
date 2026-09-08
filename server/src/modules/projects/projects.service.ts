import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDTO } from './dto/create-project.dto';
import { fetchSpec, SpecAuth } from './utils/fetch-spec';
import { validateOpenApiSpec } from './utils/validate-openapi';
import { hashSpec } from './utils/hash-spec';
import db from '../../db';
import { projects, NewProject } from '../../db/schema';
import { eq, and } from "drizzle-orm"
import crypto from "crypto"
import openapiDiff from "openapi-diff"

@Injectable()
export class ProjectsService {
    private readonly logger = new Logger(ProjectsService.name)
    private readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!




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
            password: auth_password
        }

        const spec = await fetchSpec(spec_url, auth)

        validateOpenApiSpec(spec)

        const hashed_spec = hashSpec(spec)

        const newProject: NewProject = {
            user_id: userId,
            name,
            spec_url,
            check_interval_minutes,
            auth_type,
            auth_username: auth_username ?? null,
            auth_password: auth_password ? this.encrypt(auth_password) : null,
            last_hash: hashed_spec,
            last_spec: this.encrypt(JSON.stringify(spec)),
            last_polled_at: new Date()
        }

        const [project] = await db
            .insert(projects)
            .values(newProject)
            .returning({
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

        if (!project) {
            throw new NotFoundException("Project Not Found.")
        }

        this.logger.log(`Project ${project.id} fetched successfully.`)

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

        if (!project) {
            throw new NotFoundException("Project Not Found.")
        }

        const auth: SpecAuth = {
            type: project.auth_type === "basic" ? "basic" : "none",
            username: project.auth_username ?? undefined,
            password: project.auth_password ? this.decrypt(project.auth_password) : undefined,
        }

        const spec = await fetchSpec(project.spec_url, auth)

        validateOpenApiSpec(spec)

        const newHash = hashSpec(spec)
        const changed = newHash !== project.last_hash

        if (!changed) {
            this.logger.log(`No spec change for project: ${project.name} (${project.id})`)
            await db
                .update(projects)
                .set({ last_polled_at: new Date() })
                .where(and(eq(projects.id, id), eq(projects.user_id, userId)))

            return { changed: false, diff: null }
        }

        this.logger.warn(`SPEC CHANGED for project: ${project.name} (${project.id})`)

        const newSpecStr = JSON.stringify(spec)

        let diff: {
            breakingChanges: unknown[]
            nonBreakingChanges: unknown[]
            unclassifiedChanges: unknown[]
            breakingChangesFound: boolean
        } | null = null

        const previousSpecStr = project.last_spec ? this.decrypt(project.last_spec) : null

        if (previousSpecStr) {
            const oldSpecObj = JSON.parse(previousSpecStr) as Record<string, unknown>
            const newSpecObj = spec as Record<string, unknown>

            const oldFormat = typeof oldSpecObj.swagger === "string" ? "swagger2" : "openapi3"
            const newFormat = typeof newSpecObj.swagger === "string" ? "swagger2" : "openapi3"

            const result = await openapiDiff.diffSpecs({
                sourceSpec: {
                    content: previousSpecStr,
                    location: "previous",
                    format: oldFormat,
                },
                destinationSpec: {
                    content: newSpecStr,
                    location: "current",
                    format: newFormat,
                },
            })

            diff = {
                breakingChanges: result.breakingDifferencesFound ? result.breakingDifferences : [],
                nonBreakingChanges: result.nonBreakingDifferences ?? [],
                unclassifiedChanges: result.unclassifiedDifferences ?? [],
                breakingChangesFound: result.breakingDifferencesFound,
            }
        }

        await db
            .update(projects)
            .set({
                last_hash: newHash,
                last_spec: this.encrypt(newSpecStr),
                last_polled_at: new Date(),
                drift_detected: result.breakingDifferencesFound,
                updated_at: new Date(),
            })
            .where(and(eq(projects.id, id), eq(projects.user_id, userId)))

        return { changed: true, diff }
    }

    private getEncryptionKey(): Buffer {
        if (!this.ENCRYPTION_KEY) {
            throw new Error("ENCRYPTION_KEY is not defined in environment variables")
        }

        if (/^[0-9a-fA-F]+$/.test(this.ENCRYPTION_KEY) && this.ENCRYPTION_KEY.length >= 64) {
            return Buffer.from(this.ENCRYPTION_KEY, "hex").subarray(0, 32)
        }

        return crypto.createHash("sha256").update(this.ENCRYPTION_KEY).digest()
    }

    private encrypt(value: string): string {
        const iv = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv("aes-256-gcm", this.getEncryptionKey(), iv)

        const encrypted = Buffer.concat([
            cipher.update(value, "utf8"),
            cipher.final()
        ])
        const authTag = cipher.getAuthTag()

        return [
            iv.toString("base64"),
            authTag.toString("base64"),
            encrypted.toString("base64")
        ].join(".")
    }

    private decrypt(value: string): string {   
        const [ivBase64, authTagBase64, encryptedBase64] = value.split(".")
        if(!ivBase64 || !authTagBase64 || !encryptedBase64) {
            throw new Error("Invalid encrypted value")
        }
        const decipher = crypto.createDecipheriv("aes-256-gcm", this.getEncryptionKey(), Buffer.from(ivBase64, "base64"))
        decipher.setAuthTag(Buffer.from(authTagBase64, "base64"))

        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encryptedBase64, "base64")),
            decipher.final()
        ])

        return decrypted.toString("utf8")
    }

}
