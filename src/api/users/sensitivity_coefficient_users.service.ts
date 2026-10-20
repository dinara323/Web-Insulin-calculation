import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../sensitivity_coefficient_database.service';
import { RegisterUserDto } from './dto/sensitivity_coefficient_register-user.dto';
import { getCurrentUser } from '../../common/sensitivity_coefficient_current-user';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}
  async register(dto: RegisterUserDto): Promise<Record<string, any>> {
    const name = dto.name?.trim();
    if (!name || name.length > 100)
      throw new BadRequestException('Имя обязательно, не более 100 символов');
    return this.database.users.save(this.database.users.create({ name }));
  }
  async auth(): Promise<Record<string, any>> {
    const user = await this.database.users.findOneBy({
      id: getCurrentUser().id,
    });
    if (!user)
      throw new NotFoundException(
        'Текущий пользователь не найден в базе данных',
      );
    return user;
  }
  logout() {
    return { message: 'Выход выполнен' };
  }
}
