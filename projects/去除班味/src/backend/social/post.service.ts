import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class PostService {
  constructor(
    // @InjectRepository(Post)
    // private postRepo: Repository<Post>,
    // @InjectRepository(Comment)
    // private commentRepo: Repository<Comment>
  ) {}

  // 获取帖子列表
  async getPosts(query: any) {
    const { page = 1, limit = 20, type = 'hot' } = query
    
    // Mock数据
    return {
      list: [
        {
          id: 'POST_001',
          userId: 'USER_001',
          text: '今天检测出班味浓度89分，腌入味了...',
          images: [],
          score: 89,
          level: '腌入味了',
          topicTags: ['#工位大赏'],
          likeCount: 128,
          commentCount: 45,
          collectCount: 12,
          viewCount: 1024,
          sortScore: 1280,
          createdAt: new Date()
        }
      ],
      total: 100,
      hasMore: true,
      page,
      limit
    }
  }

  // 发布帖子
  async createPost(body: any, userId: string) {
    const postId = `POST_${Date.now()}`
    
    // 异步启动AI审核
    this.startAIReview(postId, body.text, body.images)
    
    return {
      id: postId,
      status: 'PENDING',
      message: '帖子已提交，等待审核'
    }
  }

  // AI内容审核
  private async startAIReview(postId: string, text: string, images: string[]) {
    // 调用阿里云内容安全API
    // 实际实现需要接入阿里云SDK
    
    // 模拟审核结果
    const mockConfidence = Math.random()
    
    if (mockConfidence > 0.8) {
      // 高风险，直接拒绝
      console.log(`[PostReview] ${postId}: 高风险，已拒绝`)
    } else if (mockConfidence > 0.5) {
      // 中风险，进入人工复审队列
      console.log(`[PostReview] ${postId}: 中风险，进入人工复审队列`)
    } else {
      // 低风险，直接通过
      console.log(`[PostReview] ${postId}: 低风险，已通过`)
    }
  }

  // 点赞/取消点赞
  async toggleLike(postId: string, userId: string) {
    // 使用Redis Set记录点赞状态
    // 实际实现需要接入Redis
    return { isLiked: true, likeCount: 129 }
  }

  // 评论
  async addComment(postId: string, userId: string, content: string, parentId?: string) {
    return {
      id: `COMMENT_${Date.now()}`,
      postId,
      userId,
      content,
      parentId,
      likes: 0,
      createdAt: new Date()
    }
  }
}
