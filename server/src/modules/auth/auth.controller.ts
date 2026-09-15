import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import type { Response, Request } from 'express'
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard'
import { CurrentUser } from './current-user.decorator'
import {
  SignupDto,
  LoginDto,
  ResendOtpDto,
  VerifyOtpDto,
  RefreshTokenDto,
} from './dto/auth.dto'
import { setAuthCookies, clearAuthCookies } from './utils/auth-cookies'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email)
  }

  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('resend-otp')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto.email)
  }

  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.verifyOtp(dto.email, dto.code)
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken)
    return { message: 'Logged in successfully', ...tokens }
  }

  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refreshToken || dto.refreshToken
    if (!token) throw new UnauthorizedException('Refresh token missing')

    const result = await this.authService.refreshToken(token)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000,
    })
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookies(res)
    return { message: 'Logged out successfully' }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: { userId: string }) {
    return this.authService.getMe(user.userId)
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  updateProfile(
    @CurrentUser() user: { userId: string },
    @Body()
    dto: {
      firstName?: string
      lastName?: string
      profilePicture?: string
    },
  ) {
    return this.authService.updateProfile(user.userId, dto)
  }
}
