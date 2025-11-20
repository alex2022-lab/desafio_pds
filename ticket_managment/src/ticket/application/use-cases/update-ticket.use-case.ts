import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TICKET_REPOSITORY_PORT, type TicketRepositoryPort } from '../../domain/repository/ticket.repository.port';
import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketType } from '../../domain/enum/ticket.type';

@Injectable()
export class UpdateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_PORT)
    private readonly ticketRepository: TicketRepositoryPort,
  ) {}

  async execute(id: string, input: { type?: TicketType; price?: number; availableQuantity?: number }): Promise<Ticket> {
    const current = await this.ticketRepository.findById(id);
    if (!current) throw new NotFoundException('ticket not found');

    const nextType = input.type ?? current.type;
    const nextPrice = input.price ?? current.price;
    const nextAvailable = input.availableQuantity ?? current.availableQuantity;

    if (!nextType) throw new BadRequestException('type is required');
    if (typeof nextPrice !== 'number' || nextPrice < 0) throw new BadRequestException('price must be a non-negative number');
    if (!Number.isInteger(nextAvailable) || nextAvailable < 0) throw new BadRequestException('availableQuantity must be a non-negative integer');

    // Keep soldTickets unchanged on pure update; business rules may differ
    const updated = new Ticket(id, nextType, nextPrice, nextAvailable, current.soldTickets);
    await this.ticketRepository.save(updated);
    return updated;
  }
}
