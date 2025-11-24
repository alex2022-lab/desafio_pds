import { Test, TestingModule } from '@nestjs/testing';
import { AssistantController } from '../../src/assistant/assistant.controller';
import { AssistantService } from '../../src/assistant/assistant.service';
import { CreateAssistantDto } from '../../src/assistant/dto/create-assistant.dto';
import { UpdateAssistantDto } from '../../src/assistant/dto/update-assistant.dto';
import { Assistant } from '../../src/common/interfaces/assistant.interface';
import { AssistantStatus } from '../../src/common/enums/status.enum';
import { HttpStatus } from '@nestjs/common';

// Mock data
const mockDate = new Date().toISOString();

const mockAssistant: Assistant = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@test.com',
  status: AssistantStatus.CONFIRMED,
  createdAt: mockDate,
  updatedAt: mockDate,
};

// Mock implementation for the Service, using the new method names
const mockAssistantService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  confirmStatus: jest.fn(),
  remove: jest.fn(),
};

describe('AssistantController', () => {
  let controller: AssistantController;
  let service: AssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssistantController],
      providers: [
        {
          provide: AssistantService,
          useValue: mockAssistantService,
        },
      ],
    }).compile();

    controller = module.get<AssistantController>(AssistantController);
    service = module.get<AssistantService>(AssistantService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /assistants', () => {
    it('should call service.create and return the created assistant', async () => {
      const createDto: CreateAssistantDto = {
        name: 'Jane Smith',
        email: 'jane@test.com',
        status: AssistantStatus.NOT_CONFIRMED,
      };
      mockAssistantService.create.mockResolvedValue(mockAssistant);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockAssistant);
    });
  });

  describe('GET /assistants', () => {
    it('should call service.findAll and return an array of assistants', async () => {
      const expectedResult = [mockAssistant, { ...mockAssistant, id: 2 }];
      mockAssistantService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
      expect(result.length).toBe(2);
    });
  });

  describe('GET /assistants/:id', () => {
    it('should call service.findOne and return a single assistant', async () => {
      mockAssistantService.findOne.mockResolvedValue(mockAssistant);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAssistant);
    });
  });

  describe('PATCH /assistants/:id', () => {
    it('should call service.update and return the updated assistant', async () => {
      const updateDto: UpdateAssistantDto = { name: 'New Name' };
      const updatedMock = { ...mockAssistant, name: 'New Name' };
      mockAssistantService.update.mockResolvedValue(updatedMock);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedMock);
    });
  });

  describe('PATCH /assistants/:id/confirm', () => {
    it('should call service.confirmStatus and return the confirmed assistant', async () => {
      const confirmedMock = { ...mockAssistant, status: AssistantStatus.CONFIRMED };
      mockAssistantService.confirmStatus.mockResolvedValue(confirmedMock);

      const result = await controller.confirm(1);

      expect(service.confirmStatus).toHaveBeenCalledWith(1);
      expect(result.status).toBe(AssistantStatus.CONFIRMED);
    });
  });

  describe('DELETE /assistants/:id', () => {
    it('should call service.remove and return void (204 No Content)', async () => {
      mockAssistantService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});