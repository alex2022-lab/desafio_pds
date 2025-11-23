/*
Registrar la compra de entradas, reduciendo el número de entradas disponibles.
 */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import request from 'supertest';
import { CreateTicketDto } from '../../../src/ticket/infrastructure/dto/create-ticket.dto';
import { TicketType } from '../../../src/ticket/domain/enum/ticket.type';
import { PurchaseTicketsDto } from '../../../src/ticket/infrastructure/dto/purchase-tickets.dto';

describe('Buy Tickets', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
  });
  afterAll(async () => {
    await app.close();
  });
  it('buy Ticket POST /ticket', () => {
    const createTicker: PurchaseTicketsDto = {
      ticketType: TicketType.GENERAL,
      quantity: 1,
      eventId: 'id-evento-1',
    };
    return request(app.getHttpServer())
      .post(`/event/${createTicker.eventId}/ticket/purchase`)
      .send()
      .expect(200);
  });
});
