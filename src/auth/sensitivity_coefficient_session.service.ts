import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { randomBytes } from 'crypto';
import { CurrentUser } from '../common/sensitivity_coefficient_current-user';
@Injectable()
export class SessionService implements OnModuleDestroy {
  readonly redis = new Redis(
    process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    { maxRetriesPerRequest: 1 },
  );
  readonly ttl = 3600;
  constructor() {
    this.redis.on('error', () =>
      console.error('Redis недоступен: проверьте контейнер insulin_redis'),
    );
  }
  async create(user: CurrentUser) {
    const id = randomBytes(32).toString('hex');
    await this.redis.set(`session:${id}`, JSON.stringify(user), 'EX', this.ttl);
    return id;
  }
  async get(id?: string): Promise<CurrentUser | undefined> {
    if (!id || !/^[a-f0-9]{64}$/.test(id)) return undefined;
    const value = await this.redis.get(`session:${id}`);
    return value ? JSON.parse(value) : undefined;
  }
  async destroy(id?: string) {
    if (id && /^[a-f0-9]{64}$/.test(id)) await this.redis.del(`session:${id}`);
  }
  async onModuleDestroy() {
    await this.redis.quit();
  }
}
