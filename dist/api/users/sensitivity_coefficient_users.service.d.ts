import { DatabaseService } from '../sensitivity_coefficient_database.service';
import { RegisterUserDto } from './dto/sensitivity_coefficient_register-user.dto';
export declare class UsersService {
    private readonly database;
    constructor(database: DatabaseService);
    register(dto: RegisterUserDto): Promise<{
        id: number;
        name: string;
    }>;
    auth(dto: RegisterUserDto): Promise<{
        id: number;
        name: string;
    }>;
}
