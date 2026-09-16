import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class ContactDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MaxLength(100)
  name!: string

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string

  @IsOptional()
  @IsString()
  @MaxLength(150)
  company?: string

  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @MaxLength(2000)
  message!: string
}
