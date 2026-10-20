import { Request, Response } from 'express';
import { UsersService } from './sensitivity_coefficient_users.service';
import { RegisterUserDto } from './dto/sensitivity_coefficient_register-user.dto';
import { SessionService } from '../../auth/sensitivity_coefficient_session.service';
export declare class UsersController {
    private readonly users;
    private readonly sessions;
    constructor(users: UsersService, sessions: SessionService);
    register(dto: RegisterUserDto): Promise<{
        id: number;
        name: string;
    }>;
    auth(dto: RegisterUserDto, req: Request, res: Response): Promise<{
        user: {
            id: number;
            name: string;
        };
    }>;
    me(): import("../../common/sensitivity_coefficient_current-user").CurrentUser;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
}
