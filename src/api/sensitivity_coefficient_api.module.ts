import { Module } from '@nestjs/common';
import { DatabaseModule } from './sensitivity_coefficient_database.module';
import { ServicesModule } from './services/sensitivity_coefficient_services.module';
import { UsersModule } from './users/sensitivity_coefficient_users.module';

@Module({
  imports: [
    DatabaseModule,
    ServicesModule,
    UsersModule,
  ],
})
export class ApiModule {}