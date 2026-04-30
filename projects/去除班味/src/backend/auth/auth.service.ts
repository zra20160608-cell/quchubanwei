import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 微信小程序登录
  async wxLogin(code: string) {
    // 调用微信接口获取openid和unionid
    // 实际实现需要调用微信auth.code2Session接口
    const mockOpenid = `openid_${Date.now()}`
    const mockUnionid = `unionid_${Date.now()}`

    // 生成Token
    const token = this.jwtService.sign({
      openid: mockOpenid,
      unionid: mockUnionid
    })

    const refreshToken = this.jwtService.sign({
      openid: mockOpenid,
      type: 'refresh'
    }, { expiresIn: '7d' })

    return {
      token,
      refreshToken,
      userInfo: {
        id: mockOpenid,
        nickname: '打工人',
        avatarUrl: '',
        level: 1,
        exp: 0
      }
    }
  }

  // 刷新Token
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const token = this.jwtService.sign({
        openid: payload.openid
      })
      const newRefreshToken = this.jwtService.sign({
        openid: payload.openid,
        type: 'refresh'
      }, { expiresIn: '7d' })

      return { token, refreshToken: newRefreshToken }
    } catch (error) {
      throw new Error('Token已过期')
    }
  }
}
