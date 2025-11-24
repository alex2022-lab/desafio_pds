import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { AssistantRepository } from './assistant.repository';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [AssistantController],
  providers: [AssistantService, AssistantRepository],
})
export class AssistantModule {}