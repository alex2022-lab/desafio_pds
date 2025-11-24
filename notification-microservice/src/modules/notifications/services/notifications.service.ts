import { Injectable } from '@nestjs/common';
import { Notification } from '../interfaces/notification.interface';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationsService {
    private notifications: Notification[] = [];
    private idCounter = 1;

    sendNotification(createNotificationDto: CreateNotificationDto): Notification {
        const notification: Notification = {
            id: (this.idCounter++).toString(),
            ...createNotificationDto,
        };
        
        this.notifications.push(notification);
        console.log(`Notificación enviada: ${notification.message}`);
        
        return notification;
    }

    getAllNotifications(): Notification[] {
        return this.notifications;
    }

    getNotificationById(id: string): Notification | undefined {
        return this.notifications.find(notif => notif.id === id);
    }
}