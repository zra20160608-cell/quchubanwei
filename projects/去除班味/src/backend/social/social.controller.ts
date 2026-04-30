import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { SocialService } from './social.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller()
@UseGuards(AuthGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // ========== 帖子模块 ==========

  // 获取帖子列表
  @Get('posts')
  getPosts(@Query() query: any, @Request() req) {
    return this.socialService.getPosts(query, req.userId)
  }

  // 获取帖子详情
  @Get('posts/:id')
  getPostDetail(@Param('id') id: string, @Request() req) {
    return this.socialService.getPostDetail(id, req.userId)
  }

  // 发布帖子
  @Post('posts')
  createPost(@Body() body: any, @Request() req) {
    return this.socialService.createPost(body, req.userId)
  }

  // 更新帖子
  @Put('posts/:id')
  updatePost(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.socialService.updatePost(id, body, req.userId)
  }

  // 删除帖子
  @Delete('posts/:id')
  deletePost(@Param('id') id: string, @Request() req) {
    return this.socialService.deletePost(id, req.userId)
  }

  // 点赞 / 取消点赞
  @Post('posts/:id/like')
  toggleLike(@Param('id') id: string, @Request() req) {
    return this.socialService.toggleLike(id, req.userId)
  }

  // 收藏 / 取消收藏
  @Post('posts/:id/collect')
  toggleCollect(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.socialService.toggleCollect(id, req.userId, body.folderName)
  }

  // ========== 评论模块 ==========

  // 评论列表
  @Get('posts/:id/comments')
  getComments(@Param('id') postId: string, @Query() query: any, @Request() req) {
    return this.socialService.getComments(postId, query, req.userId)
  }

  // 发表评论
  @Post('posts/:id/comments')
  addComment(@Param('id') postId: string, @Body() body: any, @Request() req) {
    return this.socialService.addComment(postId, req.userId, body)
  }

  // 删除评论
  @Delete('comments/:id')
  deleteComment(@Param('id') id: string, @Request() req) {
    return this.socialService.deleteComment(id, req.userId)
  }

  // ========== 话题模块 ==========

  // 话题列表
  @Get('topics')
  getTopics(@Query() query: any) {
    return this.socialService.getTopics(query)
  }

  // 话题详情
  @Get('topics/:id')
  getTopicDetail(@Param('id') id: string, @Query() query: any, @Request() req) {
    return this.socialService.getTopicDetail(id, query, req.userId)
  }

  // ========== 举报/搜索 ==========

  // 举报帖子
  @Post('posts/:id/report')
  reportPost(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.socialService.reportPost(id, req.userId, body)
  }

  // 搜索
  @Get('search')
  search(@Query() query: any, @Request() req) {
    return this.socialService.search(query, req.userId)
  }
}
