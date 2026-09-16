import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers?.authorization
    let token: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    } else if (request.cookies?.accessToken) {
      token = request.cookies.accessToken
    }

    if (!token) {
      throw new UnauthorizedException('Missing or invalid authorization')
    }

    try {
      const payload = this.jwtService.verify<{
        sub: string
        email: string
        type?: string
      }>(token)
      if (payload.type && payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type')
      }
      request['user'] = { userId: payload.sub, email: payload.email }
      return true
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
