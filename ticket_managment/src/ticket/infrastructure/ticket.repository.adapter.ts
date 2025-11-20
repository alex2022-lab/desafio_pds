import { TicketRepositoryPort } from '../domain/repository/ticket.repository.port';
import { Ticket } from '../domain/entities/ticket.entity';
import request from 'supertest';

export class TicketRepositoryAdapter implements TicketRepositoryPort {
  private baseUrl = 'http://localhost:3101';

  delete(id: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  async findAllByEventId(eventId: string): Promise<Ticket[]> {
    const respone = await request(this.baseUrl).get(`/event/${eventId}/ticket`);

    return respone.body;
  }

  findById(id: string): Promise<Ticket | null> {
    return Promise.resolve(null);
  }

  save(ticket: Ticket): Promise<void> {
    return Promise.resolve(undefined);
  }
}
