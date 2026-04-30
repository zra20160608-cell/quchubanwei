import Taro from '@tarojs/taro'
import { get, post } from '../services/request'

// 获取OSS上传凭证
export const getUploadToken = (params: any) => get('/detect/upload-token', params)

// 创建检测任务
export const createDetectTask = (data: any) => post('/detect', data)

// 查询检测状态
export const getDetectStatus = (id: string) => get(`/detect/${id}/status`)

// 获取检测报告
export const getDetectReport = (id: string) => get(`/detect/${id}/report`)

// 获取检测历史
export const getDetectHistory = (params?: any) => get('/detect/history', params)

// 生成分享海报
export const generatePoster = (id: string, style?: string) => 
  post(`/detect/${id}/poster`, { style })

// 历史对比
export const getComparison = (recordIds: string[]) => 
  get('/detect/compare', { recordIds })