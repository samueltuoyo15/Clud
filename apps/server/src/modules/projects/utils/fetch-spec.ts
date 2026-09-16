import { BadRequestException, PayloadTooLargeException } from '@nestjs/common'

export type SpecAuth = {
  type: 'none' | 'basic'
  username?: string
  password?: string
}

const MAX_SPEC_SIZE_BYTES = 10 * 1024 * 1024
const BLOCKED_TYPES = [
  'video/',
  'audio/',
  'image/',
  'application/zip',
  'application/pdf',
  'application/octet-stream',
]

export type FetchSpecResult = {
  spec: unknown
  etag: string | null
}

export async function fetchSpec(url: string, auth: SpecAuth): Promise<unknown> {
  const result = await fetchSpecForPoll(url, auth, null)
  return result?.spec
}

export async function fetchSpecForPoll(
  url: string,
  auth: SpecAuth,
  knownEtag: string | null,
): Promise<FetchSpecResult | null> {
  const headers: Record<string, string> = {}
  if (auth.type === 'basic') {
    headers.Authorization = `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString('base64')}`
  }
  if (knownEtag) headers['If-None-Match'] = knownEtag

  let res: Response
  try {
    res = await fetch(url, { headers, signal: AbortSignal.timeout(20000) })
  } catch {
    throw new BadRequestException(`Could not reach spec URL: ${url}`)
  }

  if (res.status === 304) return null
  if (!res.ok)
    throw new BadRequestException(`Spec URL returned HTTP ${res.status}`)

  const cType = res.headers.get('content-type')?.toLowerCase() ?? ''
  if (BLOCKED_TYPES.some((b) => cType.startsWith(b))) {
    throw new BadRequestException(
      `Invalid content type "${cType}". Spec must be a JSON document.`,
    )
  }

  const cLength = res.headers.get('content-length')
  if (cLength && parseInt(cLength, 10) > MAX_SPEC_SIZE_BYTES) {
    throw new PayloadTooLargeException('Spec file exceeds the 10MB limit.')
  }

  const text = await res.text()
  if (Buffer.byteLength(text, 'utf8') > MAX_SPEC_SIZE_BYTES) {
    throw new PayloadTooLargeException('Spec file exceeds the 10MB limit.')
  }

  try {
    return { spec: JSON.parse(text), etag: res.headers.get('etag') }
  } catch {
    throw new BadRequestException('Spec URL did not return valid JSON')
  }
}
