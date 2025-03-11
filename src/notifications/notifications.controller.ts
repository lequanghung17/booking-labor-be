import {
  Controller,
  Sse,
  Param,
  UseGuards,
  Get,
  Req,
  Patch,
  Delete,
  Post,
  Body,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { AuthRequest } from 'src/auth/interface/auth-request.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType } from 'src/enum/Notification.enum';
@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('test')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Test notification' })
  test(@Req() req: AuthRequest) {
    const notificationDto = {
      user_id: req.user.user_id,
      message: 'Test notification',
      type: NotificationType.MESSAGE,
      link: 'https://example.com',
    };
    console.log(notificationDto);
    return this.notificationsService.sendToUser(notificationDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all notifications for user' })
  findAll(@Req() req: AuthRequest) {
    return this.notificationsService.findAll(req.user.user_id);
  }

  @Patch(':notification_id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markAsRead(
    @Param('notification_id') notification_id: string,
    @Req() req: AuthRequest,
  ) {
    return this.notificationsService.markAsRead(
      +notification_id,
      req.user.user_id,
    );
  }

  @Patch()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Req() req: AuthRequest) {
    return this.notificationsService.markAllAsRead(req.user.user_id);
  }

  @Delete(':notification_id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a notification' })
  delete(
    @Param('notification_id') notification_id: string,
    @Req() req: AuthRequest,
  ) {
    return this.notificationsService.remove(+notification_id, req.user.user_id);
  }

  @Delete('')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete all notifications' })
  deleteAll(@Req() req: AuthRequest) {
    return this.notificationsService.removeAll(req.user.user_id);
  }
}
