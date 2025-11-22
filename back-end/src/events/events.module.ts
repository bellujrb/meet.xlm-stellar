import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventRepository } from '@database/repositories/event.repository';
import { LoggerService } from '@core/logger/logger.service';
import { EnvService } from '@core/config/env.service';
import { EventPublisher } from '@core/events/event-publisher';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventRepository, LoggerService, EnvService, EventPublisher],
  exports: [EventsService],
})
export class EventsModule {}

