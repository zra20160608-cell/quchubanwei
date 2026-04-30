import { post } from '../services/request'

// 微信小程序登录
export const login = (code: string) => post('/auth/login', { code })

// 刷新Token
export const refreshAuthToken = (refreshToken: string) => post('/auth/refresh', { refreshToken })
