import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de filtros globales
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuración de CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Microservicio de notificaciones escuchando en el puerto ${port}`);
}

bootstrap();