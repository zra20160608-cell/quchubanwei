import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Post } from '../src/entities/post.entity'
import { Comment } from '../src/entities/comment.entity'
import { Like } from '../src/entities/like.entity'
import { Collection } from '../src/entities/collection.entity'
import { Topic } from '../src/entities/topic.entity'
import { Report } from '../src/entities/report.entity'
import { Notification } from '../src/entities/notification.entity'
import { User } from '../src/entities/user.entity'

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,
    @InjectRepository(Topic)
    private topicRepo: Repository<Topic>,
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
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

  // ========== 帖子模块 ==========

  // 信息流推荐算法：热度排序 + 时间排序
  async getPosts(query: any, userId: string) {
    const { page = 1, limit = 20, sort = 'hot', tag, type = 'feed' } = query
    const offset = (page - 1) * limit

    const qb = this.postRepo.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.status = :status', { status: 'APPROVED' })
      .andWhere('post.isAnonymous = false OR post.userId = :userId', { userId })

    if (tag) {
      qb.andWhere(`post.topicTags @> :tag::jsonb`, { tag: JSON.stringify([tag]) })
    }

    if (type === 'following') {
      // 这里可以实现关注逻辑
    }

    if (sort === 'hot') {
      // 热度排序：sortScore 降序
      qb.orderBy('post.sortScore', 'DESC')
        .addOrderBy('post.publishedAt', 'DESC')
    } else {
      // 时间排序
      qb.orderBy('post.publishedAt', 'DESC')
    }

    qb.skip(offset).take(limit)

    const [posts, total] = await qb.getManyAndCount()

    // 查询当前用户的点赞/收藏状态
    const postIds = posts.map(p => p.id)
    const [likedMap, collectedMap] = await Promise.all([
      this.getUserLikedMap(userId, postIds),
      this.getUserCollectedMap(userId, postIds),
    ])

    const list = posts.map(post => ({
      id: post.id,
      userId: post.userId,
      author: post.isAnonymous
        ? { id: 'anonymous', nickname: '匿名用户', avatarUrl: '' }
        : { id: post.user?.id, nickname: post.user?.nickname, avatarUrl: post.user?.avatarUrl },
      type: post.type,
      text: post.text,
      images: post.images,
      topicTags: post.topicTags,
      detectReportId: post.detectReportId,
      isAnonymous: post.isAnonymous,
      isPinned: post.isPinned,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      collectCount: post.collectCount,
      shareCount: post.shareCount,
      viewCount: post.viewCount,
      sortScore: post.sortScore,
      isLiked: likedMap[post.id] || false,
      isCollected: collectedMap[post.id] || false,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
    }))

    return this.wrapResponse({
      list,
      total,
      hasMore: offset + list.length < total,
      page: parseInt(page),
      limit: parseInt(limit),
    })
  }

  async getPostDetail(id: string, userId: string) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!post) throw new NotFoundException('帖子不存在')

    // 增加浏览数
    post.viewCount += 1
    await this.postRepo.save(post)

    const liked = await this.likeRepo.findOne({ where: { postId: id, userId } })
    const collected = await this.collectionRepo.findOne({ where: { postId: id, userId } })

    return this.wrapResponse({
      id: post.id,
      userId: post.userId,
      author: post.isAnonymous
        ? { id: 'anonymous', nickname: '匿名用户', avatarUrl: '' }
        : { id: post.user?.id, nickname: post.user?.nickname, avatarUrl: post.user?.avatarUrl },
      type: post.type,
      status: post.status,
      text: post.text,
      images: post.images,
      topicTags: post.topicTags,
      detectReportId: post.detectReportId,
      isAnonymous: post.isAnonymous,
      isPinned: post.isPinned,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      collectCount: post.collectCount,
      shareCount: post.shareCount,
      viewCount: post.viewCount,
      isLiked: !!liked,
      isCollected: !!collected,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
    })
  }

  async createPost(body: any, userId: string) {
    const { content, images = [], tags = [], isAnonymous = false, detectId } = body

    const postId = this.generateId('POST')
    const now = new Date()

    const post = this.postRepo.create({
      id: postId,
      userId,
      type: 'POST',
      status: 'AI_REVIEWING',
      text: content,
      images,
      topicTags: tags,
      detectReportId: detectId || null,
      isAnonymous,
      publishedAt: now,
      sortScore: 0,
    })

    await this.postRepo.save(post)

    // 异步启动AI审核
    this.startAIReview(postId, content, images)

    // 更新用户发帖数
    await this.userRepo.increment({ id: userId }, 'totalPosts', 1)

    return this.wrapResponse({
      id: postId,
      status: 'AI_REVIEWING',
      message: '帖子已提交，等待AI审核',
    })
  }

  async updatePost(id: string, body: any, userId: string) {
    const post = await this.postRepo.findOne({ where: { id } })
    if (!post) throw new NotFoundException('帖子不存在')
    if (post.userId !== userId) throw new ForbiddenException('无权修改他人帖子')

    post.text = body.content ?? post.text
    post.images = body.images ?? post.images
    post.topicTags = body.tags ?? post.topicTags
    post.isAnonymous = body.isAnonymous ?? post.isAnonymous

    await this.postRepo.save(post)
    return this.wrapResponse({ id, message: '更新成功' })
  }

  async deletePost(id: string, userId: string) {
    const post = await this.postRepo.findOne({ where: { id } })
    if (!post) throw new NotFoundException('帖子不存在')
    if (post.userId !== userId) throw new ForbiddenException('无权删除他人帖子')

    await this.postRepo.remove(post)
    return this.wrapResponse({ message: '删除成功' })
  }

  // 点赞 / 取消点赞
  async toggleLike(postId: string, userId: string) {
    const existing = await this.likeRepo.findOne({ where: { postId, userId } })

    if (existing) {
      await this.likeRepo.remove(existing)
      await this.postRepo.decrement({ id: postId }, 'likeCount', 1)
      return this.wrapResponse({ isLiked: false, likeCount: (await this.postRepo.findOne({ where: { id: postId } }))?.likeCount ?? 0 })
    } else {
      const like = this.likeRepo.create({
        id: this.generateId('LIKE'),
        postId,
        userId,
      })
      await this.likeRepo.save(like)
      await this.postRepo.increment({ id: postId }, 'likeCount', 1)

      // 发送点赞通知
      const post = await this.postRepo.findOne({ where: { id: postId } })
      if (post && post.userId !== userId) {
        await this.createNotification({
          userId: post.userId,
          type: 'LIKE',
          title: '点赞通知',
          content: '有人赞了你的帖子',
          relatedId: postId,
          relatedType: 'POST',
          senderId: userId,
        })
      }

      return this.wrapResponse({ isLiked: true, likeCount: (await this.postRepo.findOne({ where: { id: postId } }))?.likeCount ?? 0 })
    }
  }

  // 收藏 / 取消收藏
  async toggleCollect(postId: string, userId: string, folderName?: string) {
    const existing = await this.collectionRepo.findOne({ where: { postId, userId } })

    if (existing) {
      await this.collectionRepo.remove(existing)
      await this.postRepo.decrement({ id: postId }, 'collectCount', 1)
      return this.wrapResponse({ isCollected: false, collectCount: (await this.postRepo.findOne({ where: { id: postId } }))?.collectCount ?? 0 })
    } else {
      const collect = this.collectionRepo.create({
        id: this.generateId('COL'),
        postId,
        userId,
        folderName: folderName || '默认收藏夹',
      })
      await this.collectionRepo.save(collect)
      await this.postRepo.increment({ id: postId }, 'collectCount', 1)
      return this.wrapResponse({ isCollected: true, collectCount: (await this.postRepo.findOne({ where: { id: postId } }))?.collectCount ?? 0 })
    }
  }

  // ========== 评论模块 ==========

  async getComments(postId: string, query: any, userId: string) {
    const { page = 1, limit = 20 } = query
    const offset = (page - 1) * limit

    const [comments, total] = await this.commentRepo.findAndCount({
      where: { postId, parentId: null, isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    })

    // 获取每条评论的回复
    const list = await Promise.all(comments.map(async (c) => {
      const replies = await this.commentRepo.find({
        where: { parentId: c.id, isDeleted: false },
        relations: ['user'],
        order: { createdAt: 'ASC' },
        take: 3,
      })

      return {
        id: c.id,
        userId: c.userId,
        author: { id: c.user?.id, nickname: c.user?.nickname, avatarUrl: c.user?.avatarUrl },
        content: c.content,
        likeCount: c.likeCount,
        replyCount: await this.commentRepo.count({ where: { parentId: c.id, isDeleted: false } }),
        replies: replies.map(r => ({
          id: r.id,
          userId: r.userId,
          author: { id: r.user?.id, nickname: r.user?.nickname, avatarUrl: r.user?.avatarUrl },
          content: r.content,
          likeCount: r.likeCount,
          createdAt: r.createdAt,
        })),
        createdAt: c.createdAt,
      }
    }))

    return this.wrapResponse({
      list,
      total,
      hasMore: offset + list.length < total,
      page: parseInt(page),
      limit: parseInt(limit),
    })
  }

  async addComment(postId: string, userId: string, body: any) {
    const { content, parentId } = body
    if (!content?.trim()) {
      return this.wrapResponse(null, '评论内容不能为空')
    }

    const commentId = this.generateId('CMT')
    const comment = this.commentRepo.create({
      id: commentId,
      postId,
      userId,
      parentId: parentId || null,
      content: content.trim(),
    })
    await this.commentRepo.save(comment)

    // 更新帖子评论数
    await this.postRepo.increment({ id: postId }, 'commentCount', 1)

    // 发送评论通知
    const post = await this.postRepo.findOne({ where: { id: postId } })
    if (post && post.userId !== userId) {
      await this.createNotification({
        userId: post.userId,
        type: 'COMMENT',
        title: '评论通知',
        content: `有人评论了你的帖子：${content.substring(0, 50)}`,
        relatedId: postId,
        relatedType: 'POST',
        senderId: userId,
      })
    }

    return this.wrapResponse({
      id: commentId,
      postId,
      userId,
      content,
      parentId,
      createdAt: comment.createdAt,
    })
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.commentRepo.findOne({ where: { id } })
    if (!comment) throw new NotFoundException('评论不存在')
    if (comment.userId !== userId) throw new ForbiddenException('无权删除他人评论')

    comment.isDeleted = true
    await this.commentRepo.save(comment)

    // 减少帖子评论数
    await this.postRepo.decrement({ id: comment.postId }, 'commentCount', 1)

    return this.wrapResponse({ message: '删除成功' })
  }

  // ========== 话题模块 ==========

  async getTopics(query: any) {
    const { page = 1, limit = 50 } = query
    const offset = (page - 1) * limit

    const [topics, total] = await this.topicRepo.findAndCount({
      where: { isActive: true },
      order: { sortOrder: 'DESC', postCount: 'DESC' },
      skip: offset,
      take: limit,
    })

    return this.wrapResponse({
      list: topics.map(t => ({
        id: t.id,
        name: t.name,
        displayName: t.displayName,
        description: t.description,
        coverUrl: t.coverUrl,
        postCount: t.postCount,
        viewCount: t.viewCount,
      })),
      total,
      hasMore: offset + topics.length < total,
      page: parseInt(page),
      limit: parseInt(limit),
    })
  }

  async getTopicDetail(id: string, query: any, userId: string) {
    const topic = await this.topicRepo.findOne({ where: { id } })
    if (!topic) throw new NotFoundException('话题不存在')

    // 话题下的帖子
    const postsResult = await this.getPosts({ ...query, tag: topic.name }, userId)

    return this.wrapResponse({
      id: topic.id,
      name: topic.name,
      displayName: topic.displayName,
      description: topic.description,
      coverUrl: topic.coverUrl,
      postCount: topic.postCount,
      viewCount: topic.viewCount,
      posts: postsResult.data,
    })
  }

  // ========== 举报/搜索 ==========

  async reportPost(postId: string, userId: string, body: any) {
    const { reasonType, reasonText } = body
    const report = this.reportRepo.create({
      id: this.generateId('RPT'),
      reporterId: userId,
      targetId: postId,
      targetType: 'POST',
      reasonType,
      reasonText,
    })
    await this.reportRepo.save(report)
    return this.wrapResponse({ message: '举报已提交，我们会尽快处理' })
  }

  async search(query: any, userId: string) {
    const { q, type = 'post', page = 1, limit = 20 } = query
    const offset = (page - 1) * limit

    if (type === 'post') {
      const [posts, total] = await this.postRepo.findAndCount({
        where: { status: 'APPROVED' },
        order: { publishedAt: 'DESC' },
        skip: offset,
        take: limit,
      })

      const postIds = posts.map(p => p.id)
      const likedMap = await this.getUserLikedMap(userId, postIds)

      return this.wrapResponse({
        list: posts.map(p => ({
          id: p.id,
          text: p.text,
          images: p.images,
          topicTags: p.topicTags,
          likeCount: p.likeCount,
          commentCount: p.commentCount,
          isLiked: likedMap[p.id] || false,
          publishedAt: p.publishedAt,
        })),
        total,
        hasMore: offset + posts.length < total,
        page: parseInt(page),
        limit: parseInt(limit),
      })
    }

    if (type === 'topic') {
      const [topics, total] = await this.topicRepo.findAndCount({
        where: { isActive: true },
        skip: offset,
        take: limit,
      })

      return this.wrapResponse({
        list: topics,
        total,
        hasMore: offset + topics.length < total,
        page: parseInt(page),
        limit: parseInt(limit),
      })
    }

    return this.wrapResponse({ list: [], total: 0, hasMore: false, page, limit })
  }

  // ========== 内部工具 ==========

  private async getUserLikedMap(userId: string, postIds: string[]): Promise<Record<string, boolean>> {
    if (!postIds.length) return {}
    const likes = await this.likeRepo.find({ where: { userId, postId: In(postIds) } })
    const map: Record<string, boolean> = {}
    likes.forEach(l => { map[l.postId] = true })
    return map
  }

  private async getUserCollectedMap(userId: string, postIds: string[]): Promise<Record<string, boolean>> {
    if (!postIds.length) return {}
    const cols = await this.collectionRepo.find({ where: { userId, postId: In(postIds) } })
    const map: Record<string, boolean> = {}
    cols.forEach(c => { map[c.postId] = true })
    return map
  }

  private async createNotification(data: Partial<Notification>) {
    const notif = this.notificationRepo.create({
      id: this.generateId('NOTF'),
      ...data,
    } as Notification)
    await this.notificationRepo.save(notif)
  }

  // AI内容审核
  private async startAIReview(postId: string, text: string, images: string[]) {
    // 模拟审核流程
    const mockConfidence = Math.random()
    let status = 'APPROVED'

    if (mockConfidence > 0.8) {
      status = 'REJECTED'
    } else if (mockConfidence > 0.5) {
      status = 'HUMAN_REVIEW'
    }

    // 更新帖子状态
    const post = await this.postRepo.findOne({ where: { id: postId } })
    if (post) {
      post.status = status
      if (status === 'APPROVED') {
        // 计算初始热度分
        post.sortScore = this.calculateHotScore(post)
      }
      await this.postRepo.save(post)
    }

    console.log(`[PostReview] ${postId}: ${status}, confidence=${mockConfidence.toFixed(2)}`)
  }

  // 热度分计算算法
  private calculateHotScore(post: Post): number {
    const now = Date.now()
    const published = new Date(post.publishedAt || post.createdAt).getTime()
    const hoursSince = Math.max(0, (now - published) / 3600000)

    // 衰减系数：每24小时衰减为原来的0.9
    const decayFactor = Math.pow(0.9, hoursSince / 24)

    // 互动加权
    const engagement =
      post.likeCount * 2 +
      post.commentCount * 3 +
      post.collectCount * 4 +
      post.shareCount * 5 +
      post.viewCount * 0.1

    return parseFloat((engagement * decayFactor).toFixed(4))
  }
}
