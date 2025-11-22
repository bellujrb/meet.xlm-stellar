import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from '@core/config/env.service';
import { LoggerService } from '@core/logger/logger.service';
import { EventPublisher } from '@core/events/event-publisher';
import { EventsModule } from '@events/events.module';

/**
 * AppModule
 *
 * Root NestJS module that configures the entire application.
 * Provides:
 * - Environment configuration with validation
 * - Global logger service
 * - Event publishing infrastructure
 * - Repository patterns for database
 *
 * All modules should import this module to access shared services.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventsModule,
  ],
  providers: [
    // Configuration
    EnvService,

    // Logging
    LoggerService,

    // Events
    EventPublisher,
  ],
  exports: [
    EnvService,
    LoggerService,
    EventPublisher,
  ],
})
export class AppModule {
  constructor(private envService: EnvService, private loggerService: LoggerService) {
    const logger = this.loggerService.createLogger('AppModule');

    logger.info('Application module initialized', {
      environment: this.envService.get('NODE_ENV'),
      port: this.envService.get('PORT'),
    });
  }
}

