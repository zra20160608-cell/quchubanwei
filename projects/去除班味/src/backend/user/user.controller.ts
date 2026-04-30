import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 获取用户信息
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.userId)
  }

  // 更新用户信息
  @Put('profile')
  updateProfile(@Body() body: any, @Request() req) {
    return this.userService.updateProfile(req.userId, body)
  }

  // 用户等级
  @Get('level')
  getLevel(@Request() req) {
    return this.userService.getLevel(req.userId)
  }

  // 用户成就
  @Get('achievements')
  getAchievements(@Request() req) {
    return this.userService.getAchievements(req.userId)
  }

  // 用户统计
  @Get('stats')
  getStats(@Request() req) {
    return this.userService.getStats(req.userId)
  }
}
