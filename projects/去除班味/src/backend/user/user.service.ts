import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../src/entities/user.entity'
import { UserAchievement } from '../src/entities/user-achievement.entity'
import { Notification } from '../src/entities/notification.entity'
import { InviteRelation } from '../src/entities/invite-relation.entity'

const LEVEL_CONFIG = [
  { level: 1, title: '职场小白', minExp: 0, maxExp: 99 },
  { level: 2, title: '班味学徒', minExp: 100, maxExp: 299 },
  { level: 3, title: '去味练习生', minExp: 300, maxExp: 599 },
  { level: 4, title: '班味斗士', minExp: 600, maxExp: 999 },
  { level: 5, title: '去味专家', minExp: 1000, maxExp: 1499 },
  { level: 6, title: '反卷先锋', minExp: 1500, maxExp: 2199 },
  { level: 7, title: '班味克星', minExp: 2200, maxExp: 2999 },
  { level: 8, title: '去味大师', minExp: 3000, maxExp: 3999 },
  { level: 9, title: '职场仙人', minExp: 4000, maxExp: 5499 },
  { level: 10, title: '班味免疫体', minExp: 5500, maxExp: Infinity },
]

const EXP_RULES = {
  detect: { value: 10, dailyLimit: 30 },
  share: { value: 5, dailyLimit: 15 },
  post: { value: 15, dailyLimit: 30 },
  receiveLike: { value: 2, dailyLimit: 20 },
  comment: { value: 3, dailyLimit: 15 },
  checkIn: { value: 10, dailyLimit: Infinity },
  streak7: { value: 50, dailyLimit: Infinity },
  invite: { value: 30, dailyLimit: Infinity },
  achievement: { value: 0, dailyLimit: Infinity }, // 动态值
}

