import { DeleteTicketUseCase } from './delete-ticket.use-case';
import { NotFoundException } from '@nestjs/common';
import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketType } from '../../domain/enum/ticket.type';

describe('DeleteTicketUseCase', () => {
  let useCase: DeleteTicketUseCase;
  let repo: jest.Mocked<any>;

  beforeEach(() => {
    repo = { findById: jest.fn(), delete: jest.fn() };
    useCase = new DeleteTicketUseCase(repo);
  });

  it('deletes when ticket exists', async () => {
    const ticket = new Ticket('id-1', TicketType.GENERAL, 1000, 10, 0);
    repo.findById.mockResolvedValue(ticket);

    await useCase.execute('id-1');

    expect(repo.findById).toHaveBeenCalledWith('id-1');
    expect(repo.delete).toHaveBeenCalledWith('id-1');
  });

  it('throws NotFound when ticket does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repo.delete).not.toHaveBeenCalled();
  });
});
