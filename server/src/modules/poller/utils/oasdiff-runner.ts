import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'
import { Logger } from '@nestjs/common'

const execAsync = promisify(exec)
const logger = new Logger('OasdiffRunner')

export async function runOasdiff(
  projectId: string,
  previousSpecStr: string,
  newSpecStr: string,
): Promise<unknown | null> {
  const isWin = os.platform() === 'win32'
  const binaryName = isWin ? 'oasdiff-win.exe' : 'oasdiff-linux'
  const binaryPath = path.join(process.cwd(), 'bin', binaryName)

  const oldFilePath = path.join(os.tmpdir(), `old-${projectId}.json`)
  const newFilePath = path.join(os.tmpdir(), `new-${projectId}.json`)

  try {
    await fs.writeFile(oldFilePath, previousSpecStr)
    await fs.writeFile(newFilePath, newSpecStr)

    let resultStr = ''
    try {
      const { stdout } = await execAsync(
        `"${binaryPath}" diff "${oldFilePath}" "${newFilePath}" -f json`,
      )
      resultStr = stdout
    } catch (execErr: any) {
      if (execErr.stdout) {
        resultStr = execErr.stdout
      } else {
        throw execErr
      }
    }

    return JSON.parse(resultStr)
  } catch (err: any) {
    logger.warn(`Diff failed for project ${projectId}: ${err.message}`)
    return null
  } finally {
    await fs.unlink(oldFilePath).catch(() => {})
    await fs.unlink(newFilePath).catch(() => {})
  }
}
