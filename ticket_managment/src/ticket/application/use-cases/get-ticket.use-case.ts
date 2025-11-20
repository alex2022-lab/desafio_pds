import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY_PORT, type TicketRepositoryPort } from '../../domain/repository/ticket.repository.port';
import { Ticket } from '../../domain/entities/ticket.entity';

@Injectable()
export class GetTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_PORT)
    private readonly ticketRepository: TicketRepositoryPort,
  ) {}

  async execute(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundException('ticket not found');
    }
    return ticket;
  }
}
