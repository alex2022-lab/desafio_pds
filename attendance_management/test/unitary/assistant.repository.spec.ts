import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AssistantRepository } from '../../src/assistant/assistant.repository';
import { Assistant } from '../../src/assistant/interfaces/assistant.interface';
import { of } from 'rxjs';
import { CreateAssistantDto } from '../../src/assistant/dto/create-assistant.dto';
import { UpdateAssistantDto } from '../../src/assistant/dto/update-assistant.dto';
import { AxiosResponse } from 'axios';
import { AssistantStatus } from '../../src/common/enums/status.enum';

const mockAssistantData: Assistant = {
  id: 1,
  name: 'Test Assistant',
  email: 'test@test.com',
  status: AssistantStatus.CONFIRMED,
};

const mockAssistantsList: Assistant[] = [
  mockAssistantData,
  { ...mockAssistantData, id: 2, email: 'test2@test.com' },
];

const mockApiKey = 'mock-api-key-12345';
const expectedHeaders = {
  headers: {
    Authorization: `Bearer ${mockApiKey}`,
    'Content-Type': 'application/json',
  },
};

describe('AssistantRepository (Unit - HTTP based)', () => {
  let repository: AssistantRepository;
  let mockHttpService: HttpService;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    const mockHttpServiceMock = {
      get: jest.fn(() => of({ data: mockAssistantsList } as AxiosResponse)),
      post: jest.fn(() => of({ data: mockAssistantData } as AxiosResponse)),
      patch: jest.fn(() => of({ data: mockAssistantData } as AxiosResponse)), 
      delete: jest.fn(() => of({ data: {} } as AxiosResponse)),
    };

    const mockConfigServiceMock = {
      get: jest.fn((key: string) => {
        if (key === 'EXTERNAL_API_KEY') {
          return mockApiKey;
        }
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantRepository,
        {
          provide: HttpService,
          useValue: mockHttpServiceMock,
        },
        {
          provide: ConfigService,
          useValue: mockConfigServiceMock,
        },
      ],
    }).compile();

    repository = module.get<AssistantRepository>(AssistantRepository);
    mockHttpService = module.get<HttpService>(HttpService);
    mockConfigService = module.get<ConfigService>(ConfigService);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined and initialize headers', () => {
    expect(repository).toBeDefined();
    expect(mockConfigService.get).toHaveBeenCalledWith('EXTERNAL_API_KEY');
  });

  describe('create', () => {
    it('should call httpService.post with the correct DTO and return the result data', async () => {
      const createDto: CreateAssistantDto = {
        name: 'New Assistant',
        email: 'new@test.com',
        status: AssistantStatus.NOT_CONFIRMED,
      };

      const expectedResult: Assistant = {
        ...mockAssistantData,
        ...createDto,
        id: mockAssistantData.id,
      };

      (mockHttpService.post as jest.Mock).mockReturnValue(of({ data: expectedResult } as AxiosResponse));

      const result = await repository.create(createDto);

      const expectedPostData = {
        name: 'New Assistant',
        email: 'new@test.com',
        status: 'not confirmed',
      };
      
      expect(mockHttpService.post).toHaveBeenCalledWith('/assistants', expectedPostData, expectedHeaders);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call httpService.get and return an array of assistants', async () => {
      const expectedResult = mockAssistantsList;
      (mockHttpService.get as jest.Mock).mockReturnValue(of({ data: expectedResult } as AxiosResponse));

      const result = await repository.findAll();

      expect(mockHttpService.get).toHaveBeenCalledWith('/assistants', expectedHeaders);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    const id = 1;
    it('should call httpService.get with the correct ID and return the assistant data', async () => {
      (mockHttpService.get as jest.Mock).mockReturnValue(of({ data: mockAssistantData } as AxiosResponse));

      const result = await repository.findOne(id);

      expect(mockHttpService.get).toHaveBeenCalledWith(`/assistants/${id}`, expectedHeaders);
      expect(result).toEqual(mockAssistantData);
    });

    it('should return null if assistant is not found (simulando API sin datos)', async () => {
      const notFoundId = 99;
      
      (mockHttpService.get as jest.Mock).mockReturnValue(
        of({ data: null, status: 404, statusText: 'Not Found', headers: {}, config: {}, request: {} } as AxiosResponse)
      );

      const result = await repository.findOne(notFoundId);

      expect(mockHttpService.get).toHaveBeenCalledWith(`/assistants/${notFoundId}`, expectedHeaders);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const id = 1;
    const updateDto: UpdateAssistantDto = { status: AssistantStatus.NOT_CONFIRMED, name: 'Updated Name' };

    it('should call httpService.patch with the ID and DTO, and return the updated assistant data', async () => {
      const expectedResult: Assistant = { ...mockAssistantData, ...updateDto };

      (mockHttpService.patch as jest.Mock).mockReturnValue(of({ data: expectedResult } as AxiosResponse));

      const result = await repository.update(id, updateDto);

      expect(mockHttpService.patch).toHaveBeenCalledWith(`/assistants/${id}`, updateDto, expectedHeaders);
      expect(result).toEqual(expectedResult);
    });

    it('should return null if the assistant was not found during update (simulando API error handling)', async () => {
      (mockHttpService.patch as jest.Mock).mockReturnValue(
        of({ data: null, status: 404, statusText: 'Not Found', headers: {}, config: {}, request: {} } as AxiosResponse)
      );

      const result = await repository.update(id, updateDto);

      expect(mockHttpService.patch).toHaveBeenCalledWith(`/assistants/${id}`, updateDto, expectedHeaders);
      expect(result).toBeNull();
    });
  });
});