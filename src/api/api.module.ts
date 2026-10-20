import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    ServicesModule,
    UsersModule,
  ],
})
export class ApiModule {}