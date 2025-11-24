import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  const port = configService.get<number>('port') || 3041; 

  app.setGlobalPrefix('api/v1'); 

  await app.listen(port);
  console.log(`🚀 Assistant Management Microservice is running on: ${await app.getUrl()}`);
}
bootstrap();