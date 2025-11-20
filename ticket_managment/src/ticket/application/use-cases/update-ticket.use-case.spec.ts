import { UpdateTicketUseCase } from './update-ticket.use-case';
import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketType } from '../../domain/enum/ticket.type';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UpdateTicketUseCase', () => {
  let useCase: UpdateTicketUseCase;
  let repo: jest.Mocked<any>;

  const current = new Ticket('id-1', TicketType.GENERAL, 1000, 10, 2);

  beforeEach(() => {
    repo = { findById: jest.fn(), save: jest.fn() };
    useCase = new UpdateTicketUseCase(repo);
  });

  it('updates partial fields and preserves soldTickets', async () => {
    repo.findById.mockResolvedValue(current);

    const result = await useCase.execute('id-1', { price: 1500 });

    expect(repo.findById).toHaveBeenCalledWith('id-1');
    expect(repo.save).toHaveBeenCalledTimes(1);

    const saved: Ticket = repo.save.mock.calls[0][0];
    expect(saved.id).toBe('id-1');
    expect(saved.type).toBe(TicketType.GENERAL);
    expect(saved.price).toBe(1500);
    expect(saved.availableQuantity).toBe(10);
    expect(saved.soldTickets).toBe(2);

    expect(result).toEqual(saved);
  });

  it('throws NotFound when ticket does not exist', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute('missing', { price: 1000 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('validates non-negative price and integer availableQuantity', async () => {
    repo.findById.mockResolvedValue(current);

    await expect(useCase.execute('id-1', { price: -5 })).rejects.toBeInstanceOf(
      BadRequestException,
    );

    await expect(
      useCase.execute('id-1', { availableQuantity: -1 }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute('id-1', { availableQuantity: 1.5 as any }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
