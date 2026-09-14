import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { eq } from 'drizzle-orm'
import db from '../../db'
import { users } from '../../db/schema'
import { SignupDto } from './dto/auth.dto'
import { MailService } from '../mail/mail.service'
import { generateAndStoreOtp, verifyAndConsumeOtp } from './utils/otp.helper'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signup(dto: SignupDto) {
    const { country, firstName, lastName } = dto
    const email = dto.email.toLowerCase()

    const [existing] = await db
      .select({ id: users.id, email_verified: users.email_verified })
      .from(users)
      .where(eq(users.email, email))

    if (existing) {
      if (existing.email_verified) throw new ConflictException('An account with this email already exists')
      await db
        .update(users)
        .set({
          country: country ? country.toUpperCase() : null,
          first_name: firstName,
          last_name: lastName,
          is_onboarded: Boolean(country),
          updated_at: new Date(),
        })
        .where(eq(users.id, existing.id))
    } else {
      await db.insert(users).values({
        email,
        first_name: firstName,
        last_name: lastName,
        country: country ? country.toUpperCase() : null,
        is_onboarded: Boolean(country),
        email_verified: false,
        profile_picture: 'https://glint-dev.vercel.app/api/avatar?seed=jane.doe&png=true',
      })
    }

    const code = await generateAndStoreOtp(email)
    await this.mailService.sendOtp(email, code)
    return { message: 'Check your email for a verification code' }
  }

  async login(emailInput: string) {
    const email = emailInput.toLowerCase()
    const [user] = await db.select({ id: users.id, email_verified: users.email_verified }).from(users).where(eq(users.email, email))
    if (!user) throw new UnauthorizedException('Invalid credentials')
    if (!user.email_verified) throw new UnauthorizedException('Please verify your email before logging in')

    const code = await generateAndStoreOtp(email)
    await this.mailService.sendOtp(email, code)
    return { message: 'Check your email for a verification code' }
  }

  async resendOtp(emailInput: string) {
    const email = emailInput.toLowerCase()
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email))
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const code = await generateAndStoreOtp(email)
    await this.mailService.sendOtp(email, code)
    return { message: 'A new verification code has been sent to your email' }
  }

  async verifyOtp(emailInput: string, code: string) {
    const email = emailInput.toLowerCase()
    const [user] = await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.email, email))
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await verifyAndConsumeOtp(email, code)
    if (!valid) throw new UnauthorizedException('Invalid or expired code')

    await db.update(users).set({ email_verified: true, updated_at: new Date() }).where(eq(users.id, user.id))

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, type: 'access' }, { expiresIn: '1h' })
    const refreshToken = this.jwtService.sign({ sub: user.id, email: user.email, type: 'refresh' }, { expiresIn: '7d' })

    return { accessToken, refreshToken }
  }

  async refreshToken(token: string) {
    let payload: { sub: string; email: string; type?: string }
    try { payload = this.jwtService.verify(token) } catch { throw new UnauthorizedException('Invalid or expired refresh token') }
    if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid token type')

    const [user] = await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.id, payload.sub))
    if (!user) throw new UnauthorizedException('User not found')

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, type: 'access' }, { expiresIn: '1h' })
    return { accessToken }
  }

  async getMe(userId: string) {
    const [user] = await db
      .select({
        id: users.id, email: users.email, first_name: users.first_name, last_name: users.last_name,
        country: users.country, profile_picture: users.profile_picture, account_status: users.account_status,
        is_onboarded: users.is_onboarded, email_verified: users.email_verified, created_at: users.created_at,
      })
      .from(users).where(eq(users.id, userId))
    if (!user) throw new UnauthorizedException('User not found')
    return user
  }
}
