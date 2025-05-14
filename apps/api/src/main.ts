// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Middleware to log requests
  app.use((req, res, next) => {
    logger.log(`Request... ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
      logger.log(`Request Body: ${JSON.stringify(req.body)}`);
    }
    next();
  });
  
  // Get config service
  const configService = app.get(ConfigService);
  
  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');
  
  // Enable CORS and configure it
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  
  // Get port from environment or use default
  const port = configService.get<number>('PORT') || 3000;
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port} 🚀`);
}
bootstrap();