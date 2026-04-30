import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification } from '../src/entities/notification.entity'

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  private wrapResponse(data: any, message = 'success') {
    return {
      code: 0,
      message,
      data,
      requestId: `req_${Date.now()}`,
    }
  }

  async getNotifications(query: any, userId: string) {
    const { page = 1, limit = 20, type, isRead } = query
    const offset = (page - 1) * limit

    const qb = this.notificationRepo.createQueryBuilder('n')
      .leftJoinAndSelect('n.sender', 'sender')
      .where('n.userId = :userId', { userId })

    if (type) {
      qb.andWhere('n.type = :type', { type })
    }

    if (isRead !== undefined) {
      qb.andWhere('n.isRead = :isRead', { isRead: isRead === 'true' || isRead === true })
    }

    qb.orderBy('n.createdAt', 'DESC')
      .skip(offset)
      .take(limit)

    const [notifications, total] = await qb.getManyAndCount()

    const list = notifications.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      content: n.content,
      relatedId: n.relatedId,
      relatedType: n.relatedType,
      sender: n.sender
        ? { id: n.sender.id, nickname: n.sender.nickname, avatarUrl: n.sender.avatarUrl }
        : null,
      isRead: n.isRead,
      extra: n.extra,
      createdAt: n.createdAt,
    }))

    return this.wrapResponse({
      list,
      total,
      hasMore: offset + list.length < total,
      page: parseInt(page),
      limit: parseInt(limit),
    })
  }

  async markRead(id: string, userId: string) {
    await this.notificationRepo.update(
      { id, userId },
      { isRead: true }
    )
    return this.wrapResponse({ message: '已标记为已读' })
  }

  async markAllRead(userId: string) {
    await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true }
    )
    return this.wrapResponse({ message: '全部已读' })
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationRepo.count({
      where: { userId, isRead: false },
    })
    return this.wrapResponse({ count })
  }
}
