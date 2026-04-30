import { post } from '../services/request'

// 图像识别
export const analyzeImage = (imageUrl: string, sceneType: string, detectElements?: string[]) => 
  post('/ai/vision/analyze', { imageUrl, sceneType, detectElements })

// 辣评生成
export const generateComment = (score: number, level: string, elements?: any[]) => 
  post('/ai/comment/generate', { score, level, elements })

// 内容审核
export const moderateContent = (text: string, images?: string[]) => 
  post('/ai/moderate', { text, images })
