import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlanTemplate } from '../src/entities/plan-template.entity'
import { UserPlan } from '../src/entities/user-plan.entity'
import { CheckInRecord } from '../src/entities/check-in-record.entity'
import { DetectionRecord } from '../src/entities/detection-record.entity'
import { User } from '../src/entities/user.entity'

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanTemplate)
    private planTemplateRepo: Repository<PlanTemplate>,
    @InjectRepository(UserPlan)
    private userPlanRepo: Repository<UserPlan>,
    @InjectRepository(CheckInRecord)
    private checkInRepo: Repository<CheckInRecord>,
    @InjectRepository(DetectionRecord)
    private detectionRepo: Repository<DetectionRecord>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  }

  private wrapResponse(data: any, message = 'success') {
    return {
      code: 0,
      message,
      data,
      requestId: `req_${Date.now()}`,
    }
  }

  // 获取推荐方案
  async getRecommendPlans(detectId: string, userId: string) {
    const detectRecord = await this.detectionRepo.findOne({ where: { id: detectId, userId } })
    const templates = await this.planTemplateRepo.find({ where: { isActive: true } })

    // 根据检测元素匹配方案
    const recommended = templates.map(t => {
      let matchScore = 0
      let matchReason = ''

      if (detectRecord?.elements) {
        detectRecord.elements.forEach(el => {
          const rule = t.matchRules.find(r => r.elementId === el.id)
          if (rule) {
            matchScore += rule.weight
          }
        })
      }

      if (matchScore > 0) {
        matchReason = `因为检测到${detectRecord.elements.slice(0, 2).map(e => e.name).join('、')}等班味元素`
      } else {
        matchReason = '综合推荐，适合大多数打工人'
      }

      return {
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
        difficulty: t.actions.length > 10 ? 3 : t.actions.length > 5 ? 2 : 1,
        duration: t.totalDays,
        matchReason,
        expectedEffect: t.expectedEffect,
        actions: t.actions.slice(0, 3),
        matchScore,
      }
    }).sort((a, b) => b.matchScore - a.matchScore)

    return this.wrapResponse(recommended.slice(0, 5))
  }

  // 选择方案
  async selectPlan(planTemplateId: string, userId: string, detectId?: string) {
    const template = await this.planTemplateRepo.findOne({ where: { id: planTemplateId } })
    if (!template) throw new NotFoundException('方案模板不存在')

    const userPlanId = this.generateId('UP')
    const now = new Date()

    const userPlan = this.userPlanRepo.create({
      id: userPlanId,
      userId,
      planTemplateId,
      planName: template.name,
      category: template.category,
      status: 'IN_PROGRESS',
      currentDay: 1,
      totalDays: template.totalDays,
      detectBeforeId: detectId || null,
      startedAt: now,
      endedAt: new Date(now.getTime() + template.totalDays * 24 * 60 * 60 * 1000),
    })

    await this.userPlanRepo.save(userPlan)

    return this.wrapResponse({
      id: userPlanId,
      planId: planTemplateId,
      userId,
      status: 'IN_PROGRESS',
      currentDay: 1,
      totalDays: template.totalDays,
      startedAt: now,
    })
  }

  // 打卡
  async checkIn(userPlanId: string, actionId: string, content?: string, imageUrl?: string) {
    const userPlan = await this.userPlanRepo.findOne({ where: { id: userPlanId } })
    if (!userPlan) throw new NotFoundException('方案不存在')

    const dayNumber = userPlan.currentDay
    const checkInId = this.generateId('CI')

    const checkIn = this.checkInRepo.create({
      id: checkInId,
      userId: userPlan.userId,
      userPlanId,
      actionId,
      dayNumber,
      content,
      imageUrl,
      expEarned: 10,
    })

    await this.checkInRepo.save(checkIn)

    // 更新方案进度
    userPlan.currentDay = dayNumber + 1
    userPlan.completedDays += 1
    await this.userPlanRepo.save(userPlan)

    // 更新用户连续打卡天数
    await this.userRepo.increment({ id: userPlan.userId }, 'checkInStreak', 1)

    return this.wrapResponse({
      id: checkInId,
      userPlanId,
      actionId,
      day: dayNumber,
      status: 'COMPLETED',
      content,
      imageUrl,
      checkInAt: checkIn.createdAt,
    })
  }

  // 补卡
  async makeUp(userPlanId: string, day: number) {
    const userPlan = await this.userPlanRepo.findOne({ where: { id: userPlanId } })
    if (!userPlan) throw new NotFoundException('方案不存在')

    const checkInId = this.generateId('CI')
    const checkIn = this.checkInRepo.create({
      id: checkInId,
      userId: userPlan.userId,
      userPlanId,
      actionId: 'makeup',
      dayNumber: day,
      isMakeUp: true,
      expEarned: 5,
    })

    await this.checkInRepo.save(checkIn)

    userPlan.makeUpDays += 1
    await this.userPlanRepo.save(userPlan)

    return this.wrapResponse({
      id: checkInId,
      userPlanId,
      day,
      status: 'MAKE_UP',
      checkInAt: checkIn.createdAt,
    })
  }

  // 获取我的方案列表
  async getMyPlans(userId: string, status?: string) {
    const where: any = { userId }
    if (status) where.status = status

    const [plans, total] = await this.userPlanRepo.findAndCount({
      where,
      relations: ['planTemplate'],
      order: { createdAt: 'DESC' },
    })

    return this.wrapResponse({
      list: plans.map(p => ({
        id: p.id,
        planId: p.planTemplateId,
        planName: p.planName,
        category: p.category,
        status: p.status,
        currentDay: p.currentDay,
        totalDays: p.totalDays,
        completedDays: p.completedDays,
        missedDays: p.missedDays,
        makeUpDays: p.makeUpDays,
        startedAt: p.startedAt,
        endedAt: p.endedAt,
      })),
      total,
    })
  }

  // 获取打卡记录
  async getCheckIns(userPlanId: string) {
    const records = await this.checkInRepo.find({
      where: { userPlanId },
      order: { dayNumber: 'ASC' },
    })

    return this.wrapResponse({
      list: records.map(r => ({
        id: r.id,
        actionId: r.actionId,
        dayNumber: r.dayNumber,
        content: r.content,
        imageUrl: r.imageUrl,
        mood: r.mood,
        isMakeUp: r.isMakeUp,
        expEarned: r.expEarned,
        createdAt: r.createdAt,
      })),
    })
  }

  // 放弃方案
  async abandon(userPlanId: string, reason?: string) {
    const userPlan = await this.userPlanRepo.findOne({ where: { id: userPlanId } })
    if (!userPlan) throw new NotFoundException('方案不存在')

    userPlan.status = 'ABANDONED'
    await this.userPlanRepo.save(userPlan)

    return this.wrapResponse({ id: userPlanId, status: 'ABANDONED', reason })
  }

  // 完成复测
  async retest(userPlanId: string, detectId: string) {
    const userPlan = await this.userPlanRepo.findOne({
      where: { id: userPlanId },
      relations: ['detectBefore', 'detectAfter'],
    })
    if (!userPlan) throw new NotFoundException('方案不存在')

    const detectAfter = await this.detectionRepo.findOne({ where: { id: detectId } })
    if (!detectAfter) throw new NotFoundException('检测记录不存在')

    userPlan.detectAfterId = detectId
    userPlan.status = 'COMPLETED'
    userPlan.completedAt = new Date()
    await this.userPlanRepo.save(userPlan)

    const beforeScore = userPlan.detectBefore?.score || 0
    const afterScore = detectAfter.score
    const change = afterScore - beforeScore
    const changePercent = beforeScore > 0 ? Math.round((change / beforeScore) * 100) : 0

    let grade = 'BRONZE'
    if (changePercent <= -30) grade = 'GOLD'
    else if (changePercent <= -15) grade = 'SILVER'

    return this.wrapResponse({
      originalScore: beforeScore,
      newScore: afterScore,
      change,
      changePercent,
      grade,
      message: change < 0 ? '恭喜！班味浓度有所下降' : '班味浓度略有上升，别灰心，继续加油！',
    })
  }
}
