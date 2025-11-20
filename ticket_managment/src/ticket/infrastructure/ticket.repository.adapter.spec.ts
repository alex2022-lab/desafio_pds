import { TicketRepositoryAdapter } from './ticket.repository.adapter';
import { TicketType } from '../domain/enum/ticket.type';

jest.mock('supertest', () => {
  const fn = jest.fn();
  return fn;
});

// Access the mocked supertest function
const mockedRequest: jest.Mock = require('supertest');

function mockGetResponse(body: any) {
  const get = jest.fn().mockResolvedValue({ body });
  mockedRequest.mockReturnValue({ get });
  return { get };
}

function mockPostChain(status: number, body?: any) {
  const response = { status, body } as any;
  const set = jest.fn().mockResolvedValue(response);
  const send = jest.fn().mockReturnValue({ set });
  const post = jest.fn().mockReturnValue({ send, set });
  mockedRequest.mockReturnValue({ post });
  return { post, send, set, response };
}

describe('TicketRepositoryAdapter', () => {
  let adapter: TicketRepositoryAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new TicketRepositoryAdapter();
  });

  describe('findAllByEventId', () => {
    it('returns list from remote body', async () => {
      const body = [
        { id: '1', type: TicketType.GENERAL, price: 1000, availableQuantity: 10, soldTickets: 2 },
        { id: '2', type: TicketType.VIP, price: 2000, availableQuantity: 5, soldTickets: 1 },
      ];
      const { get } = mockGetResponse(body);

      const result = await adapter.findAllByEventId('evt-1');

      expect(get).toHaveBeenCalledWith('/event/evt-1/ticket');
      expect(result).toEqual(body);
    });
  });

  describe('purchaseTickets', () => {
    it('does not throw on success (200)', async () => {
      const { post, send, set } = mockPostChain(200, { ok: true });

      await expect(
        adapter.purchaseTickets('evt-1', TicketType.GENERAL, 3)
      ).resolves.toBeUndefined();

      expect(post).toHaveBeenCalledWith('/event/evt-1/ticket/purchase');
      expect(send).toHaveBeenCalledWith({ type: TicketType.GENERAL, quantity: 3 });
      expect(set).toHaveBeenCalledWith('Accept', 'application/json');
    });

    it('throws with remote message on 4xx', async () => {
      mockPostChain(400, { message: 'invalid request' });

      await expect(
        adapter.purchaseTickets('evt-1', TicketType.VIP, 1)
      ).rejects.toThrow('invalid request');
    });

    it('throws generic message when no body message on 5xx', async () => {
      mockPostChain(500, {});

      await expect(
        adapter.purchaseTickets('evt-1', TicketType.GENERAL, 2)
      ).rejects.toThrow('Failed to purchase tickets: 500');
    });
  });
});
