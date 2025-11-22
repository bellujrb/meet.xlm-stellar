import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import { LoggerService } from '@core/logger/logger.service';
import { EnvService } from '@core/config/env.service';
import { Event } from '@events/entities/event.entity';

/**
 * EventRepository
 *
 * Repository for event database operations
 */
@Injectable()
export class EventRepository extends BaseRepository<Event> {
  private supabase: SupabaseClient;

  constructor(
    private envService: EnvService,
    private loggerService: LoggerService
  ) {
    const { url, serviceKey } = envService.getSupabaseConfig();
    const supabase = createClient(url, serviceKey);
    super('events', supabase, loggerService);
    this.supabase = supabase;
  }

  /**
   * Find events by organizer
   */
  async findByOrganizer(organizerAddress: string): Promise<Event[]> {
    return this.findByFilter({ organizer_address: organizerAddress });
  }

  /**
   * Find upcoming events
   */
  async findUpcoming(limit?: number): Promise<Event[]> {
    try {
      const now = new Date().toISOString();
      let query = this.supabase
        .from('events')
        .select('*')
        .gte('start_time', now)
        .order('start_time', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []) as Event[];
    } catch (error) {
      this.logger.error('Failed to find upcoming events', error);
      throw error;
    }
  }

  /**
   * Find live events
   */
  async findLive(): Promise<Event[]> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await this.supabase
        .from('events')
        .select('*')
        .eq('status', 'LIVE')
        .lte('start_time', now)
        .order('start_time', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []) as Event[];
    } catch (error) {
      this.logger.error('Failed to find live events', error);
      throw error;
    }
  }

  /**
   * Search events
   */
  async search(query: string, limit?: number): Promise<Event[]> {
    try {
      let dbQuery = this.supabase
        .from('events')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%,organizer_name.ilike.%${query}%`)
        .order('start_time', { ascending: true });

      if (limit) {
        dbQuery = dbQuery.limit(limit);
      }

      const { data, error } = await dbQuery;

      if (error) {
        throw error;
      }

      return (data || []) as Event[];
    } catch (error) {
      this.logger.error('Failed to search events', error, { query });
      throw error;
    }
  }

  /**
   * Increment attendee count
   */
  async incrementAttendees(eventId: string): Promise<Event> {
    try {
      const { data, error } = await this.supabase.rpc('increment_event_attendees', {
        event_id: eventId,
      });

      if (error) {
        throw error;
      }

      return await this.findById(eventId) as Event;
    } catch (error) {
      this.logger.error(`Failed to increment attendees for event: ${eventId}`, error);
      // Fallback to manual update
      const event = await this.findById(eventId);
      if (event) {
        return await this.update(eventId, {
          current_attendees: (event.current_attendees || 0) + 1,
        } as Partial<Event>);
      }
      throw error;
    }
  }
}

