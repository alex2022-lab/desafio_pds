import { PurchaseTicketsUseCase } from './purchase-tickets.use-case';
import { TicketType } from '../../domain/enum/ticket.type';
import { Ticket } from '../../domain/entities/ticket.entity';
import { BadRequestException } from '@nestjs/common';

describe('PurchaseTicketsUseCase', () => {
  let useCase: PurchaseTicketsUseCase;
  let ticketRepo: jest.Mocked<any>;

  beforeEach(() => {
    ticketRepo = {
      findAllByEventId: jest.fn(),
      save: jest.fn(),
    };

    useCase = new PurchaseTicketsUseCase(ticketRepo);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should purchase tickets when availability is sufficient', async () => {
    const eventId = 'event123';
    const type = TicketType.GENERAL;
    const quantity = 3;

    ticketRepo.findAllByEventId.mockResolvedValue([
      new Ticket('t1', TicketType.GENERAL, 5000, 10, 0),
      new Ticket('t2', TicketType.VIP, 10000, 5, 0),
    ]);

    const result = await useCase.execute(eventId, quantity, type);

    expect(ticketRepo.save).toHaveBeenCalled();
    expect(result).toEqual({ eventId, type, quantity, status: 'PURCHASED' });
  });

  it('should throw if ticket type is not available for event', async () => {
    const eventId = 'event123';
    const type = TicketType.VIP;
    const quantity = 1;

    ticketRepo.findAllByEventId.mockResolvedValue([
      new Ticket('t1', TicketType.GENERAL, 5000, 10, 0),
    ]);

    await expect(
      useCase.execute(eventId, quantity, type),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw if insufficient availability', async () => {
    const eventId = 'event123';
    const type = TicketType.GENERAL;
    const quantity = 11;

    ticketRepo.findAllByEventId.mockResolvedValue([
      new Ticket('t1', TicketType.GENERAL, 5000, 10, 0),
      new Ticket('t2', TicketType.VIP, 10000, 5, 0),
    ]);

    await expect(
      useCase.execute(eventId, quantity, type),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should validate positive integer quantity', async () => {
    const eventId = 'event123';
    const type = TicketType.GENERAL;

    await expect(
      useCase.execute(eventId, 0 as any, type),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      useCase.execute(eventId, -2 as any, type),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      useCase.execute(eventId, 1.5 as any, type),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should validate eventId', async () => {
    const type = TicketType.GENERAL;
    await expect(useCase.execute('', 1, type)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
