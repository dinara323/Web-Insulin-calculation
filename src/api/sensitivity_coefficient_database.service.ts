import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InsulinUser, InsulinCalculation, InsulinLike } from './sensitivity_coefficient_entities';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  readonly source = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'insulin_calculation',
    entities: [InsulinUser, InsulinCalculation, InsulinLike],
    synchronize: false,
  });
  get calculations() {
    return this.source.getRepository(InsulinCalculation);
  }
  get users() {
    return this.source.getRepository(InsulinUser);
  }
  get likes() {
    return this.source.getRepository(InsulinLike);
  }
  async onModuleInit() {
    await this.source.initialize();
  }
  async onModuleDestroy() {
    if (this.source.isInitialized) await this.source.destroy();
  }
}
