import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShareRecord } from '../src/entities/share-record.entity'
import { InviteRelation } from '../src/entities/invite-relation.entity'
import { User } from '../src/entities/user.entity'
import { Notification } from '../src/entities/notification.entity'

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(ShareRecord)
    private shareRepo: Repository<ShareRecord>,
    @InjectRepository(InviteRelation)
    private inviteRepo: Repository<InviteRelation>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
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

  // 记录分享
  async recordShare(body: any, userId: string) {
    const { type, channel, contentType, contentId } = body

    const record = this.shareRepo.create({
      id: this.generateId('SHR'),
      userId,
      type,
      channel,
      contentType,
      contentId,
    })
    await this.shareRepo.save(record)

    return this.wrapResponse({ shareId: record.id, message: '分享已记录' })
  }

  // 生成邀请码（若不存在则生成）
  async getInviteCode(userId: string) {
    let user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) {
      return this.wrapResponse(null, '用户不存在')
    }

    if (!user.inviteCode) {
      user.inviteCode = this.generateInviteCode()
      await this.userRepo.save(user)
    }

    return this.wrapResponse({ inviteCode: user.inviteCode })
  }

  // 邀请统计
  async getInviteStats(userId: string) {
    const inviteCount = await this.inviteRepo.count({ where: { inviterId: userId } })
    const rewardCount = await this.inviteRepo.count({ where: { inviterId: userId, isRewarded: true } })
    const totalRewardExp = await this.inviteRepo.sum('rewardExp', { inviterId: userId }) || 0

    return this.wrapResponse({
      inviteCount,
      rewardCount,
      totalRewardExp,
    })
  }

  // 我的邀请列表
  async getMyInvites(query: any, userId: string) {
    const { page = 1, limit = 20 } = query
    const offset = (page - 1) * limit

    const [invites, total] = await this.inviteRepo.findAndCount({
      where: { inviterId: userId },
      relations: ['invitee'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    })

    return this.wrapResponse({
      list: invites.map(i => ({
        id: i.id,
        inviteeId: i.inviteeId,
        invitee: i.invitee
          ? { id: i.invitee.id, nickname: i.invitee.nickname, avatarUrl: i.invitee.avatarUrl }
          : null,
        inviteCode: i.inviteCode,
        isRewarded: i.isRewarded,
        rewardExp: i.rewardExp,
        createdAt: i.createdAt,
      })),
      total,
      hasMore: offset + invites.length < total,
      page: parseInt(page),
      limit: parseInt(limit),
    })
  }

  // 验证邀请码并建立邀请关系
  async verifyAndBindInvite(inviteeId: string, inviteCode: string) {
    const inviter = await this.userRepo.findOne({ where: { inviteCode } })
    if (!inviter || inviter.id === inviteeId) {
      return { success: false, message: '邀请码无效' }
    }

    // 检查是否已绑定
    const exists = await this.inviteRepo.findOne({
      where: { inviteeId },
    })
    if (exists) {
      return { success: false, message: '您已绑定过邀请人' }
    }

    const relation = this.inviteRepo.create({
      id: this.generateId('INV'),
      inviterId: inviter.id,
      inviteeId,
      inviteCode,
      inviteChannel: 'wechat',
    })
    await this.inviteRepo.save(relation)

    // 更新被邀请人的邀请人
    await this.userRepo.update(inviteeId, { invitedBy: inviter.id })

    // 发送邀请通知
    const notif = this.notificationRepo.create({
      id: this.generateId('NOTF'),
      userId: inviter.id,
      type: 'INVITE',
      title: '邀请通知',
      content: '有新用户通过您的邀请码加入了',
      relatedId: inviteeId,
      relatedType: 'USER',
    })
    await this.notificationRepo.save(notif)

    return { success: true, inviterId: inviter.id }
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = 'BW'
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }
}
