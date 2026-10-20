import { DatabaseService } from '../sensitivity_coefficient_database.service';
import { RegisterUserDto } from './dto/sensitivity_coefficient_register-user.dto';
export declare class UsersService {
    private readonly database;
    constructor(database: DatabaseService);
    register(dto: RegisterUserDto): Promise<Record<string, any>>;
    auth(): Promise<Record<string, any>>;
    logout(): {
        message: string;
    };
}
