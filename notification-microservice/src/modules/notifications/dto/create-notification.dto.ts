import { IsString, IsNotEmpty, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsDate()
  @Type(() => Date)
  date!: Date;

  @IsArray()
  @IsString({ each: true })
  recipients!: string[];
}