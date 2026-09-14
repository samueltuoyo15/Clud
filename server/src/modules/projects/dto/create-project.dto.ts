import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateIf,
} from 'class-validator'

export class CreateProjectDTO {
  @IsNotEmpty({ message: 'Project name is required' })
  @IsString({ message: 'Project name must be a string' })
  name!: string

  @IsNotEmpty({ message: 'Spec URL is required' })
  @IsUrl(
    { require_tld: false },
    { message: 'Please provide a valid URL for the spec' },
  )
  spec_url!: string

  @IsOptional()
  @IsInt({ message: 'Check interval must be an integer' })
  @Min(1, { message: 'Check interval must be at least 1 minute' })
  check_interval_minutes?: number = 15

  @IsNotEmpty({ message: 'Auth type is required' })
  @IsString({ message: 'Auth type must be a string' })
  @IsIn(['none', 'basic'], {
    message: "Auth type must be either 'none' or 'basic'",
  })
  auth_type!: 'none' | 'basic'

  @ValidateIf((obj) => obj.auth_type === 'basic')
  @IsNotEmpty({ message: 'Username is required when auth type is basic' })
  @IsString({ message: 'Username must be a string' })
  auth_username?: string

  @ValidateIf((obj) => obj.auth_type === 'basic')
  @IsNotEmpty({ message: 'Password is required when auth type is basic' })
  @IsString({ message: 'Password must be a string' })
  auth_password?: string
}
