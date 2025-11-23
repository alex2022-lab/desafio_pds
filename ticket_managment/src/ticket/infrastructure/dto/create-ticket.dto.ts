import { TicketType } from '../../domain/enum/ticket.type';

export class CreateTicketDto {
  eventId: string;
  type: TicketType;
  price: number;
  availableQuantity: number;
}
