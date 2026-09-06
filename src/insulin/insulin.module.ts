import { Module } from '@nestjs/common';
import { InsulinController } from './insulin.controller';
import { InsulinService } from './insulin.service';

@Module({
  controllers: [InsulinController],
  providers: [InsulinService]
})
export class InsulinModule {}
