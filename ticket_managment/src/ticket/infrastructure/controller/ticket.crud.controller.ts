import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetTicketUseCase } from '../../application/use-cases/get-ticket.use-case';
import { CreateTicketUseCase } from '../../application/use-cases/create-ticket.use-case';
import { UpdateTicketUseCase } from '../../application/use-cases/update-ticket.use-case';
import { DeleteTicketUseCase } from '../../application/use-cases/delete-ticket.use-case';
import { type CreateTicketDto } from '../dto/create-ticket.dto';
import { type UpdateTicketDto } from '../dto/update-ticket.dto';

@Controller('/ticket')
export class TicketCrudController {
  constructor(
    private readonly getTicket: GetTicketUseCase,
    private readonly createTicket: CreateTicketUseCase,
    private readonly updateTicket: UpdateTicketUseCase,
    private readonly deleteTicket: DeleteTicketUseCase,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getTicket.execute(id);
  }

  @Post()
  async create(@Body() body: CreateTicketDto) {
    return this.createTicket.execute(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTicketDto) {
    return this.updateTicket.execute(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteTicket.execute(id);
    return { id, status: 'DELETED' };
  }
}
