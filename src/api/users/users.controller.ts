import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(
    @Body() dto: RegisterUserDto,
  ): Promise<Record<string, any>> {
    return this.usersService.register(dto);
  }

  @Post('auth')
  auth(): Promise<Record<string, any>> {
    return this.usersService.auth();
  }

  @Post('logout')
  logout(): { message: string } {
    return this.usersService.logout();
  }
}