const ACHIEVEMENTS = [
  { id: 'A001', name: '初次检测', description: '完成第一次班味检测', iconUrl: '', rewardExp: 20 },
  { id: 'A002', name: '班味学徒', description: '累计检测10次', iconUrl: '', rewardExp: 30 },
  { id: 'A003', name: '发帖先锋', description: '发布第一条帖子', iconUrl: '', rewardExp: 20 },
  { id: 'A004', name: '社交达人', description: '累计获得100个赞', iconUrl: '', rewardExp: 50 },
  { id: 'A005', name: '打卡狂魔', description: '连续打卡7天', iconUrl: '', rewardExp: 50 },
  { id: 'A006', name: '去味专家', description: '完成一个去班味方案', iconUrl: '', rewardExp: 50 },
  { id: 'A007', name: '裂变达人', description: '成功邀请3位好友', iconUrl: '', rewardExp: 30 },
  { id: 'A008', name: '班味免疫体', description: '达到Lv.10', iconUrl: '', rewardExp: 100 },
  { id: 'A009', name: '辣评鉴赏家', description: '收藏10个帖子', iconUrl: '', rewardExp: 30 },
  { id: 'A010', name: '工位改造师', description: '完成3个工位改造方案', iconUrl: '', rewardExp: 50 },
]

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserAchievement)
    private achievementRepo: Repository<UserAchievement>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(InviteRelation)
    private inviteRepo: Repository<InviteRelation>,
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

  // 获取用户信息
  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('用户不存在')

    return this.wrapResponse({
      id: user.id,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      level: user.level,
      exp: user.exp,
      checkInStreak: user.checkInStreak,
      totalDetections: user.totalDetections,
      totalPosts: user.totalPosts,
      totalLikes: user.totalLikes,
      inviteCode: user.inviteCode,
      profile: user.profile,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    })
  }

  // 更新用户信息
  async updateProfile(userId: string, body: any) {
    const { nickname, avatarUrl, gender } = body
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('用户不存在')

    if (nickname !== undefined) user.nickname = nickname
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl
    if (gender !== undefined) user.gender = gender

    await this.userRepo.save(user)
    return this.wrapResponse({ message: '更新成功' })
  }

  // 获取等级信息
  async getLevel(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('用户不存在')

    const current = LEVEL_CONFIG.find(l => user.exp >= l.minExp && user.exp <= l.maxExp) || LEVEL_CONFIG[9]
    const next = LEVEL_CONFIG.find(l => l.level === current.level + 1)

    return this.wrapResponse({
      level: current.level,
      title: current.title,
      exp: user.exp,
      nextExp: next ? next.minExp : null,
      nextTitle: next ? next.title : null,
      progress: next ? ((user.exp - current.minExp) / (next.minExp - current.minExp) * 100).toFixed(1) : 100,
    })
  }

  // 获取成就列表
  async getAchievements(userId: string) {
    const earned = await this.achievementRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })

    const earnedIds = new Set(earned.map(a => a.achievementId))

    const list = ACHIEVEMENTS.map(a => ({
      ...a,
      isEarned: earnedIds.has(a.id),
      earnedAt: earned.find(e => e.achievementId === a.id)?.createdAt || null,
    }))

    return this.wrapResponse({ list, total: earned.length })
  }

  // 获取用户统计
  async getStats(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('用户不存在')

    const inviteCount = await this.inviteRepo.count({ where: { inviterId: userId } })

    return this.wrapResponse({
      detectionCount: user.totalDetections,
      avgScore: user.profile?.avgScore || 0,
      streakDays: user.checkInStreak,
      levelProgress: await this.getLevelProgress(user),
      postCount: user.totalPosts,
      likeReceived: user.totalLikes,
      inviteCount,
    })
  }

  // 增加经验值
  async addExp(userId: string, type: keyof typeof EXP_RULES, extraValue?: number) {
    const rule = EXP_RULES[type]
    const value = extraValue || rule.value

    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) return false

    user.exp += value

    // 重新计算等级
    const newLevel = this.calculateLevel(user.exp)
    const oldLevel = user.level
    user.level = newLevel

    await this.userRepo.save(user)

    // 等级提升通知
    if (newLevel > oldLevel) {
      await this.sendNotification({
        userId,
        type: 'ACHIEVEMENT',
        title: '等级提升',
        content: `恭喜升级到 Lv.${newLevel}！`,
        relatedId: userId,
        relatedType: 'USER',
      })

      // 检查Lv.10成就
      if (newLevel === 10) {
        await this.grantAchievement(userId, 'A008')
      }
    }

    return true
  }

  // 授予成就
  async grantAchievement(userId: string, achievementId: string) {
    const achievementDef = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (!achievementDef) return false

    const exists = await this.achievementRepo.findOne({
      where: { userId, achievementId },
    })
    if (exists) return false

    const achievement = this.achievementRepo.create({
      id: this.generateId('ACH'),
      userId,
      achievementId,
      achievementName: achievementDef.name,
      iconUrl: achievementDef.iconUrl,
      description: achievementDef.description,
      rewardExp: achievementDef.rewardExp,
    })
    await this.achievementRepo.save(achievement)

    // 成就经验奖励
    await this.addExp(userId, 'achievement', achievementDef.rewardExp)

    // 发送成就通知
    await this.sendNotification({
      userId,
      type: 'ACHIEVEMENT',
      title: '获得成就',
      content: `恭喜获得「${achievementDef.name}」成就！`,
      relatedId: achievementId,
      relatedType: 'ACHIEVEMENT',
    })

    return true
  }

  // 检查并授予成就
  async checkAchievements(userId: string, trigger: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) return

    const earnedIds = new Set(
      (await this.achievementRepo.find({ where: { userId } })).map(a => a.achievementId)
    )

    // 初次检测
    if (trigger === 'detect' && user.totalDetections === 1 && !earnedIds.has('A001')) {
      await this.grantAchievement(userId, 'A001')
    }

    // 班味学徒
    if (trigger === 'detect' && user.totalDetections >= 10 && !earnedIds.has('A002')) {
      await this.grantAchievement(userId, 'A002')
    }

    // 发帖先锋
    if (trigger === 'post' && user.totalPosts === 1 && !earnedIds.has('A003')) {
      await this.grantAchievement(userId, 'A003')
    }

    // 社交达人
    if (trigger === 'like' && user.totalLikes >= 100 && !earnedIds.has('A004')) {
      await this.grantAchievement(userId, 'A004')
    }

    // 打卡狂魔（连续7天）
    if (trigger === 'checkin' && user.checkInStreak >= 7 && !earnedIds.has('A005')) {
      await this.grantAchievement(userId, 'A005')
    }

    // 裂变达人
    if (trigger === 'invite') {
      const inviteCount = await this.inviteRepo.count({ where: { inviterId: userId } })
      if (inviteCount >= 3 && !earnedIds.has('A007')) {
        await this.grantAchievement(userId, 'A007')
      }
    }
  }

  // 计算等级
  private calculateLevel(exp: number): number {
    for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
      if (exp >= LEVEL_CONFIG[i].minExp) {
        return LEVEL_CONFIG[i].level
      }
    }
    return 1
  }

  private async getLevelProgress(user: User) {
    const current = LEVEL_CONFIG.find(l => user.exp >= l.minExp && user.exp <= l.maxExp) || LEVEL_CONFIG[9]
    const next = LEVEL_CONFIG.find(l => l.level === current.level + 1)
    return {
      current: current.level,
      next: next?.level || null,
      currentExp: user.exp,
      nextExp: next?.minExp || null,
      progress: next
        ? parseFloat(((user.exp - current.minExp) / (next.minExp - current.minExp) * 100).toFixed(1))
        : 100,
    }
  }

  private async sendNotification(data: Partial<Notification>) {
    const notif = this.notificationRepo.create({
      id: this.generateId('NOTF'),
      ...data,
    } as Notification)
    await this.notificationRepo.save(notif)
  }
}
