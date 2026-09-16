import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateCheckoutDto {
  @IsString()
  @IsNotEmpty()
  workspace_id: string

  @IsString()
  @IsOptional()
  return_url?: string
}
