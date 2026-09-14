import crypto from 'crypto'

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key)
    throw new Error('ENCRYPTION_KEY is not defined in environment variables')
  if (/^[0-9a-fA-F]+$/.test(key) && key.length >= 64) {
    return Buffer.from(key, 'hex').subarray(0, 32)
  }
  return crypto.createHash('sha256').update(key).digest()
}

export function encrypt(value: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv)
  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return [
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64'),
  ].join('.')
}

export function decrypt(value: string): string {
  const [ivBase64, authTagBase64, encryptedBase64] = value.split('.')
  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error('Invalid encrypted value')
  }

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    Buffer.from(ivBase64, 'base64'),
  )
  decipher.setAuthTag(Buffer.from(authTagBase64, 'base64'))

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, 'base64')),
    decipher.final(),
  ]).toString('utf8')
}
