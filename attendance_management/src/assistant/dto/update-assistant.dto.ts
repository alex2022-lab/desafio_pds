import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AssistantStatus } from '../../common/enums/status.enum';

export class UpdateAssistantDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsEnum(AssistantStatus)
  readonly status?: AssistantStatus;
}