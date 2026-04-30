import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common'
import { PlanService } from './plan.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller('plans')
@UseGuards(AuthGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // 获取推荐方案
  @Get('recommend')
  getRecommendPlans(@Query('detectId') detectId: string, @Query('userId') userId: string) {
    return this.planService.getRecommendPlans(detectId, userId)
  }

  // 选择方案
  @Post()
  selectPlan(@Body() body: any, @Query('userId') userId: string) {
    return this.planService.selectPlan(body.planId, userId, body.detectId)
  }

  // 打卡
  @Post(':id/check-in')
  checkIn(@Param('id') id: string, @Body() body: any) {
    return this.planService.checkIn(id, body.actionId, body.content, body.imageUrl)
  }

  // 补卡
  @Post(':id/make-up')
  makeUp(@Param('id') id: string, @Body() body: any) {
    return this.planService.makeUp(id, body.day)
  }

  // 获取我的方案
  @Get()
  getMyPlans(@Query('userId') userId: string, @Query('status') status?: string) {
    return this.planService.getMyPlans(userId, status)
  }
}
