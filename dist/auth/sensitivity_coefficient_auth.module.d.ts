import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SessionService } from './sensitivity_coefficient_session.service';
export declare class AuthModule implements NestModule {
    private readonly sessions;
    constructor(sessions: SessionService);
    configure(consumer: MiddlewareConsumer): void;
}
