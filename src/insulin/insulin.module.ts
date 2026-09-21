import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InsulinController } from './insulin.controller';
import { InsulinService } from './insulin.service';

import { InsulinServiceEntity } from './entities/insulin-service.entity';
import { InsulinUserEntity } from './entities/insulin-user.entity';
import { InsulinLikeEntity } from './entities/insulin-like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InsulinServiceEntity,
      InsulinUserEntity,
      InsulinLikeEntity,
    ]),
  ],

  controllers: [InsulinController],

  providers: [InsulinService],
})
export class InsulinModule {}