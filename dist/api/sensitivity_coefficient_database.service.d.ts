import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InsulinUser, InsulinCalculation, InsulinLike } from './sensitivity_coefficient_entities';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    readonly source: DataSource;
    get calculations(): import("typeorm").Repository<InsulinCalculation>;
    get users(): import("typeorm").Repository<InsulinUser>;
    get likes(): import("typeorm").Repository<InsulinLike>;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
