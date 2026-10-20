import { Module } from '@nestjs/common';
import { UsersController } from './sensitivity_coefficient_users.controller';
import { UsersService } from './sensitivity_coefficient_users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
