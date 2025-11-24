import { AssistantStatus } from '../enums/status.enum';

export interface Assistant {
  id: number;
  
  name: string;
  
  email: string;
  
  status: AssistantStatus;

  createdAt: string;
  
  updatedAt: string;
}