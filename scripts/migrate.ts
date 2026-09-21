import 'dotenv/config';

import { DataSource } from 'typeorm';

import { InsulinServiceEntity } from '../src/insulin/entities/insulin-service.entity';
import { InsulinUserEntity } from '../src/insulin/entities/insulin-user.entity';
import { InsulinLikeEntity } from '../src/insulin/entities/insulin-like.entity';

const dataSource = new DataSource({
  type: 'postgres',

  host:
    process.env.DB_HOST ||
    'localhost',

  port: Number(
    process.env.DB_PORT ||
      '5432',
  ),

  username:
    process.env.DB_USERNAME,

  password:
    process.env.DB_PASSWORD,

  database:
    process.env.DB_DATABASE,

  entities: [
    InsulinServiceEntity,
    InsulinUserEntity,
    InsulinLikeEntity,
  ],

  synchronize: true,
});

async function run() {
  await dataSource.initialize();

  await dataSource.synchronize();

  console.log(
    'Миграции выполнены успешно.',
  );

  await dataSource.destroy();

  process.exit(0);
}

run().catch((error) => {
  console.error(
    'Ошибка миграций:',
    error,
  );

  process.exit(1);
});