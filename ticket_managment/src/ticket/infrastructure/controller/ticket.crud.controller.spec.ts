import { Test, TestingModule } from '@nestjs/testing';
import { TicketCrudController } from './ticket.crud.controller';
import { GetTicketUseCase } from '../../application/use-cases/get-ticket.use-case';
import { CreateTicketUseCase } from '../../application/use-cases/create-ticket.use-case';
import { UpdateTicketUseCase } from '../../application/use-cases/update-ticket.use-case';
import { DeleteTicketUseCase } from '../../application/use-cases/delete-ticket.use-case';
import { TicketType } from '../../domain/enum/ticket.type';
import { Ticket } from '../../domain/entities/ticket.entity';

describe('TicketCrudController', () => {
  let controller: TicketCrudController;

  const getUseCase = { execute: jest.fn() } as unknown as jest.Mocked<GetTicketUseCase>;
  const createUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreateTicketUseCase>;
  const updateUseCase = { execute: jest.fn() } as unknown as jest.Mocked<UpdateTicketUseCase>;
  const deleteUseCase = { execute: jest.fn() } as unknown as jest.Mocked<DeleteTicketUseCase>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketCrudController],
      providers: [
        { provide: GetTicketUseCase, useValue: getUseCase },
        { provide: CreateTicketUseCase, useValue: createUseCase },
        { provide: UpdateTicketUseCase, useValue: updateUseCase },
        { provide: DeleteTicketUseCase, useValue: deleteUseCase },
      ],
    }).compile();

    controller = module.get<TicketCrudController>(TicketCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getById', () => {
    it('should return a ticket', async () => {
      const ticket = new Ticket('t1', TicketType.GENERAL, 5000, 100, 10);
      (getUseCase.execute as jest.Mock).mockResolvedValue(ticket);
      await expect(controller.getById('t1')).resolves.toEqual(ticket);
      expect(getUseCase.execute).toHaveBeenCalledWith('t1');
    });

    it('should propagate errors', async () => {
      (getUseCase.execute as jest.Mock).mockRejectedValue(new Error('not found'));
      await expect(controller.getById('x')).rejects.toThrow('not found');
    });
  });

  describe('create', () => {
    it('should create and return the ticket', async () => {
      const input = { type: TicketType.VIP, price: 10000, availableQuantity: 5 };
      const ticket = new Ticket('t2', input.type, input.price, input.availableQuantity, 0);
      (createUseCase.execute as jest.Mock).mockResolvedValue(ticket);

      await expect(controller.create(input)).resolves.toEqual(ticket);
      expect(createUseCase.execute).toHaveBeenCalledWith(input);
    });
  });

  describe('update', () => {
    it('should update and return the ticket', async () => {
      const id = 't3';
      const input = { price: 7500 };
      const ticket = new Ticket(id, TicketType.GENERAL, 7500, 10, 1);
      (updateUseCase.execute as jest.Mock).mockResolvedValue(ticket);

      await expect(controller.update(id, input as any)).resolves.toEqual(ticket);
      expect(updateUseCase.execute).toHaveBeenCalledWith(id, input);
    });
  });

  describe('remove', () => {
    it('should delete and return confirmation', async () => {
      (deleteUseCase.execute as jest.Mock).mockResolvedValue(undefined);
      await expect(controller.remove('t9')).resolves.toEqual({ id: 't9', status: 'DELETED' });
      expect(deleteUseCase.execute).toHaveBeenCalledWith('t9');
    });
  });
});
