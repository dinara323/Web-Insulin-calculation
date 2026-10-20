import 'dotenv/config';
import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as request from 'supertest';
import { AppModule } from '../src/sensitivity_coefficient_app.module';
import { DatabaseService } from '../src/api/sensitivity_coefficient_database.service';
import {
  InsulinCalculation,
  InsulinLike,
  InsulinUser,
} from '../src/api/sensitivity_coefficient_entities';
import { MinioService } from '../src/storage/sensitivity_coefficient_minio.service';

describe('Laboratory API and pages (PostgreSQL, rolled back)', () => {
  let app: NestExpressApplication;
  let database: DatabaseService;
  let runner: ReturnType<DatabaseService['source']['createQueryRunner']>;
  let id: number;
  let secondId: number;
  beforeAll(async () => {
    database = new DatabaseService();
    await database.onModuleInit();
    runner = database.source.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    const facade = {
      calculations: runner.manager.getRepository(InsulinCalculation),
      users: runner.manager.getRepository(InsulinUser),
      likes: runner.manager.getRepository(InsulinLike),
      source: { transaction: (work: any) => work(runner.manager) },
    };
    // All writes are on a single rollback transaction, including HTTP requests.
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(DatabaseService)
      .useValue(facade)
      .overrideProvider(MinioService)
      .useValue({ upload: jest.fn(async () => '/test-media') })
      .compile();
    app = module.createNestApplication<NestExpressApplication>();
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    await app.init();
    // Existing drafts are hidden only inside the rollback transaction.
    await facade.calculations.update(
      { creatorId: 1, status: 'черновик' },
      { status: 'удален' },
    );
  }, 30000);
  afterAll(async () => {
    if (app) await app.close();
    if (runner?.isTransactionActive) await runner.rollbackTransaction();
    if (runner) await runner.release();
    if (database) await database.onModuleDestroy();
  });
  it('validates input before writing', async () => {
    await request(app.getHttpServer())
      .post('/api/services')
      .send({ name: 'x', description: 'x', age: 'bad' })
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/services?ageFrom=bad')
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/services/feed?id=0')
      .expect(400);
  });
  it('creates one draft with multipart fields and rejects a second', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/services')
      .field('name', 'LAB_ROLLBACK_ONE')
      .field('description', 'Local integration test')
      .field('age', '40')
      .field('weight', '70')
      .field('sensitivityCoefficient', '2')
      .attach('image', Buffer.from('test'), {
        filename: 'test.png',
        contentType: 'image/png',
      })
      .expect(201);
    id = response.body.id;
    expect(response.body.sensitivityCoefficient).toBe(2);
    await request(app.getHttpServer())
      .post('/api/services')
      .send({ name: 'duplicate', description: 'duplicate' })
      .expect(400);
    const draft = await request(app.getHttpServer())
      .get('/api/services/draft')
      .expect(200);
    expect(draft.body.id).toBe(id);
  });
  it('publishes, filters and renders the same record on the pages', async () => {
    await request(app.getHttpServer())
      .put(`/api/services/${id}/publish`)
      .expect(200);
    const list = await request(app.getHttpServer())
      .get('/api/services?name=LAB_ROLLBACK_ONE&ageFrom=40&ageTo=40')
      .expect(200);
    expect(list.body.map((row: any) => row.id)).toEqual([id]);
    expect(list.body[0].isCreator).toBe(1);
    const page = await request(app.getHttpServer())
      .get(`/insulin/feed?id=${id}`)
      .expect(200);
    expect(page.text).toContain('LAB_ROLLBACK_ONE');
    const tile = await request(app.getHttpServer())
      .get('/insulin/tile?ageRange=1')
      .expect(200);
    expect(tile.text).toContain('LAB_ROLLBACK_ONE');
  });
  it('moves to the next published ID and wraps at the end', async () => {
    const second = await request(app.getHttpServer())
      .post('/api/services')
      .send({ name: 'LAB_ROLLBACK_TWO', description: 'Second' })
      .expect(201);
    secondId = second.body.id;
    await request(app.getHttpServer())
      .put(`/api/services/${secondId}/publish`)
      .expect(200);
    const next = await request(app.getHttpServer())
      .get(`/api/services/feed?id=${id}&next=true`)
      .expect(200);
    expect(next.body.id).toBe(secondId);
    const first = await request(app.getHttpServer())
      .get('/api/services/feed')
      .expect(200);
    const wrap = await request(app.getHttpServer())
      .get(`/api/services/feed?id=${secondId}&next=true`)
      .expect(200);
    expect(wrap.body.id).toBe(first.body.id);
  });
  it('keeps a like idempotent and removes it', async () => {
    await request(app.getHttpServer())
      .post(`/api/services/${id}/like`)
      .send({ value: 1 })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/api/services/${id}/like`)
      .send({ value: 1 })
      .expect(201);
    const feed = await request(app.getHttpServer())
      .get(`/api/services/feed?id=${id}`)
      .expect(200);
    expect(feed.body.likesCount).toBe(1);
    expect(feed.body.isLiked).toBe(1);
    await request(app.getHttpServer())
      .post(`/api/services/${id}/like`)
      .send({ value: 0 })
      .expect(201);
    const unliked = await request(app.getHttpServer())
      .get(`/api/services/feed?id=${id}`)
      .expect(200);
    expect(unliked.body.likesCount).toBe(0);
  });
  it('soft deletes and excludes deleted cards', async () => {
    await request(app.getHttpServer())
      .delete(`/api/services/${id}`)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/api/services/feed?id=${id}`)
      .expect(404);
    const row = await runner.manager
      .getRepository(InsulinCalculation)
      .findOneByOrFail({ id });
    expect(row.status).toBe('удален');
    const list = await request(app.getHttpServer())
      .get('/api/services?name=LAB_ROLLBACK_ONE')
      .expect(200);
    expect(list.body).toEqual([]);
  });
  it('registers a user and preserves the fixed-user auth stub', async () => {
    const user = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ name: 'LAB_ROLLBACK_USER' })
      .expect(201);
    expect(user.body.name).toBe('LAB_ROLLBACK_USER');
    const auth = await request(app.getHttpServer())
      .post('/api/users/auth')
      .expect(201);
    expect(auth.body.id).toBe(1);
    await request(app.getHttpServer()).post('/api/users/logout').expect(201);
  });
});
