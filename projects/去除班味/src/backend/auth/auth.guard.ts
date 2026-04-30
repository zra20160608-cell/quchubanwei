import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader) {
      return false
    }

    const token = authHeader.replace('Bearer ', '')

    try {
      const payload = this.jwtService.verify(token)
      request.userId = payload.openid
      return true
    } catch (error) {
      return false
    }
  }
}
