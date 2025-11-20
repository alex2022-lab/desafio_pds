import { TicketType } from '../../domain/enum/ticket.type';

export interface PurchaseTicketsDto {
  quantity: number;
  ticketType: TicketType;
}
