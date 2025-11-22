import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import pino from 'pino';
import { EnvService } from '@core/config/env.service';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: Record<string, unknown>;
  stack?: string;
}

/**
 * LoggerService
 *
 * Centralized logging service with:
 * - Console output via pino
 * - Database persistence in Supabase (logs table)
 * - Structured logging format
 * - Context isolation
 *
 * @example
 * const logger = this.loggerService.createLogger('EventController');
 * logger.info('Event created', { eventId: '123' });
 */
@Injectable()
export class LoggerService {
  private supabase: SupabaseClient;
  private pinoLogger: pino.Logger;
  private logBuffer: LogEntry[] = [];
  private flushInterval = 5000; // 5 seconds

  constructor(private envService: EnvService) {
    // Initialize Pino logger
    this.pinoLogger = pino(
      {
        level: this.envService.get('LOG_LEVEL'),
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: !this.envService.isProduction(),
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      },
      pino.destination()
    );

    // Initialize Supabase client
    const { url, serviceKey } = this.envService.getSupabaseConfig();
    this.supabase = createClient(url, serviceKey);

    // Start buffer flush interval
    this.startBufferFlush();
  }

  /**
   * Create a logger instance with context
   */
  createLogger(context: string) {
    return {
      debug: (message: string, metadata?: Record<string, unknown>) =>
        this.log(LogLevel.DEBUG, context, message, metadata),
      info: (message: string, metadata?: Record<string, unknown>) =>
        this.log(LogLevel.INFO, context, message, metadata),
      warn: (message: string, metadata?: Record<string, unknown>) =>
        this.log(LogLevel.WARN, context, message, metadata),
      error: (message: string, error?: Error | unknown, metadata?: Record<string, unknown>) =>
        this.error(LogLevel.ERROR, context, message, error, metadata),
    };
  }

  /**
   * Log a message
   */
  private log(
    level: LogLevel,
    context: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      metadata,
    };

    // Console output
    this.pinoLogger[level]({ context, ...metadata }, message);

    // Buffer for database persistence
    this.logBuffer.push(logEntry);
  }

  /**
   * Log an error
   */
  private error(
    level: LogLevel,
    context: string,
    message: string,
    error: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    const stack = error instanceof Error ? error.stack : undefined;
    const errorMessage = error instanceof Error ? error.message : String(error);

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      metadata: {
        ...metadata,
        error: errorMessage,
      },
      stack,
    };

    // Console output
    this.pinoLogger[level](
      { context, error: errorMessage, stack, ...metadata },
      message
    );

    // Buffer for database persistence
    this.logBuffer.push(logEntry);
  }

  /**
   * Flush logs to database
   */
  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const logsToInsert = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await this.supabase.from('logs').insert(logsToInsert);
    } catch (error) {
      // Fallback: log to console if database write fails
      this.pinoLogger.error(
        { error },
        'Failed to persist logs to database'
      );
      // Re-buffer the logs for next attempt
      this.logBuffer.unshift(...logsToInsert);
    }
  }

  /**
   * Start periodic flush of log buffer
   */
  private startBufferFlush(): void {
    setInterval(() => {
      this.flushLogs().catch((error) => {
        this.pinoLogger.error('Error flushing logs:', error);
      });
    }, this.flushInterval);
  }

  /**
   * Force flush logs (useful for graceful shutdown)
   */
  async flush(): Promise<void> {
    await this.flushLogs();
  }
}

