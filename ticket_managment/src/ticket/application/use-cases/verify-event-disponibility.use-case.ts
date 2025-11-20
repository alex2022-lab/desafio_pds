import { Inject, Injectable } from '@nestjs/common';
import {
  TICKET_REPOSITORY_PORT,
  type TicketRepositoryPort,
} from '../../domain/repository/ticket.repository.port';
import { TicketAvailabilityOut } from '../dto/get-ticket.availability.out';
import { TicketType } from '../../domain/enum/ticket.type';

@Injectable()
export class VerifyEventAvailabilityUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_PORT)
    private readonly ticketRepository: TicketRepositoryPort,
  ) {}
  async execute(eventId: string): Promise<TicketAvailabilityOut[]> {
    const allTickets = await this.ticketRepository.findAll();

    const availability: TicketAvailabilityOut[] = [
      {
        type: TicketType.GENERAL,
        availableTickets: 50,
        soldTickets: 40,
      },
      {
        type: TicketType.VIP,
        availableTickets: 30,
        soldTickets: 20,
      },
    ];

    return availability; // Placeholder implementation
  }
}
