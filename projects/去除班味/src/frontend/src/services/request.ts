import Taro from '@tarojs/taro'

// API基础配置
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api' 
  : 'https://api.banwei.example.com/api'

// 统一请求封装
export const request = async (options: any) => {
  const { url, method = 'GET', data, header = {} } = options
  
  // 自动附加Token
  const token = Taro.getStorageSync('token')
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }
  
  // 统一请求ID（用于追踪）
  header['X-Request-Id'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    const res: any = await Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header,
      timeout: 15000
    })
    
    // 统一响应格式处理
    if (res.data.code !== 0) {
      throw new Error(res.data.message || '请求失败')
    }
    
    return res.data.data
  } catch (error: any) {
    // 统一错误处理
    if (error.statusCode === 401) {
      // Token过期，尝试刷新
      await refreshToken()
      return request(options) // 重试
    }
    
    Taro.showToast({
      title: error.message || '网络错误',
      icon: 'none'
    })
    
    throw error
  }
}

// Token刷新
const refreshToken = async () => {
  try {
    const refreshToken = Taro.getStorageSync('refreshToken')
    const res: any = await Taro.request({
      url: `${BASE_URL}/auth/refresh`,
      method: 'POST',
      data: { refreshToken }
    })
    
    if (res.data.code === 0) {
      Taro.setStorageSync('token', res.data.data.token)
      Taro.setStorageSync('refreshToken', res.data.data.refreshToken)
    }
  } catch (error) {
    // 刷新失败，跳登录
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('refreshToken')
  }
}

// 便捷方法
export const get = (url: string, params?: any) => request({ url, method: 'GET', data: params })
export const post = (url: string, data?: any) => request({ url, method: 'POST', data })
export const put = (url: string, data?: any) => request({ url, method: 'PUT', data })
export const del = (url: string) => request({ url, method: 'DELETE' })
