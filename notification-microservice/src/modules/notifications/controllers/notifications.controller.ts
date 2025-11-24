import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.sendNotification(createNotificationDto);
  }

  @Get()
  async getAllNotifications() {
    return this.notificationsService.getAllNotifications();
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationsService.getNotificationById(id);
  }
}