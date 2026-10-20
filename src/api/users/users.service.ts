import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { getCurrentUser } from '../../common/current-user';

type UserRow = Record<string, any>;

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async register(dto: RegisterUserDto): Promise<UserRow> {
    const name = dto.name?.trim();

    if (!name) {
      throw new NotFoundException('Имя пользователя обязательно');
    }

    const result = await this.database.query<UserRow>(
      `
        INSERT INTO insulin_users (name)
        VALUES ($1)
        RETURNING id, name
      `,
      [name],
    );

    return result.rows[0];
  }

  async auth(): Promise<UserRow> {
  const currentUser = getCurrentUser();

  const result = await this.database.query<UserRow>(
    `
      SELECT id, name
      FROM insulin_users
      WHERE id = $1
    `,
    [currentUser.id],
  );

  if (!result.rows[0]) {
    throw new NotFoundException(
      'Текущий пользователь не найден в базе данных',
    );
  }

  return result.rows[0];
}

  logout(): { message: string } {
    return { message: 'Выход выполнен' };
  }
}