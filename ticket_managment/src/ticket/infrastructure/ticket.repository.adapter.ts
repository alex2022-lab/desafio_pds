import { TicketRepositoryPort } from '../domain/repository/ticket.repository.port';
import { Ticket } from '../domain/entities/ticket.entity';
import { TicketType } from '../domain/enum/ticket.type';
import axios from 'axios';

export class TicketRepositoryAdapter implements TicketRepositoryPort {
  private readonly BASE_URL = 'http://localhost:3101';
  private readonly TICKET_PATH = '/tickets';
  private readonly EVENT_PATH = '/events';

  delete(id: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  async findAllByEventId(eventId: string): Promise<Ticket[]> {
    const response = await axios.get(
      this.BASE_URL + `${this.EVENT_PATH}/${eventId}`,
    );
    const eventData = response.data;
    if (!eventData || !eventData.tickets) {
      return [];
    }
    return eventData.tickets;
  }
  async findById(id: string): Promise<Ticket | null> {
    const response = await axios.get(
      this.BASE_URL + `${this.TICKET_PATH}/${id}`,
    );
    return response.data;
  }

  async save(ticket: Ticket): Promise<void> {
    interface TicketJson {
      id: string;
      type: TicketType;
      price: number;
      available: number;
      sold: number;
      event_id?: string;
      attendee_id?: string;
    }
    const ticketJson = {
      id: ticket.id,
      type: ticket.type,
      price: ticket.price,
      available: ticket.availableQuantity,
      sold: ticket.soldTickets,
    };

    const response = await axios.put(
      this.BASE_URL + this.TICKET_PATH,
      ticketJson,
    );
    return response.data;
  }
  saveWithEventId(ticket: Ticket, eventId: string): Promise<void> {
    //get all tickets from

    return Promise.resolve(undefined);
  }
}
