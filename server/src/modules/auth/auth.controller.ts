import { Controller, Post, Body, Get, UseGuards, Req, Res, UnauthorizedException, HttpCode, HttpStatus } from "@nestjs/common"
import { Throttle } from "@nestjs/throttler"
import { AuthService } from "./auth.service"
import { AuthGuard } from "./auth.guard"
import { CurrentUser } from "./current-user.decorator"
import { SignupDto, LoginDto, ResendOtpDto, VerifyOtpDto, RefreshTokenDto } from "./dto/auth.dto"

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post("signup")
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post("login")
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email)
    }

    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post("resend-otp")
    resendOtp(@Body() dto: ResendOtpDto) {
        return this.authService.resendOtp(dto.email)
    }

    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post("verify-otp")
    async verifyOtp(
        @Body() dto: VerifyOtpDto,
        @Res({ passthrough: true }) res: any
    ) {
        const tokens = await this.authService.verifyOtp(dto.email, dto.code)
        const isProduction = process.env.NODE_ENV === "production"

        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 1000,
        })

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return {
            message: "Logged in successfully",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        }
    }

    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post("refresh")
    async refresh(
        @Req() req: any,
        @Body() dto: RefreshTokenDto,
        @Res({ passthrough: true }) res: any
    ) {
        const token = req.cookies?.refreshToken || dto.refreshToken
        if (!token) {
            throw new UnauthorizedException("Refresh token missing")
        }

        const result = await this.authService.refreshToken(token)
        const isProduction = process.env.NODE_ENV === "production"

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 1000,
        })

        return result
    }

    @HttpCode(HttpStatus.OK)
    @Post("logout")
    logout(@Res({ passthrough: true }) res: any) {
        res.clearCookie("accessToken", { path: "/" })
        res.clearCookie("refreshToken", { path: "/" })
        return { message: "Logged out successfully" }
    }

    @UseGuards(AuthGuard)
    @Get("me")
    getMe(@CurrentUser() user: { userId: string }) {
        return this.authService.getMe(user.userId)
    }
}
