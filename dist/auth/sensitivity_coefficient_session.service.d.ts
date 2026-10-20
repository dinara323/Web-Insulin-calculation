import { OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { CurrentUser } from '../common/sensitivity_coefficient_current-user';
export declare class SessionService implements OnModuleDestroy {
    readonly redis: Redis;
    readonly ttl = 3600;
    constructor();
    create(user: CurrentUser): Promise<string>;
    get(id?: string): Promise<CurrentUser | undefined>;
    destroy(id?: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
