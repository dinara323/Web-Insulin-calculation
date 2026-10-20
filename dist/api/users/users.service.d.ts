import { DatabaseService } from '../database.service';
import { RegisterUserDto } from './dto/register-user.dto';
type UserRow = Record<string, any>;
export declare class UsersService {
    private readonly database;
    constructor(database: DatabaseService);
    register(dto: RegisterUserDto): Promise<UserRow>;
    auth(): Promise<UserRow>;
    logout(): {
        message: string;
    };
}
export {};
