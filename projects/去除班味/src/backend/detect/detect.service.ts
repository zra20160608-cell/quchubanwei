import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DetectService {
  constructor(
    // @InjectRepository(DetectionRecord)
    // private detectionRepo: Repository<DetectionRecord>
  ) {}

  // 获取OSS STS临时凭证
  async getUploadToken(query: any) {
    // 这里调用阿里云STS服务生成临时凭证
    // 实际实现需要接入阿里云SDK
    return {
      accessKeyId: 'STS.xxx',
      accessKeySecret: 'xxx',
      securityToken: 'xxx',
      expiration: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      key: `detect/${this.formatDate()}/${query.filename}`,
      bucket: 'banwei-oss',
      region: 'oss-cn-hangzhou',
      endpoint: 'https://oss-cn-hangzhou.aliyuncs.com'
    }
  }

  // 创建检测任务
  async createTask(body: any, userId: string) {
    const taskId = `DET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 异步启动AI分析
    this.startAnalysis(taskId, body.imageUrl, body.sceneType, body.extraInfo, userId)
    
    return {
      taskId,
      status: 'UPLOADING',
      message: '检测任务已创建'
    }
  }

  // 异步AI分析流程
  private async startAnalysis(taskId: string, imageUrl: string, sceneType: string, extraInfo: any, userId: string) {
    // 模拟分析过程
    // 实际实现需要调用AI Proxy Service
    
    // 1. 图像识别（调用阿里云CV API）
    const elements = await this.callVisionAPI(imageUrl, sceneType)
    
    // 2. 浓度评分（规则引擎）
    const { score, level, dimensions } = this.calculateScore(elements, extraInfo)
    
    // 3. 辣评生成（模板库优先，LLM兜底）
    const comments = await this.generateComments(score, level, elements)
    
    // 4. 保存结果
    const report = {
      id: taskId,
      userId,
      imageUrl,
      sceneType,
      score,
      level,
      elements,
      dimensions,
      comments,
      createdAt: new Date()
    }
    
    // 保存到数据库（实际实现）
    // await this.detectionRepo.save(report)
    
    console.log(`[Detect] 分析完成: ${taskId}, 分数: ${score}`)
  }

  // 调用图像识别API（模拟）
  private async callVisionAPI(imageUrl: string, sceneType: string): Promise<any[]> {
    // 模拟识别结果
    const mockElements = [
      { id: 'E001', name: '外卖盒', category: '工位环境', confidence: 0.92, weight: 15 },
      { id: 'E003', name: '凌乱桌面', category: '工位环境', confidence: 0.85, weight: 10 },
      { id: 'E008', name: '黑眼圈', category: '个人状态', confidence: 0.78, weight: 15 },
      { id: 'E012', name: '多屏幕', category: '设备痕迹', confidence: 0.95, weight: 10 }
    ]
    
    // 随机选择2-5个元素
    const count = Math.floor(Math.random() * 4) + 2
    return mockElements.sort(() => Math.random() - 0.5).slice(0, count)
  }

  // 浓度评分算法（规则引擎）
  private calculateScore(elements: any[], extraInfo: any) {
    let score = 0
    elements.forEach(el => {
      score += el.weight * el.confidence
    })
    
    // 补充信息加分
    if (extraInfo?.workYears === '3-5') score += 5
    if (extraInfo?.workYears === '5+') score += 10
    if (extraInfo?.jobType === '技术') score += 3
    
    // 限制在0-100
    score = Math.min(100, Math.max(0, Math.round(score)))
    
    // 等级判定
    let level = ''
    if (score <= 30) level = '清新脱俗'
    else if (score <= 60) level = '微醺班味'
    else if (score <= 85) level = '班味浓郁'
    else level = '腌入味了'
    
    // 四维度分数（基于总分和元素分布计算）
    const dimensions = {
      fatigue: Math.min(100, Math.round(score * 0.9 + Math.random() * 10)),
      chaos: Math.min(100, Math.round(score * 0.85 + Math.random() * 15)),
      repetition: Math.min(100, Math.round(score * 0.8 + Math.random() * 20)),
      concentration: score
    }
    
    return { score, level, dimensions }
  }

  // 辣评生成（模板库优先）
  private async generateComments(score: number, level: string, elements: any[]): Promise<string[]> {
    const templates = [
      { range: [0, 30], comments: ['您的工位清新脱俗，建议申请国家非物质文化遗产', '检测到0个班味元素，您确定是来上班的吗？', '这工位，说是度假别墅我都信'] },
      { range: [31, 60], comments: ['班味微醺，建议开窗通风', '检测到少量班味元素，尚可通过自救挽回', '您的工位正在慢慢被腌入味'] },
      { range: [61, 85], comments: ['班味浓郁，建议直接申请工伤', '检测到12个班味元素，您的工位正在发酵', '这黑眼圈，说是在通宵蹦迪我都信'] },
      { range: [86, 100], comments: ['腌入味了，建议直接跳槽', '您的工位风水极佳——四面楚歌，八面玲珑', '检测到20+班味元素，建议申请吉尼斯世界纪录'] }
    ]
    
    const matched = templates.find(t => score >= t.range[0] && score <= t.range[1])
    return matched ? matched.comments : templates[2].comments
  }

  // 查询检测状态
  async getStatus(id: string) {
    // 从Redis/数据库查询
    return {
      taskId: id,
      status: 'COMPLETED',
      progress: 100
    }
  }

  // 获取检测报告
  async getReport(id: string) {
    // 从数据库查询
    return {
      id,
      score: 72,
      level: '班味浓郁',
      elements: [],
      dimensions: {},
      comments: [],
      createdAt: new Date()
    }
  }

  // 获取检测历史
  async getHistory(userId: string, query: any) {
    // 分页查询
    return {
      list: [],
      total: 0,
      hasMore: false
    }
  }

  // 生成分享海报
  async generatePoster(id: string, style?: string) {
    // 调用服务端海报生成服务
    return {
      posterUrl: `https://cdn.example.com/posters/${id}_${style || 'default'}.png`
    }
  }

  // 历史对比
  async getComparison(recordIds: string[]) {
    return {
      originalScore: 85,
      newScore: 62,
      change: -23,
      changePercent: -27,
      grade: 'SILVER'
    }
  }

  private formatDate() {
    const now = new Date()
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  }
}
