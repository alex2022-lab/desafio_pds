import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AssistantRepository } from '../../src/assistant/assistant.repository';
// FIX: Usamos require() en lugar de 'import * as Nock from "nock"' para manejar
// los exports mixtos de CJS de nock y resolver el error de TypeScript "not callable" (ts(2349)).
const Nock = require('nock');
import { CreateAssistantDto } from '../../src/assistant/dto/create-assistant.dto';
import { UpdateAssistantDto } from '../../src/assistant/dto/update-assistant.dto'; // Importamos DTO de actualización
import { Assistant } from '../../src/assistant/interfaces/assistant.interface';
import { AssistantStatus } from '../../src/common/enums/status.enum';
import { AxiosError } from 'axios';

// 1. FIX: Definimos la URL base que Nock debe interceptar.
// La traza de error indica que el host real es 'localhost:3000'.
const MOCK_DB_URL = 'http://localhost:3000';
// FIX: El path completo que el repositorio está utilizando, que incluye el prefijo '/attendees'.
const ASSISTANTS_PATH = '/attendees/assistants';

describe('AssistantRepository (Integration Mocked)', () => {
  let repository: AssistantRepository;
  let configService: ConfigService;

  beforeAll(() => {
    // Utilizamos Nock para las utilidades estáticas
    Nock.disableNetConnect(); // Permitimos la conexión a localhost para que nock pueda interceptar sin fallar la conexión inicial.
    Nock.enableNetConnect('127.0.0.1');
    Nock.enableNetConnect('localhost');
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // 2. Sobrescribimos la configuración para usar la URL mockeada (localhost:3000)
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              // Esta es la clave que usas en el repository: 'databaseService.baseUrl'
              databaseService: { baseUrl: MOCK_DB_URL },
              EXTERNAL_API_KEY: 'test-key', // También configuramos la API Key que se usa
            }),
          ],
        }), // FIX: Configurar HttpModule con registerAsync para asegurar que use el MOCK_DB_URL
        // como baseURL, forzando a HttpService a dirigir las peticiones al destino mockeado por Nock.
        HttpModule.registerAsync({
          useFactory: (configService: ConfigService) => ({
            baseURL: configService.get<string>('databaseService.baseUrl'),
            // Aseguramos que el header de Autorización se pase en las pruebas,
            // ya que el error de conexión mostró que se estaba enviando.
            headers: {
              Authorization: `Bearer ${configService.get<string>('EXTERNAL_API_KEY')}`,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [AssistantRepository],
    }).compile();

    repository = module.get<AssistantRepository>(AssistantRepository);
    configService = module.get<ConfigService>(ConfigService); // Verificamos que la configuración se haya inyectado correctamente

    expect(configService.get('databaseService.baseUrl')).toBe(MOCK_DB_URL);
  }); // Limpiamos los mocks de nock después de cada prueba

  afterEach(() => {
    // Usamos Nock para limpiar
    Nock.cleanAll();
  }); // Re-habilitamos las conexiones de red después de todas las pruebas

  afterAll(() => {
    // Usamos Nock para habilitar
    Nock.enableNetConnect();
  }); // --- Pruebas de Integración para el método create ---

  describe('create', () => {
    it('should create an assistant and return the result', async () => {
      const createDto: CreateAssistantDto = {
        name: 'Test Assistant',
        email: 'test@example.com',
        phone: '123',
        status: AssistantStatus.CONFIRMED,
      };

      const expectedResponse: Assistant = {
        id: 1,
        ...createDto,
        status: AssistantStatus.CONFIRMED,
      }; // 3. Mockeamos la respuesta de la API externa (database_module)
      // Usamos Nock() para mockear

      Nock(MOCK_DB_URL)
        .post(ASSISTANTS_PATH) // Intercepta la llamada POST a /attendees/assistants
        .reply(201, expectedResponse); // Responde con estado 201 y el cuerpo esperado

      const result = await repository.create(createDto); // 4. Verificamos el resultado

      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error when the database service fails', async () => {
      const createDto: CreateAssistantDto = {
        name: 'Fail Assistant',
        email: 'fail@example.com',
        phone: '123',
        status: AssistantStatus.CONFIRMED,
      }; // 5. Mockeamos una respuesta de fallo

      Nock(MOCK_DB_URL)
        .post(ASSISTANTS_PATH)
        .reply(500, { message: 'DB internal error' }); // Esperamos que la llamada al repositorio falle

      await expect(repository.create(createDto)).rejects.toBeInstanceOf(
        AxiosError,
      );
    });
  }); // --- Pruebas de Integración para el método findOne ---

  describe('findOne', () => {
    const assistantId = 123;
    const expectedAssistant: Assistant = {
      id: assistantId,
      name: 'Found Assistant',
      email: 'found@example.com',
      phone: '123',
      status: AssistantStatus.CONFIRMED,
    };

    it('should return the assistant data on success', async () => {
      // Mockeamos la respuesta de éxito
      Nock(MOCK_DB_URL)
        .get(`${ASSISTANTS_PATH}/${assistantId}`)
        .reply(200, expectedAssistant);

      const result = await repository.findOne(assistantId);
      expect(result).toEqual(expectedAssistant);
    });

    it('should return null when the database service returns a 404', async () => {
      // Mockeamos la respuesta de 404 (NotFound), que tu código maneja para devolver null
      Nock(MOCK_DB_URL)
        .get(`${ASSISTANTS_PATH}/${assistantId}`)
        .reply(404, { message: 'Not Found' });

      const result = await repository.findOne(assistantId);
      expect(result).toBeNull();
    });

    it('should throw an error for other HTTP errors (e.g., 401)', async () => {
      // Mockeamos una respuesta de error diferente a 404 (ej. 401 Unauthorized)
      Nock(MOCK_DB_URL)
        .get(`${ASSISTANTS_PATH}/${assistantId}`)
        .reply(401, { message: 'Unauthorized' }); // Esperamos que falle ya que no es un 404

      await expect(repository.findOne(assistantId)).rejects.toBeInstanceOf(
        AxiosError,
      );
    });
  }); // --- Pruebas de Integración para el método findAll (GET /attendees/assistants) ---

  describe('findAll', () => {
    const mockAssistants: Assistant[] = [
      {
        id: 1,
        name: 'Assistant A',
        email: 'a@ex.com',
        phone: '1',
        status: AssistantStatus.CONFIRMED,
      },
      {
        id: 2,
        name: 'Assistant B',
        email: 'b@ex.com',
        phone: '2',
        status: AssistantStatus.NOT_CONFIRMED,
      },
    ];

    it('should return an array of assistants on success', async () => {
      // Mockeamos la respuesta de éxito (HTTP 200)
      Nock(MOCK_DB_URL).get(ASSISTANTS_PATH).reply(200, mockAssistants);

      const result = await repository.findAll();
      expect(result).toEqual(mockAssistants);
    });

    it('should return an empty array if the database service returns an empty list', async () => {
      // Mockeamos la respuesta de éxito con un array vacío (HTTP 200)
      Nock(MOCK_DB_URL).get(ASSISTANTS_PATH).reply(200, []);

      const result = await repository.findAll();
      expect(result).toEqual([]);
    });

    it('should throw an error when the database service fails', async () => {
      // Mockeamos una respuesta de fallo (HTTP 500)
      Nock(MOCK_DB_URL)
        .get(ASSISTANTS_PATH)
        .reply(500, { message: 'Internal Server Error' });

      await expect(repository.findAll()).rejects.toBeInstanceOf(AxiosError);
    });
  }); // --- Pruebas de Integración para el método update (PATCH /attendees/assistants/:id) ---

  describe('update', () => {
    const assistantId = 456;
    const updateDto: UpdateAssistantDto = {
      status: AssistantStatus.CONFIRMED,
      phone: '555-555-5555',
    };
    const updatedAssistant: Assistant = {
      id: assistantId,
      name: 'Existing Name',
      email: 'existing@example.com',
      phone: updateDto.phone,
      status: updateDto.status!,
    };

    it('should update an assistant and return the updated result on success', async () => {
      // Mockeamos la respuesta de éxito (HTTP 200)
      // Nock intercepta la llamada PATCH al ID, y verifica el cuerpo (updateDto)
      Nock(MOCK_DB_URL)
        .patch(`${ASSISTANTS_PATH}/${assistantId}`, updateDto)
        .reply(200, updatedAssistant);

      const result = await repository.update(assistantId, updateDto);
      expect(result).toEqual(updatedAssistant);
    });

    it('should return null when the database service returns a 404', async () => {
      // Mockeamos la respuesta de 404 (NotFound), que el repositorio debe manejar como null
      Nock(MOCK_DB_URL)
        .patch(`${ASSISTANTS_PATH}/${assistantId}`, updateDto)
        .reply(404, { message: 'Assistant Not Found' });

      const result = await repository.update(assistantId, updateDto);
      expect(result).toBeNull();
    });

    it('should throw an error for other HTTP errors (e.g., 400 Bad Request)', async () => {
      // Mockeamos una respuesta de error de validación (HTTP 400)
      Nock(MOCK_DB_URL)
        .patch(`${ASSISTANTS_PATH}/${assistantId}`, updateDto)
        .reply(400, { message: 'Invalid payload' });

      await expect(
        repository.update(assistantId, updateDto),
      ).rejects.toBeInstanceOf(AxiosError);
    });
  });
});
