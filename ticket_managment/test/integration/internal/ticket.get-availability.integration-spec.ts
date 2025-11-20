import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import request from 'supertest';
import {
  TICKET_REPOSITORY_PORT,
  TicketRepositoryPort,
} from '../../../src/ticket/domain/repository/ticket.repository.port';
import { Ticket } from '../../../src/ticket/domain/entities/ticket.entity';
import { TicketType } from '../../../src/ticket/domain/enum/ticket.type';

describe('Ticket GetAvailability', () => {
  let app: INestApplication;
  const mockTicketRepository = jest.mocked<TicketRepositoryPort>({
    findAllByEventId: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  });
  beforeAll(async () => {
    // Initialize application context, database connections, etc.

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TICKET_REPOSITORY_PORT)
      .useValue(mockTicketRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should get ticket availability for an event', () => {
    mockTicketRepository.findAllByEventId.mockResolvedValue([
      new Ticket('1', TicketType.GENERAL, 5000, 100, 50),
      new Ticket('2', TicketType.VIP, 10000, 50, 25),
    ]);

    const eventId = 134;
    return request(app.getHttpServer())
      .get(`/event/${eventId}/tickets/availability`)
      .expect(200)
      .expect([
        { type: 'GENERAL', availableTickets: 100, soldTickets: 50 },
        { type: 'VIP', availableTickets: 50, soldTickets: 25 },
      ]);
  });
});
