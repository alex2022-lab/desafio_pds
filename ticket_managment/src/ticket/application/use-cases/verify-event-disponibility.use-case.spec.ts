import { VerifyEventAvailabilityUseCase } from './verify-event-disponibility.use-case';
import { TicketType } from '../../domain/enum/ticket.type';
import { TicketAvailabilityOut } from '../dto/get-ticket.availability.out';
import { Ticket } from '../../domain/entities/ticket.entity';

describe('VerifyEventAvailabilityUseCase', () => {
  let useCase: VerifyEventAvailabilityUseCase;

  let ticketRepo: jest.Mocked<any>;

  beforeEach(async () => {
    ticketRepo = {
      findAll: jest.fn(),
    };

    useCase = new VerifyEventAvailabilityUseCase(ticketRepo);
  });
  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });
  it('execute should return availability', async () => {
    const eventId = 'event123';
    ticketRepo.findAll = jest
      .fn()
      .mockResolvedValue([
        new Ticket('ticket1', TicketType.GENERAL, 5000, 50, 40),
        new Ticket('ticket2', TicketType.VIP, 10000, 30, 20),
      ]);
    const availability = await useCase.execute(eventId);
    const expectedResponse: TicketAvailabilityOut[] = [
      { type: TicketType.GENERAL, availableTickets: 50, soldTickets: 40 },
      { type: TicketType.VIP, availableTickets: 30, soldTickets: 20 },
    ];
    expect(availability).toStrictEqual(expectedResponse);
  });
});
