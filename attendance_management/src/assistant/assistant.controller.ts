import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { Assistant } from '../common/interfaces/assistant.interface';

@Controller('assistants')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAssistantDto: CreateAssistantDto): Promise<Assistant> {
    return this.assistantService.create(createAssistantDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Assistant[]> {
    return this.assistantService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Assistant> {
    return this.assistantService.findOne(id);
  }

  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(@Param('id', ParseIntPipe) id: number): Promise<Assistant> {
    return this.assistantService.confirmStatus(id);
  }
  
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssistantDto: UpdateAssistantDto,
  ): Promise<Assistant> {
    return this.assistantService.update(id, updateAssistantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.assistantService.remove(id);
  }
}