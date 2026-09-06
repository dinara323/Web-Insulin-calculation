import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InsulinModule } from './insulin/insulin.module';

@Module({
  imports: [InsulinModule],
  controllers: [AppController],
})
export class AppModule {}