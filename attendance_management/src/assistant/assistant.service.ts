import { Injectable, NotFoundException } from '@nestjs/common';
import { AssistantRepository } from './assistant.repository';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { Assistant } from '../common/interfaces/assistant.interface';
import { AssistantStatus } from 'src/common/enums/status.enum';

@Injectable()
export class AssistantService {
  constructor(private readonly assistantRepository: AssistantRepository) {}

  async create(createAssistantDto: CreateAssistantDto): Promise<Assistant> {
    const assistant = await this.assistantRepository.create(createAssistantDto);
    const now = new Date();
    return {
      ...assistant,
      createdAt: (assistant as any).createdAt ?? now,
      updatedAt: (assistant as any).updatedAt ?? now,
    };
  }

  async findAll(): Promise<Assistant[]> {
    const assistants = await this.assistantRepository.findAll();
    const now = new Date();
    return assistants.map((assistant) => ({
      ...assistant,
      createdAt: (assistant as any).createdAt ?? now,
      updatedAt: (assistant as any).updatedAt ?? now,
    }));
  }

  async findOne(id: number): Promise<Assistant> {
    const assistant = await this.assistantRepository.findOne(id);
    if (!assistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found.`);
    }
    const now = new Date();
    return {
      ...assistant,
      createdAt: (assistant as any).createdAt ?? now,
      updatedAt: (assistant as any).updatedAt ?? now,
    };
  }

  async update(id: number, updateAssistantDto: UpdateAssistantDto): Promise<Assistant> {
    const existingAssistant = await this.assistantRepository.findOne(id);
    
    if (!existingAssistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found.`);
    }

    const updatedAssistant = await this.assistantRepository.update(id, updateAssistantDto);

    if (!updatedAssistant) {
      throw new NotFoundException(`Assistant with ID ${id} could not be updated or was not found during update.`);
    }
    
    const now = new Date();
    return {
      ...updatedAssistant,
      createdAt: (updatedAssistant as any).createdAt ?? now,
      updatedAt: (updatedAssistant as any).updatedAt ?? now,
    };
  }

  async confirmStatus(id: number): Promise<Assistant> {
    const updateDto: UpdateAssistantDto = { status: 'confirmed' as unknown as any as AssistantStatus };
    
    const existingAssistant = await this.assistantRepository.findOne(id);
    
    if (!existingAssistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found.`);
    }

    const updatedAssistant = await this.assistantRepository.update(id, updateDto);

    if (!updatedAssistant) {
      throw new NotFoundException(`Assistant with ID ${id} could not be confirmed.`);
    }
    
    const now = new Date();
    return {
      ...updatedAssistant,
      createdAt: (updatedAssistant as any).createdAt ?? now,
      updatedAt: (updatedAssistant as any).updatedAt ?? now,
    };
  }

  async remove(id: number): Promise<void> {
    const existingAssistant = await this.assistantRepository.findOne(id);

    if (!existingAssistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found.`);
    }
  }
}