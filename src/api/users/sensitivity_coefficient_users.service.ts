import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { DatabaseService } from '../sensitivity_coefficient_database.service';
import { RegisterUserDto } from './dto/sensitivity_coefficient_register-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}
  async register(dto: RegisterUserDto) {
    const name = dto.name.trim();
    if (await this.database.users.existsBy({ name }))
      throw new ConflictException('Имя уже занято');
    try {
      const user = await this.database.users.save(
        this.database.users.create({
          name,
          passwordHash: await hash(dto.password, 12),
        }),
      );
      return { id: user.id, name: user.name };
    } catch (e) {
      if (e.code === '23505') throw new ConflictException('Имя уже занято');
      throw e;
    }
  }
  async auth(dto: RegisterUserDto) {
    const user = await this.database.users
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.name = :name', { name: dto.name.trim() })
      .getOne();
    if (
      !user?.passwordHash ||
      !(await compare(dto.password, user.passwordHash))
    )
      throw new UnauthorizedException('Неверное имя или пароль');
    return { id: user.id, name: user.name };
  }
}
