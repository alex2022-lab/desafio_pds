import {Ticket} from "../entities/ticket.entity";
export const TICKET_REPOSITORY_PORT = 'TICKET_REPOSITORY_PORT';
export interface TicketRepositoryPort {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  save(ticket: Ticket): Promise<void>;
  delete(id: string): Promise<void>;
}