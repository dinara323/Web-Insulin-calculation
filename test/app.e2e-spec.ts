import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { join } from 'path';
import { InsulinController } from '../src/insulin/insulin.controller';
import { InsulinService } from '../src/insulin/insulin.service';

describe('SSR pages (e2e)', () => {
  let app: NestExpressApplication;
  const card = {
    id: 1,
    name: 'Проверка ленты',
    description: 'Проверка отображения страницы',
    age: 40,
    weight: 70,
    sensitivityCoefficient: null,
    imageUrl: '/media/010.png',
    videoUrl: '/media/020.mp4',
  };
  beforeAll(async () => {
    // Exercise real routes and templates without requiring a database in this smoke test.
    const module = await Test.createTestingModule({
      controllers: [InsulinController],
      providers: [
        {
          provide: InsulinService,
          useValue: {
            getFirstPublished: async () => card,
            getById: async (id: number) => (id === card.id ? card : null),
            getDraft: async () => null,
            filterByAge: async () => [card],
            getLikesCount: async () => 0,
            calculateXE: () => 0,
            calculateDose: () => 0,
          },
        },
      ],
    }).compile();
    app = module.createNestApplication<NestExpressApplication>();
    app.setBaseViewsDir(join(process.cwd(), 'views'));
    app.setViewEngine('hbs');
    await app.init();
  });
  afterAll(async () => {
    if (app) await app.close();
  });
  it('renders the feed from the service data', async () => {
    const result = await request(app.getHttpServer())
      .get('/insulin/feed')
      .expect(200);
    expect(result.text).toContain(card.name);
  });
  it('renders the tile page from the service data', async () => {
    const result = await request(app.getHttpServer())
      .get('/insulin/tile')
      .expect(200);
    expect(result.text).toContain(card.name);
  });
  it('renders the existing add form', async () => {
    const result = await request(app.getHttpServer())
      .get('/insulin/add')
      .expect(200);
    expect(result.text).toContain('action="/insulin/add"');
    expect(result.text).toContain('Далее');
  });
  it('returns 404 for an unavailable card', async () => {
    await request(app.getHttpServer()).get('/insulin/feed?id=999').expect(404);
  });
});
