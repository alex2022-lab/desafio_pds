import { Module } from '@nestjs/common';
import { TicketController } from './infrastructure/controller/ticket.controller';
import { VerifyEventAvailabilityUseCase } from './application/use-cases/verify-event-disponibility.use-case';
import { TICKET_REPOSITORY_PORT } from './domain/repository/ticket.repository.port';
import { TicketRepositoryAdapter } from './infrastructure/ticket.repository.adapter';
import { PurchaseTicketsUseCase } from './application/use-cases/purchase-tickets.use-case';
import { TicketCrudController } from './infrastructure/controller/ticket.crud.controller';
import { GetTicketUseCase } from './application/use-cases/get-ticket.use-case';
import { CreateTicketUseCase } from './application/use-cases/create-ticket.use-case';
import { UpdateTicketUseCase } from './application/use-cases/update-ticket.use-case';
import { DeleteTicketUseCase } from './application/use-cases/delete-ticket.use-case';

@Module({
  imports: [],
  controllers: [TicketController, TicketCrudController],
  providers: [
    VerifyEventAvailabilityUseCase,
    PurchaseTicketsUseCase,
    GetTicketUseCase,
    CreateTicketUseCase,
    UpdateTicketUseCase,
    DeleteTicketUseCase,
    {
      provide: TICKET_REPOSITORY_PORT,
      useClass: TicketRepositoryAdapter, // Aquí se debería proporcionar la implementación real del repositorio
    },
  ],
})
export class TicketModule {}
