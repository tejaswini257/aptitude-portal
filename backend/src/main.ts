import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3001;
  const corsOrigin =
    process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000';

  const allowedOrigins = corsOrigin
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization','Cache-Control'],
    credentials: true,
  });

  await app.listen(port);
  console.log(`🚀 Backend running on port ${port}`);
}

bootstrap();