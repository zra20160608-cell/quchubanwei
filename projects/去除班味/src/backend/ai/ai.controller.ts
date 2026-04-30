import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common'
import { AIService } from './ai.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller('ai')
@UseGuards(AuthGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  // 图像识别
  @Post('vision/analyze')
  visionAnalyze(@Body() body: any) {
    return this.aiService.visionAnalyze(body)
  }

  // 辣评生成
  @Post('comment/generate')
  generateComments(@Body() body: any) {
    return this.aiService.generateComments(body)
  }

  // 内容审核
  @Post('moderate')
  moderateContent(@Body() body: any) {
    return this.aiService.moderateContent(body)
  }
}
