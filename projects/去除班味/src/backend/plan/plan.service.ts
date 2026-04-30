import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class PlanService {
  constructor(
    // @InjectRepository(PlanTemplate)
    // private planTemplateRepo: Repository<PlanTemplate>,
    // @InjectRepository(UserPlan)
    // private userPlanRepo: Repository<UserPlan>
  ) {}

  // 获取推荐方案
  async getRecommendPlans(detectId: string, userId: string) {
    // 根据检测结果匹配方案
    // 实际实现需要查询检测记录，然后根据元素匹配方案
    
    return [
      {
        id: 'PLAN_001',
        name: '5分钟工位急救术',
        category: 'DESK_TRANSFORM',
        categoryLabel: '工位改造',
        difficulty: 2,
        duration: 7,
        description: '快速整理工位，找回工作仪式感',
        matchReason: '因为检测到外卖盒+凌乱桌面',
        expectedEffect: { reduceScore: 15 },
        actions: [
          { day: 1, title: '清空桌面', description: '把所有东西放到箱子里', duration: '5分钟' },
          { day: 2, title: '分类收纳', description: '用收纳盒分类文件', duration: '5分钟' },
          { day: 3, title: '添加绿植', description: '放一盆小绿植', duration: '2分钟' }
        ]
      },
      {
        id: 'PLAN_002',
        name: '打工人自救指南',
        category: 'BODY_MIND',
        categoryLabel: '身心调节',
        difficulty: 3,
        duration: 14,
        description: '全方位身心调节，告别职业病',
        matchReason: '因为检测到黑眼圈+颈椎贴',
        expectedEffect: { reduceScore: 20 },
        actions: [
          { day: 1, title: '颈椎放松操', description: '每2小时做一组', duration: '3分钟' },
          { day: 2, title: '20-20-20护眼', description: '每20分钟看远处', duration: '1分钟' }
        ]
      }
    ]
  }

  // 选择方案
  async selectPlan(planId: string, userId: string, detectId: string) {
    const userPlanId = `UP_${Date.now()}`
    
    return {
      id: userPlanId,
      planId,
      userId,
      status: 'IN_PROGRESS',
      currentDay: 1,
      totalDays: 7,
      startedAt: new Date()
    }
  }

  // 打卡
  async checkIn(userPlanId: string, actionId: string, content?: string, imageUrl?: string) {
    return {
      id: `CI_${Date.now()}`,
      userPlanId,
      actionId,
      day: 1,
      status: 'COMPLETED',
      content,
      imageUrl,
      checkInAt: new Date()
    }
  }

  // 补卡
  async makeUp(userPlanId: string, day: number) {
    return {
      id: `CI_${Date.now()}`,
      userPlanId,
      day,
      status: 'MAKE_UP',
      checkInAt: new Date()
    }
  }

  // 获取我的方案列表
  async getMyPlans(userId: string, status?: string) {
    return {
      list: [],
      total: 0
    }
  }
}
