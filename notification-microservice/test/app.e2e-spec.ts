import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Notification Microservice (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/notifications (POST)', () => {
    return request(app.getHttpServer())
      .post('/notifications')
      .send({
        type: 'info',
        message: 'This is a test notification',
        date: new Date().toISOString(),
        recipients: ['user@example.com'],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body.type).toBe('info');
        expect(body.message).toBe('This is a test notification');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});