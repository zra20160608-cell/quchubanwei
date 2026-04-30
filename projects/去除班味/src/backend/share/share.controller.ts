import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ShareService } from './share.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller()
@UseGuards(AuthGuard)
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  // 记录分享
  @Post('share/record')
  recordShare(@Body() body: any, @Request() req) {
    return this.shareService.recordShare(body, req.userId)
  }

  // 获取邀请码
  @Get('invite/code')
  getInviteCode(@Request() req) {
    return this.shareService.getInviteCode(req.userId)
  }

  // 获取邀请统计
  @Get('invite/stats')
  getInviteStats(@Request() req) {
    return this.shareService.getInviteStats(req.userId)
  }

  // 获取我的邀请列表
  @Get('invite/list')
  getMyInvites(@Query() query: any, @Request() req) {
    return this.shareService.getMyInvites(query, req.userId)
  }
}
