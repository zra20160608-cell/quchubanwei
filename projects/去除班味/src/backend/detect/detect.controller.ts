import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { DetectService } from './detect.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller('detect')
@UseGuards(AuthGuard)
export class DetectController {
  constructor(private readonly detectService: DetectService) {}

  // 获取OSS上传凭证
  @Get('upload-token')
  getUploadToken(@Query() query: any) {
    return this.detectService.getUploadToken(query)
  }

  // 创建检测任务
  @Post()
  createDetectTask(@Body() body: any, @Request() req) {
    return this.detectService.createTask(body, req.userId)
  }

  // 查询检测状态
  @Get(':id/status')
  getDetectStatus(@Param('id') id: string) {
    return this.detectService.getStatus(id)
  }

  // 获取检测报告
  @Get(':id/report')
  getDetectReport(@Param('id') id: string) {
    return this.detectService.getReport(id)
  }

  // 获取检测历史
  @Get('history')
  getDetectHistory(@Query() query: any, @Request() req) {
    return this.detectService.getHistory(req.userId, query)
  }

  // 生成分享海报
  @Post(':id/poster')
  generatePoster(@Param('id') id: string, @Body() body: any) {
    return this.detectService.generatePoster(id, body.style)
  }

  // 历史对比
  @Get('compare')
  getComparison(@Query('recordIds') recordIds: string[]) {
    return this.detectService.getComparison(recordIds)
  }
}
