import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TicketType } from '../../domain/enum/ticket.type';
import {
  TICKET_REPOSITORY_PORT,
  type TicketRepositoryPort,
} from '../../domain/repository/ticket.repository.port';
import { Ticket } from '../../domain/entities/ticket.entity';

@Injectable()
export class PurchaseTicketsUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_PORT)
    private readonly ticketRepository: TicketRepositoryPort,
  ) {}

  async execute(
    eventId: string,
    quantity: number,
    type: TicketType,
  ): Promise<{
    eventId: string;
    type: TicketType;
    quantity: number;
    status: string;
  }> {
    if (!eventId) {
      throw new BadRequestException('eventId is required');
    }
    if (!type) {
      throw new BadRequestException('ticket type is required');
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('quantity must be a positive integer');
    }

    const allTickets: Ticket[] =
      await this.ticketRepository.findAllByEventId(eventId);
    const ticketType = allTickets.find((t) => t.type === type);

    if (!ticketType) {
      throw new BadRequestException('ticket type not available for this event');
    }

    if (ticketType.availableQuantity < quantity) {
      throw new BadRequestException('insufficient ticket availability');
    }

    await this.ticketRepository.save(this.buyTicket(ticketType, quantity));

    return { eventId, type, quantity, status: 'PURCHASED' };
  }
  private buyTicket(ticket: Ticket, ticketToBuy: number): Ticket {
    return new Ticket(
      ticket.id,
      ticket.type,
      ticket.price,
      ticket.availableQuantity - ticketToBuy,
      ticket.soldTickets + ticketToBuy,
    );
  }
}
