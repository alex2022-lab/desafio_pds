import { Module } from '@nestjs/common';
import { TicketController } from './infrastructure/controller/ticket.controller';
import { VerifyEventAvailabilityUseCase } from './application/use-cases/verify-event-disponibility.use-case';
import { TICKET_REPOSITORY_PORT } from './domain/repository/ticket.repository.port';
import { TicketRepositoryAdapter } from './infrastructure/ticket.repository.adapter';
import { PurchaseTicketsUseCase } from './application/use-cases/purchase-tickets.use-case';

@Module({
  imports: [],
  controllers: [TicketController],
  providers: [
    VerifyEventAvailabilityUseCase,
    PurchaseTicketsUseCase,
    {
      provide: TICKET_REPOSITORY_PORT,
      useClass: TicketRepositoryAdapter, // Aquí se debería proporcionar la implementación real del repositorio
    },
  ],
})
export class TicketModule {}
