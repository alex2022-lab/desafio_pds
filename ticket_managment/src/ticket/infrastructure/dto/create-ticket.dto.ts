import { TicketType } from '../../domain/enum/ticket.type';

export interface CreateTicketDto {
  type: TicketType;
  price: number;
  availableQuantity: number;
}
