import { get, put } from '../services/request'

// 获取用户信息
export const getUserProfile = () => get('/user/profile')

// 更新用户信息
export const updateUserProfile = (data: any) => put('/user/profile', data)

// 用户等级
export const getUserLevel = () => get('/user/level')

// 用户成就
export const getUserAchievements = () => get('/user/achievements')

// 用户统计
export const getUserStats = () => get('/user/stats')
