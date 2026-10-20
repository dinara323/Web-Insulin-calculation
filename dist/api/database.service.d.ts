import { OnModuleDestroy } from '@nestjs/common';
export declare class DatabaseService implements OnModuleDestroy {
    private readonly pool;
    constructor();
    query<T extends import('pg').QueryResultRow = import('pg').QueryResultRow>(sql: string, values?: unknown[]): Promise<import('pg').QueryResult<T>>;
    onModuleDestroy(): Promise<void>;
}
