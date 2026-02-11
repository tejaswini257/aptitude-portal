import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ CORS Configuration (IMPORTANT)
  const allowedOrigins = [
    'http://localhost:3000',                 // Local frontend
    process.env.FRONTEND_URL,                // Production frontend (Vercel)
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const port = process.env.PORT || 3001;

  await app.listen(port);

  console.log(`🚀 Backend running on port ${port}`);
  console.log(`🌍 Allowed Origins:`, allowedOrigins);
}

bootstrap();
