import 'dotenv/config';
import { DataSource } from 'typeorm';
import { InsulinUser } from '../src/insulin/entities/insulin-user.entity';
import { InsulinServiceEntity } from '../src/insulin/entities/insulin-service.entity';
import { InsulinLike } from '../src/insulin/entities/insulin-like.entity';
import { Lab2Schema1792454400000 } from '../src/insulin/migrations/sensitivity_coefficient_lab2_schema';

async function run() {
  const source = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [InsulinUser, InsulinServiceEntity, InsulinLike],
    migrations: [Lab2Schema1792454400000],
    synchronize: false,
  });
  await source.initialize();
  try {
    const applied = await source.runMigrations({ transaction: 'all' });
    console.log(
      `Applied migrations: ${applied.length}. Existing rows retained.`,
    );
  } finally {
    await source.destroy();
  }
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
