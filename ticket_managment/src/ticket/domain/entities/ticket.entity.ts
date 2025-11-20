import { TicketType } from '../enum/ticket.type';

export class Ticket {
  constructor(
    public readonly id: string,
    public readonly type: TicketType,
    public readonly price: number,
    public readonly availableQuantity: number,
    public readonly soldTickets: number,
  ) {}
}
