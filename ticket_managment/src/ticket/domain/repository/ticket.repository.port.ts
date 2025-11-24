import { Ticket } from '../entities/ticket.entity';
import { TicketType } from '../enum/ticket.type';
export const TICKET_REPOSITORY_PORT = 'TICKET_REPOSITORY_PORT';
export interface TicketRepositoryPort {
  findAllByEventId(eventId: string): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  save(ticket: Ticket): Promise<void>;
  saveWithEventId(ticket: Ticket, eventId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
