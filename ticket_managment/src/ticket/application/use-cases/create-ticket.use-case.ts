import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  TICKET_REPOSITORY_PORT,
  type TicketRepositoryPort,
} from '../../domain/repository/ticket.repository.port';
import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketType } from '../../domain/enum/ticket.type';
import { CreateTicketDto } from '../../infrastructure/dto/create-ticket.dto';

@Injectable()
export class CreateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY_PORT)
    private readonly ticketRepository: TicketRepositoryPort,
  ) {}

  async execute(input: CreateTicketDto): Promise<Ticket> {
    const { type, price, availableQuantity } = input;

    if (!type) throw new BadRequestException('type is required');
    if (typeof price !== 'number' || price < 0)
      throw new BadRequestException('price must be a non-negative number');
    if (!Number.isInteger(availableQuantity) || availableQuantity < 0)
      throw new BadRequestException(
        'availableQuantity must be a non-negative integer',
      );

    const id = Date.now().toString();
    const ticket = new Ticket(id, type, price, availableQuantity, 0);
    await this.ticketRepository.save(ticket);
    return ticket;
  }
}
