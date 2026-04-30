import { Injectable } from '@nestjs/common'

// 模拟缓存
const resultCache = new Map<string, any>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5分钟

@Injectable()
export class AIService {
  private wrapResponse(data: any, message = 'success') {
    return {
      code: 0,
      message,
      data,
      requestId: `req_${Date.now()}`,
    }
  }

  private getCacheKey(prefix: string, input: any): string {
    return `${prefix}_${JSON.stringify(input)}`
  }

  private getFromCache(key: string): any | null {
    const cached = resultCache.get(key)
    if (!cached) return null
    if (Date.now() - cached.ts > CACHE_TTL_MS) {
      resultCache.delete(key)
      return null
    }
    return cached.data
  }

  private setCache(key: string, data: any) {
    resultCache.set(key, { data, ts: Date.now() })
  }

  // ========== 图像识别服务 ==========
  async visionAnalyze(body: any) {
    const cacheKey = this.getCacheKey('vision', body.imageUrl)
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return this.wrapResponse(cached, '命中缓存')
    }

    const { imageUrl, sceneType, detectElements } = body

    // 模拟图像识别结果
    const allElements = [
      { id: 'E001', name: '外卖盒', category: '工位环境', confidence: 0.92, weight: 15 },
      { id: 'E002', name: '咖啡杯', category: '工位环境', confidence: 0.88, weight: 8 },
      { id: 'E003', name: '凌乱桌面', category: '工位环境', confidence: 0.85, weight: 10 },
      { id: 'E004', name: '养生壶', category: '工位环境', confidence: 0.75, weight: 12 },
      { id: 'E005', name: '颈椎贴', category: '个人状态', confidence: 0.80, weight: 14 },
      { id: 'E006', name: '眼药水', category: '个人状态', confidence: 0.82, weight: 10 },
      { id: 'E007', name: '抱枕/靠垫', category: '工位环境', confidence: 0.70, weight: 5 },
      { id: 'E008', name: '黑眼圈', category: '个人状态', confidence: 0.78, weight: 15 },
      { id: 'E009', name: '发际线后移', category: '个人状态', confidence: 0.65, weight: 18 },
      { id: 'E010', name: '加班灯', category: '设备痕迹', confidence: 0.90, weight: 12 },
      { id: 'E011', name: '多台显示器', category: '设备痕迹', confidence: 0.95, weight: 10 },
      { id: 'E012', name: '便利贴墙', category: '工位环境', confidence: 0.72, weight: 8 },
      { id: 'E013', name: '午睡装备', category: '工位环境', confidence: 0.68, weight: 6 },
      { id: 'E014', name: '桌面绿植', category: '工位环境', confidence: 0.55, weight: -5 },
    ]

    let elements: any[]
    if (detectElements && detectElements.length > 0) {
      elements = allElements.filter(e => detectElements.includes(e.id))
    } else {
      const count = Math.floor(Math.random() * 5) + 2
      elements = allElements.sort(() => Math.random() - 0.5).slice(0, count)
    }

    const result = {
      elements: elements.map(e => ({
        id: e.id,
        name: e.name,
        category: e.category,
        confidence: e.confidence,
        weight: e.weight,
        boundingBox: [120, 300, 80, 60],
      })),
      sceneType,
      imageUrl,
    }

    this.setCache(cacheKey, result)
    return this.wrapResponse(result)
  }

  // ========== 辣评生成服务 ==========
  async generateComments(body: any) {
    const cacheKey = this.getCacheKey('comments', `${body.score}_${body.level}`)
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return this.wrapResponse(cached, '命中缓存')
    }

    const { score, level, elements = [] } = body

    const elementNames = elements.map((e: any) => e.name).join('、')

    const templates: Record<string, string[]> = {
      '清新脱俗': [
        '您的工位清新脱俗，建议申请国家非物质文化遗产',
        '检测到0个班味元素，您确定是来上班的吗？',
        '这工位，说是度假别墅我都信',
        '班味浓度低到令人发指，建议给同事们传授一下秘籍',
        `检测到${elementNames}，但这丝毫不影响您的清新气质`,
      ],
      '微醺班味': [
        '班味微醺，建议开窗通风',
        '检测到少量班味元素，尚可通过自救挽回',
        '您的工位正在慢慢被腌入味',
        '班味已萌芽，建议趁早干预',
        `检测到${elementNames}，班味正在发酵中`,
      ],
      '班味浓郁': [
        '班味浓郁，建议直接申请工伤',
        `检测到${elementNames}，您的工位正在发酵`,
        '这黑眼圈，说是在通宵蹦迪我都信',
        '工位风水极佳——四面楚歌，八面玲珑',
        '建议老板给您颁发"年度最佳班味员工"奖',
      ],
      '腌入味了': [
        '腌入味了，建议直接跳槽',
        '您的工位风水极佳——四面楚歌，八面玲珑',
        '检测到20+班味元素，建议申请吉尼斯世界纪录',
        `检测到${elementNames}，您已经不是在上班，而是被班上了`,
        '这班味浓度，隔壁工位都能闻到',
        '建议HR给您单独开辟一个"班味保护区"',
      ],
    }

    const comments = templates[level] || templates['班味浓郁']
    const count = Math.min(5, Math.max(3, comments.length))
    const selected = comments.sort(() => Math.random() - 0.5).slice(0, count)

    const result = {
      comments: selected,
      score,
      level,
      elementCount: elements.length,
    }

    this.setCache(cacheKey, result)
    return this.wrapResponse(result)
  }

  // ========== 内容审核服务 ==========
  async moderateContent(body: any) {
    const { text, images = [] } = body

    // 敏感词列表（简化版）
    const sensitiveWords = ['色情', '暴力', '赌博', '毒品', '诈骗', '反动', '脏话']
    let riskLevel = 'none'
    let matchedWords: string[] = []

    if (text) {
      matchedWords = sensitiveWords.filter(w => text.includes(w))
      if (matchedWords.length > 0) {
        riskLevel = matchedWords.length >= 3 ? 'high' : matchedWords.length >= 1 ? 'medium' : 'low'
      }
    }

    // 图片审核模拟（简化）
    const imageResults = images.map(() => ({
      riskLevel: Math.random() > 0.9 ? 'high' : Math.random() > 0.7 ? 'medium' : 'none',
      confidence: Math.random(),
    }))

    const overallRisk =
      riskLevel === 'high' || imageResults.some(r => r.riskLevel === 'high')
        ? 'high'
        : riskLevel === 'medium' || imageResults.some(r => r.riskLevel === 'medium')
          ? 'medium'
          : 'low'

    const result = {
      riskLevel: overallRisk,
      confidence: overallRisk === 'high' ? 0.85 : overallRisk === 'medium' ? 0.6 : 0.15,
      matchedWords,
      textResult: {
        riskLevel,
        confidence: matchedWords.length > 0 ? 0.8 : 0.1,
      },
      imageResults,
      suggestion:
        overallRisk === 'high'
          ? 'REJECT'
          : overallRisk === 'medium'
            ? 'HUMAN_REVIEW'
            : 'PASS',
    }

    return this.wrapResponse(result)
  }

  // 清除缓存（内部使用）
  clearCache() {
    resultCache.clear()
  }
}
