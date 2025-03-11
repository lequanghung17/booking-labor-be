// nest-server/src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UsersService } from 'src/users/users.service';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationType } from 'src/enum/Notification.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private notificationsGateway: NotificationsGateway,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly usersService: UsersService,
  ) {}

  async test(user_id: number) {
    // Emit thông báo
    const user = await this.usersService.findById(user_id);

    const notification = this.notificationRepository.create({
      id: user.id,
      message: 'Test notification',
      link: 'https://example.com',
      isRead: false,
      type: NotificationType.MESSAGE,
      user: user,
    });

    this.notificationsGateway.emitNotification(user.id, notification);

    return notification;
  }

  async sendToUser(notificationDto: CreateNotificationDto) {
    // Lưu vào database
    const newNotification = this.notificationRepository.create(notificationDto);
    const notification =
      await this.notificationRepository.save(newNotification);

    // Emit thông báo
    this.notificationsGateway.emitNotification(
      notificationDto.user_id,
      notification,
    );

    return newNotification;
  }

  // Lấy tất cả notification của một user
  async findAll(userId: number) {
    return this.notificationRepository.find({
      where: { user_id: userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Đánh dấu notification đã đọc
  async markAsRead(id: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (notification.user_id !== userId) {
      throw new Error('You do not have permission to access this notification');
    }

    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }

  // Đánh dấu tất cả notification của một user đã đọc
  async markAllAsRead(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: { user_id: userId },
    });

    notifications.forEach((notification) => {
      notification.isRead = true;
    });

    return await this.notificationRepository.save(notifications);
  }

  // Xóa một notification
  async remove(id: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (notification.user_id !== userId) {
      throw new Error('You do not have permission to access this notification');
    }

    return await this.notificationRepository.remove(notification);
  }

  // Xóa tất cả notification của một user
  async removeAll(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: { user_id: userId },
    });

    return await this.notificationRepository.remove(notifications);
  }

  // Xóa tất cả notification
  async removeAllNotifications() {
    return await this.notificationRepository.clear();
  }
}
