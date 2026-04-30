import { get, post } from '../services/request'

// 记录分享
export const recordShare = (data: any) => post('/share/record', data)

// 获取邀请码
export const getInviteCode = () => get('/invite/code')

// 获取邀请统计
export const getInviteStats = () => get('/invite/stats')

// 获取我的邀请列表
export const getMyInvites = (params?: any) => get('/invite/list', params)
