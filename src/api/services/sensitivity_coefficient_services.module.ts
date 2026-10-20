import { Module } from '@nestjs/common';
import { ServicesController } from './sensitivity_coefficient_services.controller';
import { ServicesService } from './sensitivity_coefficient_services.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
