import {
  IsEmail,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class SignupDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsISO31661Alpha2({ message: 'Please provide a valid 2-letter country code' })
  country?: string

  @IsOptional()
  @IsString()
  role?: string

  @IsOptional()
  @IsString()
  challenge?: string
}

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string
}

export class ResendOtpDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string
}

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string

  @IsNotEmpty({ message: 'Verification code is required' })
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, { message: 'Verification code must be 6 digits' })
  code!: string
}

export class RefreshTokenDto {
  @IsOptional()
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken?: string
}
