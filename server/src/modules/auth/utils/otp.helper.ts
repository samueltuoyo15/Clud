import { createHash, randomInt } from 'crypto'
import { eq, and, isNull, gt, desc } from 'drizzle-orm'
import db from '../../../db'
import { otpCodes } from '../../../db/schema'

export function hashOtp(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

export async function generateAndStoreOtp(email: string): Promise<string> {
  await db.delete(otpCodes).where(eq(otpCodes.email, email))

  const code = randomInt(100000, 999999).toString()
  const codeHash = hashOtp(code)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await db.insert(otpCodes).values({ email, code_hash: codeHash, expires_at: expiresAt })
  return code
}

export async function verifyAndConsumeOtp(email: string, code: string): Promise<boolean> {
  const [record] = await db
    .select({ id: otpCodes.id, code_hash: otpCodes.code_hash })
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.email, email),
        isNull(otpCodes.used_at),
        gt(otpCodes.expires_at, new Date()),
      ),
    )
    .orderBy(desc(otpCodes.created_at))
    .limit(1)

  if (!record || hashOtp(code) !== record.code_hash) {
    return false
  }

  await db.delete(otpCodes).where(eq(otpCodes.email, email))
  return true
}
