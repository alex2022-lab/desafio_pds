import axios from 'axios';
import { AssistantStatus } from '../../src/common/enums/status.enum';
import { CreateAssistantDto } from 'src/assistant/dto/create-assistant.dto';

const uniqueSuffix = Date.now();
const TEST_EMAIL = `smoke.test.${uniqueSuffix}@example.com`; 

const initialAssistant: CreateAssistantDto = {
  name: 'Smoke Test User',
  email: TEST_EMAIL,
  phone: '5551234567',
  status: AssistantStatus.NOT_CONFIRMED,
};

interface AssistantResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: AssistantStatus;
}

const BASE_URL = 'http://localhost:3041';
const GLOBAL_PREFIX = '/api/v1';

const API_ENDPOINT = `${BASE_URL}${GLOBAL_PREFIX}/assistants`;


describe('Assistant API Smoke Test (CRUD Flow)', () => {
  let createdAssistantId: number;

  test('POST /assistants: Should create a new assistant', async () => {
    try {
      const response = await axios.post<AssistantResponse>(
        API_ENDPOINT,
        initialAssistant,
      );

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(initialAssistant.name);
      expect(response.data.email).toBe(initialAssistant.email);
      expect(response.data.status).toBe(AssistantStatus.NOT_CONFIRMED);

      createdAssistantId = response.data.id;
    } catch (error) {
      console.error('POST failed:', error.response?.data || error.message);
      throw new Error('Smoke Test Failed: Unable to create Assistant.');
    }
  });

  test('GET /assistants/:id: Should retrieve the created assistant', async () => {
    if (!createdAssistantId) {
      throw new Error('Prerequisite failed: No ID available from POST test.');
    }

    try {
      const response = await axios.get<AssistantResponse>(
        `${API_ENDPOINT}/${createdAssistantId}`,
      );

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdAssistantId);
      expect(response.data.name).toBe(initialAssistant.name);
    } catch (error) {
      console.error('GET failed:', error.response?.data || error.message);
      throw new Error('Smoke Test Failed: Unable to read Assistant.');
    }
  });

  test('PATCH /assistants/:id: Should update the assistant name AND confirm status', async () => {
    if (!createdAssistantId) {
      throw new Error('Prerequisite failed: No ID available from POST test.');
    }

    const newName = 'Updated Smoke Name';
    const updatePayload = { 
        name: newName,
        status: AssistantStatus.CONFIRMED 
    };

    try {
      const response = await axios.patch<AssistantResponse>(
        `${API_ENDPOINT}/${createdAssistantId}`,
        updatePayload,
      );

      expect(response.status).toBe(200);
      expect(response.data.name).toBe(newName);
      expect(response.data.status).toBe(AssistantStatus.CONFIRMED); // Verificar confirmación
    } catch (error) {
      console.error('PATCH update failed:', error.response?.data || error.message);
      throw new Error('Smoke Test Failed: Unable to update Assistant.');
    }
  });
  
  test('DELETE /assistants/:id: Should remove the created assistant', async () => {
    if (!createdAssistantId) {
      return; 
    }

    try {
      const response = await axios.delete(`${API_ENDPOINT}/${createdAssistantId}`);

      expect(response.status).toBe(204);

    } catch (error) {
      console.error('DELETE failed:', error.response?.data || error.message);
      throw new Error('Smoke Test Failed: Unable to delete Assistant (Cleanup failed).');
    }
  });
});