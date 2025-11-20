import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { VerifyEventAvailabilityUseCase } from '../../application/use-cases/verify-event-disponibility.use-case';
import { PurchaseTicketsUseCase } from '../../application/use-cases/purchase-tickets.use-case';
import { TicketType } from '../../domain/enum/ticket.type';

describe('TicketController', () => {
  let controller: TicketController;

  const verifyEventAvailabilityMock: jest.Mocked<VerifyEventAvailabilityUseCase> = {
    execute: jest.fn(),
  } as any;

  const purchaseTicketsUseCaseMock: jest.Mocked<PurchaseTicketsUseCase> = {
    execute: jest.fn(),
  } as any;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        { provide: VerifyEventAvailabilityUseCase, useValue: verifyEventAvailabilityMock },
        { provide: PurchaseTicketsUseCase, useValue: purchaseTicketsUseCaseMock },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAvailability', () => {
    it('should delegate to VerifyEventAvailabilityUseCase and return its result', async () => {
      const eventId = '123';
      const expected = [
        { type: TicketType.GENERAL, availableTickets: 10, soldTickets: 5 },
        { type: TicketType.VIP, availableTickets: 3, soldTickets: 2 },
      ];
      verifyEventAvailabilityMock.execute.mockResolvedValue(expected);

      const result = await controller.getAvailability(eventId);

      expect(verifyEventAvailabilityMock.execute).toHaveBeenCalledWith(eventId);
      expect(result).toEqual(expected);
    });

    it('should propagate errors from the use case', async () => {
      const eventId = 'e1';
      const error = new Error('boom');
      verifyEventAvailabilityMock.execute.mockRejectedValue(error);

      await expect(controller.getAvailability(eventId)).rejects.toThrow('boom');
    });
  });

  describe('purchaseTickets', () => {
    it('should call PurchaseTicketsUseCase with proper args and return result', async () => {
      const eventId = 'evt-9';
      const body = { quantity: 2, ticketType: TicketType.GENERAL };
      const expected = { eventId, type: body.ticketType, quantity: body.quantity, status: 'PURCHASED' };
      purchaseTicketsUseCaseMock.execute.mockResolvedValue(expected as any);

      const result = await controller.purchaseTickets(eventId, body as any);

      expect(purchaseTicketsUseCaseMock.execute).toHaveBeenCalledWith(
        eventId,
        body.quantity,
        body.ticketType,
      );
      expect(result).toEqual(expected);
    });

    it('should propagate errors from the use case', async () => {
      const eventId = 'evt-err';
      const body = { quantity: 1, ticketType: TicketType.VIP };
      const error = new Error('cannot purchase');
      purchaseTicketsUseCaseMock.execute.mockRejectedValue(error);

      await expect(controller.purchaseTickets(eventId, body as any)).rejects.toThrow('cannot purchase');
    });
  });
});
