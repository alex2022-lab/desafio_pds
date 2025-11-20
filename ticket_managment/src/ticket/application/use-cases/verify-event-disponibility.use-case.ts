import { Inject, Injectable } from '@nestjs/common';
import {
  TICKET_REPOSITORY_PORT,
  type TicketRepositoryPort,
} from '../../domain/repository/ticket.repository.port';
import { TicketAvailabilityOut } from '../dto/get-ticket.availability.out';
import { TicketType } from '../../domain/enum/ticket.type';
import { Ticket } from '../../domain/entities/ticket.entity';

@Injectable()
export class VerifyEventAvailabilityUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_PORT)
    private readonly ticketRepository: TicketRepositoryPort,
  ) {}
  async execute(eventId: string): Promise<TicketAvailabilityOut[]> {
    const allTickets = await this.ticketRepository.findAll();

    if (!allTickets.length) {
      return [];
    }

    return allTickets.map(
      (ticket: Ticket): TicketAvailabilityOut => ({
        type: ticket.type,
        availableTickets: ticket.availableQuantity,
        soldTickets: ticket.soldTickets,
      }),
    );
  }
}
