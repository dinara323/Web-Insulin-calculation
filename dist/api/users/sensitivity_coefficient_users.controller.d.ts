import { UsersService } from './sensitivity_coefficient_users.service';
import { RegisterUserDto } from './dto/sensitivity_coefficient_register-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(dto: RegisterUserDto): Promise<Record<string, any>>;
    auth(): Promise<Record<string, any>>;
    logout(): {
        message: string;
    };
}
