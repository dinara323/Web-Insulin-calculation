import { ServicesModule } from '../api/services/sensitivity_coefficient_services.module';
import { Module } from '@nestjs/common';
import { InsulinController } from './sensitivity_coefficient_insulin.controller';
import { InsulinService } from './sensitivity_coefficient_insulin.service';

@Module({
  imports: [ServicesModule],
  controllers: [InsulinController],
  providers: [InsulinService],
})
export class InsulinModule {}
