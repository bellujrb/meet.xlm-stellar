import { Injectable } from '@nestjs/common';
import { EventRepository } from '@database/repositories/event.repository';
import { LoggerService } from '@core/logger/logger.service';
import { EventPublisher } from '@core/events/event-publisher';
import { EventCreatedEvent, EventUpdatedEvent } from '@core/events/domain.events';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { NotFoundException, EventException, ErrorCode } from '@core/errors/app.exceptions';
import { randomUUID } from 'crypto';

@Injectable()
export class EventsService {
  private logger = this.loggerService.createLogger('EventsService');

  constructor(
    private eventRepository: EventRepository,
    private loggerService: LoggerService,
    private eventPublisher: EventPublisher
  ) {}

  /**
   * Create a new event
   */
  async create(createEventDto: CreateEventDto, organizerId: string): Promise<Event> {
    try {
      const eventId = randomUUID();
      const now = new Date().toISOString();

      // Determine status based on start time
      const startTime = new Date(createEventDto.start_time);
      const status = startTime <= new Date() ? 'LIVE' : 'UPCOMING';

      const eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'> = {
        title: createEventDto.title,
        description: createEventDto.description,
        organizer_id: organizerId,
        organizer_address: createEventDto.organizer_address,
        organizer_name: createEventDto.organizer_name,
        organizer_icon: createEventDto.organizer_icon,
        location: createEventDto.location,
        start_time: createEventDto.start_time,
        end_time: createEventDto.end_time,
        image_url: createEventDto.image_url,
        status,
        requires_xlm: createEventDto.requires_xlm,
        xlm_minimum: createEventDto.xlm_minimum,
        max_attendees: createEventDto.max_attendees,
        current_attendees: 0,
        metadata: createEventDto.metadata,
      };

      const event = await this.eventRepository.create({
        ...eventData,
        id: eventId,
        created_at: now,
        updated_at: now,
      } as Event);

      // Publish event created event
      await this.eventPublisher.publish(
        new EventCreatedEvent(
          event.id,
          event.title,
          event.organizer_id,
          event.organizer_address,
          event.metadata || {}
        )
      );

      this.logger.info('Event created', { eventId: event.id, title: event.title });

      return event;
    } catch (error) {
      this.logger.error('Failed to create event', error);
      throw new EventException(
        ErrorCode.EVENT_CREATION_FAILED,
        'Failed to create event',
        {},
        error as Error
      );
    }
  }

  /**
   * Find all events
   */
  async findAll(limit?: number, offset?: number): Promise<Event[]> {
    return this.eventRepository.findAll(limit, offset);
  }

  /**
   * Find event by ID
   */
  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event', id);
    }
    return event;
  }

  /**
   * Update event
   */
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    const updatedEvent = await this.eventRepository.update(id, {
      ...updateEventDto,
      updated_at: new Date().toISOString(),
    } as Partial<Event>);

    // Publish event updated event
    await this.eventPublisher.publish(
      new EventUpdatedEvent(id, updateEventDto as Record<string, unknown>)
    );

    this.logger.info('Event updated', { eventId: id });

    return updatedEvent;
  }

  /**
   * Delete event
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.eventRepository.delete(id);
    this.logger.info('Event deleted', { eventId: id });
  }

  /**
   * Find events by organizer
   */
  async findByOrganizer(organizerAddress: string): Promise<Event[]> {
    return this.eventRepository.findByOrganizer(organizerAddress);
  }

  /**
   * Find upcoming events
   */
  async findUpcoming(limit?: number): Promise<Event[]> {
    return this.eventRepository.findUpcoming(limit);
  }

  /**
   * Find live events
   */
  async findLive(): Promise<Event[]> {
    return this.eventRepository.findLive();
  }

  /**
   * Search events
   */
  async search(query: string, limit?: number): Promise<Event[]> {
    return this.eventRepository.search(query, limit);
  }
}

