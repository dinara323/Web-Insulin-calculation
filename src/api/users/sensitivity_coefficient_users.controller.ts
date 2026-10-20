import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { UsersService } from './sensitivity_coefficient_users.service';
import { RegisterUserDto } from './dto/sensitivity_coefficient_register-user.dto';
import { SessionService } from '../../auth/sensitivity_coefficient_session.service';
import { SessionGuard } from '../../auth/sensitivity_coefficient_session.guard';
import { getCurrentUser } from '../../common/sensitivity_coefficient_current-user';
@ApiTags('Пользователи')
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly users: UsersService,
    private readonly sessions: SessionService,
  ) {}
  @Post('register')
  @ApiOperation({ summary: 'Регистрация создателя' })
  @ApiCreatedResponse({
    description: 'Создатель зарегистрирован; возвращаются id и name без пароля',
  })
  @ApiConflictResponse({ description: 'Имя занято' })
  register(@Body() dto: RegisterUserDto) {
    return this.users.register(dto);
  }
  @Post('auth')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Вход: создаёт Redis-сессию и HttpOnly cookie sessionId',
  })
  @ApiOkResponse({
    description:
      'Пользователь вошёл; cookie sessionId установлена, сессия сохранена в Redis',
  })
  @ApiUnauthorizedResponse({ description: 'Неверные данные' })
  async auth(
    @Body() dto: RegisterUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.users.auth(dto);
    await this.sessions.destroy(req.cookies?.sessionId);
    const sessionId = await this.sessions.create(user);
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      maxAge: this.sessions.ttl * 1000,
      path: '/',
    });
    return { user };
  }
  @Get('me')
  @UseGuards(SessionGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Текущий пользователь сессии' })
  me() {
    return getCurrentUser();
  }
  @Post('logout')
  @HttpCode(200)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Выход: удаление сессии в Redis и куки' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.sessions.destroy(req.cookies?.sessionId);
    res.clearCookie('sessionId', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
    });
    return { message: 'Выход выполнен' };
  }
}
