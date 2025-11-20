import { TicketType } from '../enum/ticket.type';

export class Ticket {
  constructor(
    private readonly id: string,
    private readonly type: TicketType,
    private readonly price: number,
    private readonly availableQuantity: number,
    private readonly soldTickets: number,
  ) {}
}
