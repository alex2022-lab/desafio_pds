import { CreateTicketUseCase } from './create-ticket.use-case';
import { TicketType } from '../../domain/enum/ticket.type';
import { BadRequestException } from '@nestjs/common';
import { Ticket } from '../../domain/entities/ticket.entity';

describe('CreateTicketUseCase', () => {
  let useCase: CreateTicketUseCase;
  let repo: jest.Mocked<any>;
  const fixedNow = 1700000000000;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(fixedNow);
    repo = {
      save: jest.fn(),
    };
    useCase = new CreateTicketUseCase(repo);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a ticket and persists it', async () => {
    const input = { type: TicketType.GENERAL, price: 5000, availableQuantity: 100 };

    const result = await useCase.execute(input);

    const expected = new Ticket(String(fixedNow), input.type, input.price, input.availableQuantity, 0);

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(expected);
    expect(result).toEqual(expected);
  });

  it('validates required fields', async () => {
    await expect(
      useCase.execute({ type: undefined as any, price: 10, availableQuantity: 1 })
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({ type: TicketType.GENERAL, price: -1, availableQuantity: 1 })
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({ type: TicketType.GENERAL, price: 0, availableQuantity: -2 })
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({ type: TicketType.GENERAL, price: 0, availableQuantity: 1.2 as any })
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
