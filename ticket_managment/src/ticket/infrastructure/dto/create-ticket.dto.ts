import { TicketType } from '../../domain/enum/ticket.type';
import { Allow, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  eventId: string;
  @Allow()
  type: TicketType;
  @IsNumber()
  price: number;
  @IsNumber()
  availableQuantity: number;
}
