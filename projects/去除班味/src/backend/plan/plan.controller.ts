import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { PlanService } from './plan.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller('plans')
@UseGuards(AuthGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // 获取推荐方案
  @Get('recommend')
  getRecommendPlans(@Query('detectId') detectId: string, @Request() req) {
    return this.planService.getRecommendPlans(detectId, req.userId)
  }

  // 选择方案
  @Post()
  selectPlan(@Body() body: any, @Request() req) {
    return this.planService.selectPlan(body.planId, req.userId, body.detectId)
  }

  // 获取我的方案
  @Get()
  getMyPlans(@Request() req, @Query('status') status?: string) {
    return this.planService.getMyPlans(req.userId, status)
  }

  // 获取方案详情
  @Get(':id')
  getPlanDetail(@Param('id') id: string) {
    return this.planService.getPlanDetail(id)
  }

  // 打卡
  @Post(':id/check-in')
  checkIn(@Param('id') id: string, @Body() body: any) {
    return this.planService.checkIn(id, body.actionId, body.content, body.imageUrl)
  }

  // 获取打卡记录
  @Get(':id/check-ins')
  getCheckIns(@Param('id') id: string) {
    return this.planService.getCheckIns(id)
  }

  // 补卡
  @Post(':id/make-up')
  makeUp(@Param('id') id: string, @Body() body: any) {
    return this.planService.makeUp(id, body.day)
  }

  // 放弃方案
  @Put(':id/abandon')
  abandonPlan(@Param('id') id: string, @Body() body: any) {
    return this.planService.abandon(id, body.reason)
  }

  // 完成复测
  @Post(':id/retest')
  retestPlan(@Param('id') id: string, @Body() body: any) {
    return this.planService.retest(id, body.detectId)
  }
}
