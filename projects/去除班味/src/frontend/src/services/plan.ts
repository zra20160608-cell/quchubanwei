import { get, post, put } from '../services/request'

// 获取推荐方案
export const getRecommendPlans = (detectId: string) => get('/plans/recommend', { detectId })

// 选择方案
export const selectPlan = (planId: string, detectId: string) => post('/plans', { planId, detectId })

// 获取我的方案
export const getMyPlans = (status?: string) => get('/plans', { status })

// 获取方案详情
export const getPlanDetail = (id: string) => get(`/plans/${id}`)

// 打卡
export const checkIn = (id: string, actionId: string, content?: string, imageUrl?: string) => 
  post(`/plans/${id}/check-in`, { actionId, content, imageUrl })

// 获取打卡记录
export const getCheckIns = (id: string) => get(`/plans/${id}/check-ins`)

// 补卡
export const makeUpCheckIn = (id: string, day: number) => post(`/plans/${id}/make-up`, { day })

// 放弃方案
export const abandonPlan = (id: string, reason: string) => put(`/plans/${id}/abandon`, { reason })

// 完成复测
export const retestPlan = (id: string, detectId: string) => post(`/plans/${id}/retest`, { detectId })
