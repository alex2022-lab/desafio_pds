export interface Notification {
  id: string;
  type: string;
  message: string;
  date: Date;
  recipients: string[];
}