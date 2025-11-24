import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.port ?? 3102;
  console.log(`App running on port: ${port}`);
  await app.listen(port);
}
bootstrap();
