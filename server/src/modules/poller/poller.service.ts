import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { eq } from "drizzle-orm"
import db from "../../db"
import { projects } from "../../db/schema"
import { fetchSpec, SpecAuth } from "../projects/utils/fetch-spec"
import { validateOpenApiSpec } from "../projects/utils/validate-openapi"
import { hashSpec } from "../projects/utils/hash-spec"
import * as os from "os"
import * as path from "path"
import { exec } from "child_process"
import { promisify } from "util"
import * as fs from "fs/promises"
import crypto from "crypto"

const execAsync = promisify(exec)

@Injectable()
export class PollerService {
    private readonly logger = new Logger(PollerService.name)
    private readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!
    private isRunning = false

    @Cron(CronExpression.EVERY_MINUTE)
    async poll() {
        if (this.isRunning) {
            this.logger.warn("Previous poll cycle still running, skipping this tick")
            return
        }

        this.isRunning = true

        try {
            const now = new Date()

            const candidates = await db
                .select({
                    id: projects.id,
                    name: projects.name,
                    check_interval_minutes: projects.check_interval_minutes,
                    last_polled_at: projects.last_polled_at,
                })
                .from(projects)
                .where(eq(projects.is_paused, false))

            const due = candidates.filter((p) => {
                if (!p.last_polled_at) return true
                const intervalMs = (p.check_interval_minutes ?? 15) * 60 * 1000
                return now.getTime() - p.last_polled_at.getTime() >= intervalMs
            })

            if (due.length === 0) {
                this.logger.debug("No projects due for polling")
                return
            }

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
                type: project.auth_type === "basic" ? "basic" : "none",
                username: project.auth_username ?? undefined,
                password: project.auth_password ? this.decrypt(project.auth_password) : undefined,
            }

            const spec = await fetchSpec(project.spec_url, auth)
            validateOpenApiSpec(spec)

            const newHash = hashSpec(spec)
            const changed = newHash !== project.last_hash

            if (!changed) {
                await db.update(projects).set({ last_polled_at: now }).where(eq(projects.id, project.id))
                return
            }

            const newSpecStr = JSON.stringify(spec)

            const previousSpecStr = project.last_spec ? this.decrypt(project.last_spec) : null

            if (previousSpecStr) {
                try {
                    const isWin = os.platform() === 'win32';
                    const binaryName = isWin ? 'oasdiff-win.exe' : 'oasdiff-linux';
                    const binaryPath = path.join(process.cwd(), 'bin', binaryName);
                    
                    const oldFilePath = path.join(os.tmpdir(), `old-${project.id}.json`);
                    const newFilePath = path.join(os.tmpdir(), `new-${project.id}.json`);
                    
                    await fs.writeFile(oldFilePath, previousSpecStr);
                    await fs.writeFile(newFilePath, newSpecStr);

                    let resultStr = "";
                    try {
                        const { stdout } = await execAsync(`"${binaryPath}" diff "${oldFilePath}" "${newFilePath}" -f json`);
                        resultStr = stdout;
                    } catch (execErr: any) {
                        if (execErr.stdout) {
                            resultStr = execErr.stdout;
                        } else {
                            throw execErr;
                        }
                    }

                    const diffResult = JSON.parse(resultStr);

                    this.logger.warn(`Full oasdiff result for ${project.id}:\n${JSON.stringify(diffResult, null, 2)}`);
                    
                    await fs.unlink(oldFilePath).catch(() => {});
                    await fs.unlink(newFilePath).catch(() => {});
                } catch (diffErr: any) {
                    this.logger.warn(`Diff failed for project "${project.name}": ${diffErr.message}. Skipping diff but updating spec.`)
                }
            }

            this.logger.warn(`[SPEC CHANGED] "${project.name}" (${project.id})`)

            await db
                .update(projects)
                .set({ last_hash: newHash, last_spec: this.encrypt(newSpecStr), last_polled_at: now, updated_at: now })
                .where(eq(projects.id, project.id))
        } catch (err) {
            this.logger.error(
                `Failed to poll project "${projectId}": ${(err as Error).message}`
            )
            await db
                .update(projects)
                .set({ last_polled_at: now })
                .where(eq(projects.id, projectId))
                .catch(() => {})
        }
    }

    private getEncryptionKey(): Buffer {
        if (!this.ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY is not defined")
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
        if (!ivBase64 || !authTagBase64 || !encryptedBase64) throw new Error("Invalid encrypted value")
        const decipher = crypto.createDecipheriv("aes-256-gcm", this.getEncryptionKey(), Buffer.from(ivBase64, "base64"))
        decipher.setAuthTag(Buffer.from(authTagBase64, "base64"))
        return Buffer.concat([
            decipher.update(Buffer.from(encryptedBase64, "base64")),
            decipher.final()
        ]).toString("utf8")
    }
}
