import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InsulinController } from './insulin.controller';
import { InsulinService } from './insulin.service';

import { InsulinUser } from './entities/insulin-user.entity';
import { InsulinServiceEntity } from './entities/insulin-service.entity';
import { InsulinLike } from './entities/insulin-like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InsulinUser,
      InsulinServiceEntity,
      InsulinLike,
    ]),
  ],

  controllers: [
    InsulinController,
  ],

  providers: [
    InsulinService,
  ],
})
export class InsulinModule {}