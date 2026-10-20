import 'dotenv/config';

import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './sensitivity_coefficient_app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Чувствительность к инсулину — ЛР4')
    .setDescription(
      'Выполните register и auth. Браузер автоматически отправляет HttpOnly cookie sessionId. Для Postman скопируйте cookie из Application. Чтение доступно гостю; запись — создателю.',
    )
    .setVersion('4.0')
    .addCookieAuth('sessionId')
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config), {
    swaggerOptions: { withCredentials: true, persistAuthorization: true },
  });
  app.enableShutdownHooks();
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('hbs');

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.use((req, res, next) => {
    if (req.path === '/') {
      return res.redirect('/insulin/feed');
    }

    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
