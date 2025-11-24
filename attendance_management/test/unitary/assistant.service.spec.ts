import { Test, TestingModule } from '@nestjs/testing';
import { AssistantService } from '../../src/assistant/assistant.service';
import { AssistantRepository } from '../../src/assistant/assistant.repository';
import { AssistantStatus } from '../../src/common/enums/status.enum';
import { CreateAssistantDto } from '../../src/assistant/dto/create-assistant.dto';
import { Assistant } from '../../src/common/interfaces/assistant.interface';
import { NotFoundException } from '@nestjs/common';

// Mock date strings
const mockDate = new Date().toISOString();

// Mock data
const mockAssistant: Assistant = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@test.com',
  status: AssistantStatus.NOT_CONFIRMED,
  createdAt: mockDate,
  updatedAt: mockDate,
};

// Mock implementation for the Repository
const mockAssistantRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('AssistantService', () => {
  let service: AssistantService;
  let repository: AssistantRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantService,
        {
          provide: AssistantRepository,
          useValue: mockAssistantRepository,
        },
      ],
    }).compile();

    service = module.get<AssistantService>(AssistantService);
    repository = module.get<AssistantRepository>(AssistantRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Ensure findOne returns the mock assistant by default for existence checks
    mockAssistantRepository.findOne.mockResolvedValue(mockAssistant); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.create and return the new assistant with date stamps', async () => {
      const createDto: CreateAssistantDto = {
        name: 'Jane Doe',
        email: 'jane.doe@test.com',
        status: AssistantStatus.NOT_CONFIRMED,
      };
      // Repository returns the base mock, service ensures dates are set
      const expectedResult = { ...mockAssistant, id: 2, name: 'Jane Doe' };

      mockAssistantRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result.name).toBe('Jane Doe');
      expect(result.createdAt).toEqual(mockDate);
      expect(result.updatedAt).toEqual(mockDate);
    });
  });

  describe('findAll', () => {
    it('should call repository.findAll and return an array of assistants with date stamps', async () => {
      const expectedResult = [mockAssistant, { ...mockAssistant, id: 2 }];

      mockAssistantRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result[0].createdAt).toEqual(mockDate); // Check dates
    });
  });

  describe('findOne', () => {
    it('should call repository.findOne and return a single assistant with date stamps', async () => {
      mockAssistantRepository.findOne.mockResolvedValue(mockAssistant);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAssistant);
      expect(result.createdAt).toEqual(mockDate); // Check dates
    });
    
    it('should throw NotFoundException if assistant is not found', async () => {
      mockAssistantRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith(99);
    });
  });

  describe('update', () => {
    const updateDto = { name: 'Updated Name' };

    it('should call findOne, then repository.update and return the updated assistant', async () => {
      const updatedAssistant = { ...mockAssistant, name: 'Updated Name' };
      
      mockAssistantRepository.update.mockResolvedValue(updatedAssistant);

      const result = await service.update(1, updateDto);

      // 1. Verify existence check
      expect(repository.findOne).toHaveBeenCalledWith(1);
      // 2. Verify update call
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      // 3. Verify result structure
      expect(result.name).toBe('Updated Name');
      expect(result.createdAt).toEqual(mockDate);
    });

    it('should throw NotFoundException if the assistant does not exist (pre-check)', async () => {
        mockAssistantRepository.findOne.mockResolvedValue(null);
  
        await expect(service.update(99, updateDto)).rejects.toThrow(NotFoundException);
        expect(repository.findOne).toHaveBeenCalledWith(99);
        expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if update returns null (post-check)', async () => {
        // First findOne succeeds, second update returns null
        mockAssistantRepository.update.mockResolvedValue(null); 
  
        await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
        expect(repository.findOne).toHaveBeenCalledWith(1);
        expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('confirmStatus', () => {
    const updateDto = { status: 'confirmed' };

    it('should call repository.update with CONFIRMED status and return the confirmed assistant', async () => {
      const confirmedAssistant = { ...mockAssistant, status: AssistantStatus.CONFIRMED };
      
      mockAssistantRepository.update.mockResolvedValue(confirmedAssistant);
      
      const result = await service.confirmStatus(1);

      // 1. Verify existence check
      expect(repository.findOne).toHaveBeenCalledWith(1);
      // 2. Verify update call with the correct payload
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      // 3. Verify result status and dates
      expect(result.status).toBe(AssistantStatus.CONFIRMED);
      expect(result.createdAt).toEqual(mockDate);
    });

    it('should throw NotFoundException if the assistant is not found (pre-check)', async () => {
      mockAssistantRepository.findOne.mockResolvedValue(null);

      await expect(service.confirmStatus(99)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith(99);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if update returns null (post-check)', async () => {
      // First findOne succeeds, second update returns null
      mockAssistantRepository.update.mockResolvedValue(null); 

      await expect(service.confirmStatus(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });
});