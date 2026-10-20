
import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'insulin_calculation',
    });
  }

  async query<
    T extends import('pg').QueryResultRow =
      import('pg').QueryResultRow,
  >(
    sql: string,
    values: unknown[] = [],
  ): Promise<import('pg').QueryResult<T>> {
    return this.pool.query<T>(sql, values as any[]);
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
