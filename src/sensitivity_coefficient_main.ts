
import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './sensitivity_coefficient_app.module';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  app.setBaseViewsDir(
    join(__dirname, '..', 'views'),
  );

  app.setViewEngine('hbs');

  app.useStaticAssets(
    join(__dirname, '..', 'public'),
  );

  app.use((req, res, next) => {
    if (req.path === '/') {
      return res.redirect('/insulin/feed');
    }

    next();
  });

  await app.listen(
    process.env.PORT ?? 3000,
  );
}

bootstrap();
