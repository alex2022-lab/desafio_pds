export class CreateNotificationDto {
  type: string;
  message: string;
  date: Date;
  recipients: string[];
}