import 'dotenv/config';

import { DataSource } from 'typeorm';

import { InsulinUser } from '../src/insulin/entities/insulin-user.entity';
import { InsulinServiceEntity } from '../src/insulin/entities/insulin-service.entity';
import { InsulinLike } from '../src/insulin/entities/insulin-like.entity';

const dataSource =
  new DataSource({
    type: 'postgres',

    host: process.env.DB_HOST,

    port: Number(
      process.env.DB_PORT,
    ),

    username:
      process.env.DB_USERNAME,

    password:
      process.env.DB_PASSWORD,

    database:
      process.env.DB_DATABASE,

    entities: [
      InsulinUser,
      InsulinServiceEntity,
      InsulinLike,
    ],

    synchronize: true,
  });

async function run() {
  await dataSource.initialize();

  await dataSource.synchronize();

  console.log(
    'База данных синхронизирована.',
  );

  await dataSource.destroy();
}

run().catch((error) => {
  console.error(
    'Ошибка синхронизации:',
    error,
  );

  process.exit(1);
});