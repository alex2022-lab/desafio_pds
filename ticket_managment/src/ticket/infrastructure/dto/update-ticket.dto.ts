import { TicketType } from '../../domain/enum/ticket.type';

export interface UpdateTicketDto {
  type?: TicketType;
  price?: number;
  availableQuantity?: number;
}
