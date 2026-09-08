import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { eq, and, isNull, gt, desc } from "drizzle-orm"
import { randomInt, createHash } from "crypto"
import db from "../../db"
import { users, otpCodes } from "../../db/schema"
import { SignupDto } from "./dto/auth.dto"

import { MailService } from "../mail/mail.service"

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)

    constructor(
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
    ) {}

    private hashOtp(code: string): string {
        return createHash('sha256').update(code).digest('hex')
    }

    async signup(dto: SignupDto) {
        let { email, country, firstName, lastName } = dto
        email = email.toLowerCase()

        const [existing] = await db
            .select({ id: users.id, email_verified: users.email_verified })
            .from(users)
            .where(eq(users.email, email))

        if (existing) {
            if (existing.email_verified) {
                throw new ConflictException("An account with this email already exists")
            }

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
                profile_picture: "https://glint-dev.vercel.app/api/avatar?seed=jane.doe&png=true"
            })
        }

        await db.delete(otpCodes).where(eq(otpCodes.email, email))

        const code = randomInt(100000, 999999).toString()
        const codeHash = this.hashOtp(code)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await db.insert(otpCodes).values({ email, code_hash: codeHash, expires_at: expiresAt })

        await this.mailService.sendOtp(email, code)

        return { message: "Check your email for a verification code" }
    }

    async login(email: string) {
        email = email.toLowerCase()
        const [user] = await db
            .select({ id: users.id, email_verified: users.email_verified })
            .from(users)
            .where(eq(users.email, email))

        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        if (!user.email_verified) {
            throw new UnauthorizedException("Please verify your email before logging in")
        }

        await db.delete(otpCodes).where(eq(otpCodes.email, email))

        const code = randomInt(100000, 999999).toString()
        const codeHash = this.hashOtp(code)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await db.insert(otpCodes).values({ email, code_hash: codeHash, expires_at: expiresAt })

        await this.mailService.sendOtp(email, code)

        return { message: "Check your email for a verification code" }
    }

    async resendOtp(email: string) {
        email = email.toLowerCase()
        const [user] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, email))

        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        await db.delete(otpCodes).where(eq(otpCodes.email, email))

        const code = randomInt(100000, 999999).toString()
        const codeHash = this.hashOtp(code)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await db.insert(otpCodes).values({ email, code_hash: codeHash, expires_at: expiresAt })

        await this.mailService.sendOtp(email, code)

        return { message: "A new verification code has been sent to your email" }
    }

    async verifyOtp(email: string, code: string) {
        email = email.toLowerCase()
        const [user] = await db
            .select({ id: users.id, email: users.email })
            .from(users)
            .where(eq(users.email, email))

        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        const [record] = await db
            .select({
                id: otpCodes.id,
                code_hash: otpCodes.code_hash,
                expires_at: otpCodes.expires_at,
            })
            .from(otpCodes)
            .where(
                and(
                    eq(otpCodes.email, email),
                    isNull(otpCodes.used_at),
                    gt(otpCodes.expires_at, new Date()),
                )
            )
            .orderBy(desc(otpCodes.created_at))
            .limit(1)

        if (!record) {
            throw new UnauthorizedException("Invalid or expired code")
        }

        const valid = this.hashOtp(code) === record.code_hash
        if (!valid) {
            throw new UnauthorizedException("Invalid or expired code")
        }

        await db
            .update(users)
            .set({ email_verified: true, updated_at: new Date() })
            .where(eq(users.id, user.id))

        await db
            .delete(otpCodes)
            .where(eq(otpCodes.email, email))

        const accessToken = this.jwtService.sign(
            { sub: user.id, email: user.email, type: "access" },
            { expiresIn: "1h" }
        )

        const refreshToken = this.jwtService.sign(
            { sub: user.id, email: user.email, type: "refresh" },
            { expiresIn: "7d" }
        )

        return {
            accessToken,
            refreshToken,
        }
    }

    async refreshToken(token: string) {
        let payload: { sub: string; email: string; type?: string }
        try {
            payload = this.jwtService.verify(token)
        } catch {
            throw new UnauthorizedException("Invalid or expired refresh token")
        }

        if (payload.type !== "refresh") {
            throw new UnauthorizedException("Invalid token type")
        }

        const [user] = await db
            .select({ id: users.id, email: users.email })
            .from(users)
            .where(eq(users.id, payload.sub))

        if (!user) {
            throw new UnauthorizedException("User not found")
        }

        const accessToken = this.jwtService.sign(
            { sub: user.id, email: user.email, type: "access" },
            { expiresIn: "1h" }
        )

        return { accessToken }
    }

    async getMe(userId: string) {
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
                first_name: users.first_name,
                last_name: users.last_name,
                country: users.country,
                profile_picture: users.profile_picture,
                account_status: users.account_status,
                is_onboarded: users.is_onboarded,
                email_verified: users.email_verified,
                created_at: users.created_at,
            })
            .from(users)
            .where(eq(users.id, userId))

        if (!user) {
            throw new UnauthorizedException("User not found")
        }

        return user
    }
}
