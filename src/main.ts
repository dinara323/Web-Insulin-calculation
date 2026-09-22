import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import { join } from 'path';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  app.setBaseViewsDir(
    join(process.cwd(), 'views'),
);

  app.setViewEngine('hbs');

  app.useStaticAssets(
    join(process.cwd(), 'public'),
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