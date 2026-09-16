import { BadRequestException } from '@nestjs/common'

export function validateOpenApiSpec(spec: unknown): void {
  if (typeof spec !== 'object' || spec === null) {
    throw new BadRequestException('Spec is not a valid JSON object')
  }

  const document = spec as Record<string, unknown>

  const isOpenApi =
    typeof document.openapi === 'string' || typeof document.swagger === 'string'

  if (!isOpenApi) {
    throw new BadRequestException(
      'URL does not contain an OpenAPI/Swagger document',
    )
  }
}
