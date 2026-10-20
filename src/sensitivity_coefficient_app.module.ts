import { AuthModule } from './auth/sensitivity_coefficient_auth.module';
import { Module } from '@nestjs/common';
import { InsulinModule } from './insulin/sensitivity_coefficient_insulin.module';
import { ApiModule } from './api/sensitivity_coefficient_api.module';

@Module({
  imports: [AuthModule, InsulinModule, ApiModule],
})
export class AppModule {}
