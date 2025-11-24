import { AssistantStatus } from '../../common/enums/status.enum';

export interface Assistant {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: AssistantStatus;
}