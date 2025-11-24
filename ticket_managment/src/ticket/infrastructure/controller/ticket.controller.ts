import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VerifyEventAvailabilityUseCase } from '../../application/use-cases/verify-event-disponibility.use-case';

import { type PurchaseTicketsDto } from '../dto/purchase-tickets.dto';
import { PurchaseTicketsUseCase } from '../../application/use-cases/purchase-tickets.use-case';

@Controller('/event')
export class TicketController {
  constructor(
    private readonly verifyEventAvailability: VerifyEventAvailabilityUseCase,
    private readonly purchaseTicketsUseCase: PurchaseTicketsUseCase,
  ) {}

  @Get(':id/ticket/availability')
  async getAvailability(@Param('id') eventId: string) {
    return this.verifyEventAvailability.execute(eventId);
  }
  @Post(':id/ticket/purchase')
  async purchaseTickets(
    @Param('id') eventId: string,
    @Body() body: PurchaseTicketsDto,
  ) {
    return await this.purchaseTicketsUseCase.execute(
      eventId,
      body.quantity,
      body.ticketType,
    );
  }
}
