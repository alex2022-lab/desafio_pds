import { TicketType } from '../../domain/enum/ticket.type';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PurchaseTicketsDto {
  @IsString()
  eventId: string;

  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  ticketType: TicketType;
}
