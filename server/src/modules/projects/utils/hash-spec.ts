import { createHash } from 'crypto'

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }

  const object = value as Record<string, unknown>

  const sortedKeys = Object.keys(object).sort()
  const entries = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`,
  )

  return `{${entries.join(',')}}`
}

export function hashSpec(spec: unknown): string {
  return createHash('sha256').update(stableStringify(spec)).digest('hex')
}
