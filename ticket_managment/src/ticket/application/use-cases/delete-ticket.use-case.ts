import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY_PORT, type TicketRepositoryPort } from '../../domain/repository/ticket.repository.port';

@Injectable()
export class DeleteTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_PORT)
    private readonly ticketRepository: TicketRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const current = await this.ticketRepository.findById(id);
    if (!current) throw new NotFoundException('ticket not found');
    await this.ticketRepository.delete(id);
  }
}
