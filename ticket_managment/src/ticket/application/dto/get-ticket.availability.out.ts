import { TicketType } from '../../domain/enum/ticket.type';

export interface TicketAvailabilityOut {
  type: TicketType;
  availableTickets: number;
  soldTickets: number;
}
