import { Controller, Get, Param } from '@nestjs/common';
import { VerifyEventAvailabilityUseCase } from '../../application/use-cases/verify-event-disponibility.use-case';

@Controller('/event')
export class TicketController {
  constructor(
    private readonly verifyEventAvailability: VerifyEventAvailabilityUseCase,
  ) {}

  @Get(':id/tickets/availability')
  async getAvailability(@Param('id') id: string) {
    return this.verifyEventAvailability.execute(id);
  }
}
