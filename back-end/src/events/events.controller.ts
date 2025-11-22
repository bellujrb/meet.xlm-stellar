import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully', type: Event })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @Body() createEventDto: CreateEventDto,
    @Query('organizerId') organizerId: string = 'default'
  ): Promise<Event> {
    return this.eventsService.create(createEventDto, organizerId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of events', type: [Event] })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<Event[]> {
    return this.eventsService.findAll(limit, offset);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of upcoming events', type: [Event] })
  async findUpcoming(@Query('limit') limit?: number): Promise<Event[]> {
    return this.eventsService.findUpcoming(limit);
  }

  @Get('live')
  @ApiOperation({ summary: 'Get live events' })
  @ApiResponse({ status: 200, description: 'List of live events', type: [Event] })
  async findLive(): Promise<Event[]> {
    return this.eventsService.findLive();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search events' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Search results', type: [Event] })
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: number
  ): Promise<Event[]> {
    return this.eventsService.search(query, limit);
  }

  @Get('organizer/:address')
  @ApiOperation({ summary: 'Get events by organizer' })
  @ApiResponse({ status: 200, description: 'List of events', type: [Event] })
  async findByOrganizer(@Param('address') address: string): Promise<Event[]> {
    return this.eventsService.findByOrganizer(address);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event found', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, description: 'Event updated', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 204, description: 'Event deleted' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventsService.remove(id);
  }
}

