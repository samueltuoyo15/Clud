import { IsNotEmpty, IsOptional, IsString, MaxLength, IsInt, Min, Max, Matches } from 'class-validator'

export class CreateTestimonialDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MaxLength(100)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^@[A-Za-z0-9_]{1,15}$/, {
    message: 'Handle must be a valid Twitter handle starting with @ (e.g. @username)',
  })
  handle?: string

  @IsOptional()
  @IsString()
  avatar_url?: string

  @IsNotEmpty({ message: 'Review content is required' })
  @IsString()
  @MaxLength(1000)
  quote!: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number
}
