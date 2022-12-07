import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  ('http://localhost:3000/api');
  const config = new DocumentBuilder()
    .setTitle('Posts-NestJS')
    .setDescription(
      'This is backend for Posts App. \n\n Do not forget to Register/Login first in order to get the auth token. \n\n ADMIN Account { "email": "admin@test.com", "password": "123456" }',
    )
    .setVersion('1.0')
    .addTag('Posts API')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
