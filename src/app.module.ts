import { Module } from '@nestjs/common';
import { InsulinModule } from './insulin/insulin.module';

@Module({
  imports: [InsulinModule],
})
export class AppModule {}