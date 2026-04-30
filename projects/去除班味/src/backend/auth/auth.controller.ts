import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 微信小程序登录
  @Post('login')
  async wxLogin(@Body() body: { code: string }) {
    return this.authService.wxLogin(body.code)
  }

  // 刷新Token
  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken)
  }
}
