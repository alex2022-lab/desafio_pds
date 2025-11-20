import { GetTicketUseCase } from './get-ticket.use-case';
import { NotFoundException } from '@nestjs/common';
import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketType } from '../../domain/enum/ticket.type';

describe('GetTicketUseCase', () => {
  let useCase: GetTicketUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = { findById: jest.fn() };
    useCase = new GetTicketUseCase(repo);
  });

  it('returns ticket when found', async () => {
    const id = 'abc';
    const ticket = new Ticket(id, TicketType.GENERAL, 1000, 10, 0);
    repo.findById.mockResolvedValue(ticket);

    const result = await useCase.execute(id);

    expect(repo.findById).toHaveBeenCalledWith(id);
    expect(result).toBe(ticket);
  });

  it('throws NotFound when missing', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
