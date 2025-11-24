import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'notifications_db',
  },
  notificationService: {
    apiKey: process.env.NOTIFICATION_API_KEY || 'your-api-key',
    serviceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4000',
  },
}));