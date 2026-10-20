import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(dto: RegisterUserDto): Promise<Record<string, any>>;
    auth(): Promise<Record<string, any>>;
    logout(): {
        message: string;
    };
}
