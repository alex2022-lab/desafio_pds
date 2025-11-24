export class NotificationsService {
    private notifications: Notification[] = [];

    sendNotification(notification: Notification): void {
        // Lógica para enviar la notificación
        console.log(`Enviando notificación: ${notification.message}`);
    }

    saveNotification(notification: Notification): void {
        // Lógica para guardar la notificación en la base de datos
        this.notifications.push(notification);
        console.log(`Notificación guardada: ${notification.message}`);
    }

    getAllNotifications(): Notification[] {
        return this.notifications;
    }
}