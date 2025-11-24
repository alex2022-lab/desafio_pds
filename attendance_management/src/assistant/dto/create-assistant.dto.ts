import { IsString, IsEmail, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { AssistantStatus } from '../../common/enums/status.enum';

export class CreateAssistantDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsEnum(AssistantStatus)
  @IsOptional()
  readonly status: AssistantStatus = AssistantStatus.NOT_CONFIRMED;
}