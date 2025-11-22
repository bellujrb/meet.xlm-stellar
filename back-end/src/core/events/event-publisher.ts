import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EnvService } from '@core/config/env.service';
import { LoggerService } from '@core/logger/logger.service';
import { AppDomainEvent } from './domain.events';

/**
 * EventPublisher
 *
 * Publishes domain events to:
 * 1. Supabase Database (event_store table) - for event sourcing
 * 2. Supabase Realtime - for real-time subscribers
 *
 * @example
 * const event = new EventCreatedEvent(...);
 * await this.eventPublisher.publish(event);
 */
@Injectable()
export class EventPublisher {
  private supabase: SupabaseClient;
  private logger = this.loggerService.createLogger('EventPublisher');

  constructor(
    private envService: EnvService,
    private loggerService: LoggerService
  ) {
    const { url, serviceKey } = this.envService.getSupabaseConfig();
    this.supabase = createClient(url, serviceKey);
  }

  /**
   * Publish an event to the event store and realtime
   */
  async publish(event: AppDomainEvent): Promise<void> {
    try {
      // 1. Store event in database for event sourcing
      await this.storeEvent(event);

      // 2. Publish to realtime subscribers
      await this.publishToRealtime(event);

      this.logger.info(`Event published: ${event.getEventType()}`, {
        eventId: event.id,
        aggregateId: event.aggregateId,
        eventType: event.getEventType(),
      });
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event.getEventType()}`, error, {
        eventId: event.id,
        aggregateId: event.aggregateId,
      });
      throw error;
    }
  }

  /**
   * Store event in database for event sourcing
   */
  private async storeEvent(event: AppDomainEvent): Promise<void> {
    const { error } = await this.supabase.from('event_store').insert({
      id: event.id,
      aggregate_id: event.aggregateId,
      event_type: event.getEventType(),
      event_name: event.getEventName(),
      timestamp: event.timestamp.toISOString(),
      version: event.version,
      payload: JSON.stringify(event),
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(`Failed to store event in database: ${error.message}`);
    }
  }

  /**
   * Publish to realtime subscribers
   */
  private async publishToRealtime(event: AppDomainEvent): Promise<void> {
    const channel = this.getChannelForEvent(event);

    const supabaseChannel = this.supabase.channel(channel);
    await new Promise<void>((resolve) => {
      supabaseChannel.on(
        'broadcast',
        {
          event: event.getEventType(),
        },
        () => {
          // Listener to make the method compatible
        }
      );
      // Send broadcast
      supabaseChannel.send({
        type: 'broadcast',
        event: event.getEventType(),
        payload: JSON.stringify(event),
      } as any);
      resolve();
    });
  }

  /**
   * Determine which realtime channel to publish to
   */
  private getChannelForEvent(event: AppDomainEvent): string {
    const eventType = event.getEventType();

    if (eventType.startsWith('event.')) {
      return 'event_events';
    }

    if (eventType.startsWith('attendance.')) {
      return 'attendance_events';
    }

    if (eventType.startsWith('badge.')) {
      return 'badge_events';
    }

    if (eventType.startsWith('stellar.')) {
      return 'stellar_events';
    }

    return 'system_events';
  }

  /**
   * Subscribe to events of a specific type
   */
  subscribeToEvent(eventType: string, callback: (event: AppDomainEvent) => void): void {
    const channel = this.getChannelForEventType(eventType);

    this.supabase
      .channel(channel)
      .on('broadcast', { event: eventType }, (payload) => {
        try {
          const event = JSON.parse(payload.payload) as AppDomainEvent;
          callback(event);
        } catch (error) {
          this.logger.error('Failed to parse event', error, { eventType });
        }
      })
      .subscribe();
  }

  /**
   * Get channel name for event type
   */
  private getChannelForEventType(eventType: string): string {
    if (eventType.startsWith('event.')) {
      return 'event_events';
    }

    if (eventType.startsWith('attendance.')) {
      return 'attendance_events';
    }

    if (eventType.startsWith('badge.')) {
      return 'badge_events';
    }

    if (eventType.startsWith('stellar.')) {
      return 'stellar_events';
    }

    return 'system_events';
  }
}

