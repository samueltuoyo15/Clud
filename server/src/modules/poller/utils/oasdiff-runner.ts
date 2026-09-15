import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'
import { Logger } from '@nestjs/common'

const execAsync = promisify(exec)
const logger = new Logger('OasdiffRunner')

export interface OasdiffExecutionResult {
  hasChanges: boolean
  rawDiff: any | null
  changelog: string
}

export function formatHumanReadableChangelog(raw: string): string {
  if (!raw || !raw.trim()) return 'No changes detected.'

  const lines = raw.split('\n')
  const result: string[] = []
  let endpointCount = 0
  let inInfo = false
  const infoItems: string[] = []

  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('# API Changelog')) continue

    if (line.toLowerCase().startsWith('## api changes')) {
      continue
    }

    if (line.toLowerCase().startsWith('## info')) {
      inInfo = true
      continue
    }

    if (line.startsWith('### ')) {
      endpointCount++
      const ep = line.replace(/^###\s*/, '').trim()
      result.push(`${endpointCount}. ${ep}`)
      continue
    }

    if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
      let text = line.replace(/^[-*•]\s*/, '').replace(/:warning:/g, '').trim()
      if (text) {
        text = text.charAt(0).toUpperCase() + text.slice(1)
        if (inInfo) {
          infoItems.push(text)
        } else {
          result.push(`   • ${text}`)
        }
      }
      continue
    }
  }

  let finalOutput = ''
  if (result.length > 0) {
    finalOutput += 'Summary of Changes:\n\n' + result.join('\n')
  }

  if (infoItems.length > 0) {
    finalOutput += (finalOutput ? '\n\n' : '') + 'Version Notes:\n'
    for (const info of infoItems) {
      finalOutput += `• ${info}\n`
    }
  }

  return finalOutput.trim() || raw.trim()
}

export async function runOasdiff(
  projectId: string,
  previousSpecStr: string,
  newSpecStr: string,
): Promise<OasdiffExecutionResult | null> {
  const isWin = os.platform() === 'win32'
  const binaryName = isWin ? 'oasdiff-win.exe' : 'oasdiff-linux'
  const binaryPath = path.join(process.cwd(), 'bin', binaryName)

  const oldFilePath = path.join(os.tmpdir(), `old-${projectId}.json`)
  const newFilePath = path.join(os.tmpdir(), `new-${projectId}.json`)

  try {
    await fs.writeFile(oldFilePath, previousSpecStr)
    await fs.writeFile(newFilePath, newSpecStr)

    let rawDiff: any = null
    let rawChangelog = ''

    try {
      const { stdout: diffStdout } = await execAsync(
        `"${binaryPath}" diff "${oldFilePath}" "${newFilePath}" -f json`,
      )
      if (diffStdout && diffStdout.trim()) {
        rawDiff = JSON.parse(diffStdout)
      }
    } catch (execErr: any) {
      if (execErr.stdout && execErr.stdout.trim()) {
        try {
          rawDiff = JSON.parse(execErr.stdout)
        } catch {}
      }
    }

    try {
      const { stdout: clStdout } = await execAsync(
        `"${binaryPath}" changelog "${oldFilePath}" "${newFilePath}" -f markdown`,
      )
      if (clStdout && clStdout.trim()) {
        rawChangelog = clStdout.trim()
      }
    } catch (execErr: any) {
      if (execErr.stdout && execErr.stdout.trim()) {
        rawChangelog = execErr.stdout.trim()
      }
    }

    const hasChanges = Boolean(
      (rawDiff && Object.keys(rawDiff).length > 0) ||
      (rawChangelog && !rawChangelog.toLowerCase().includes('no changes')),
    )

    if (!hasChanges) return null

    const formattedChangelog = formatHumanReadableChangelog(rawChangelog)

    return {
      hasChanges,
      rawDiff,
      changelog: formattedChangelog || 'Schema differences detected across endpoints.',
    }
  } catch (err: any) {
    logger.warn(`Diff failed for project ${projectId}: ${err.message}`)
    return null
  } finally {
    await fs.unlink(oldFilePath).catch(() => {})
    await fs.unlink(newFilePath).catch(() => {})
  }
}
