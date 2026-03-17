import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common'; // 1. Import this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the global wrappers
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // 2. Enable Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if extra properties are sent
      transform: true, // Automatically transforms payloads to be objects typed according to their DTO classes
    }),
  );

  await app.listen(3000);
}
bootstrap();
