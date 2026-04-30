import {
  Controller,
  Get,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { NotificationService } from './notification.service'
import { AuthGuard } from '../auth/auth.guard'

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // 获取通知列表
  @Get()
  getNotifications(@Query() query: any, @Request() req) {
    return this.notificationService.getNotifications(query, req.userId)
  }

  // 标记单条已读
  @Put(':id/read')
  markRead(@Query('id') id: string, @Request() req) {
    return this.notificationService.markRead(id, req.userId)
  }

  // 全部已读
  @Put('read-all')
  markAllRead(@Request() req) {
    return this.notificationService.markAllRead(req.userId)
  }

  // 获取未读数
  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.userId)
  }
}
