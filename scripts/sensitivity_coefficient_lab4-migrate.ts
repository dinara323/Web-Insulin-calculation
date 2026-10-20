import 'dotenv/config';
import { Client } from 'pg';
async function main() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'insulin_calculation',
  });
  await client.connect();
  try {
    await client.query(
      'ALTER TABLE insulin_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)',
    );
    // A partial unique index preserves legacy names while enforcing unique new logins.
    await client.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS insulin_users_login_unique ON insulin_users (name) WHERE password_hash IS NOT NULL',
    );
    console.log('ЛР4: миграция выполнена, существующие записи сохранены');
  } finally {
    await client.end();
  }
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
