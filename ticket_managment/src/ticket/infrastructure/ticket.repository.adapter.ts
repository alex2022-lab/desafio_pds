import { TicketRepositoryPort } from '../domain/repository/ticket.repository.port';
import { Ticket } from '../domain/entities/ticket.entity';
import request from 'supertest';
import { TicketType } from '../domain/enum/ticket.type';

export class TicketRepositoryAdapter implements TicketRepositoryPort {
  private baseUrl = 'http://localhost:3101';

  delete(id: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  async findAllByEventId(eventId: string): Promise<Ticket[]> {
    const response = await request(this.baseUrl).get(
      `/event/${eventId}/ticket`,
    );
    return response.body;
  }

  async purchaseTickets(
    eventId: string,
    type: TicketType,
    quantity: number,
  ): Promise<void> {
    const response = await request(this.baseUrl)
      .post(`/event/${eventId}/ticket/purchase`)
      .send({ type, quantity })
      .set('Accept', 'application/json');
    if (response.status >= 400) {
      throw new Error(
        response.body?.message || `Failed to purchase tickets: ${response.status}`,
      );
    }
  }

  findById(id: string): Promise<Ticket | null> {
    return Promise.resolve(null);
  }

  save(ticket: Ticket): Promise<void> {
    return Promise.resolve(undefined);
  }
}
