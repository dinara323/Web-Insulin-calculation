import { Module } from '@nestjs/common';
import { InsulinModule } from './insulin/insulin.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    InsulinModule,
    ApiModule,
  ],
})
export class AppModule {}