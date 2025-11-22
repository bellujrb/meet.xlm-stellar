import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: 'Event title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Event description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Organizer Stellar address' })
  @IsString()
  organizer_address: string;

  @ApiProperty({ description: 'Organizer name' })
  @IsString()
  organizer_name: string;

  @ApiPropertyOptional({ description: 'Organizer icon/emoji' })
  @IsOptional()
  @IsString()
  organizer_icon?: string;

  @ApiProperty({ description: 'Event location' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Event start time (ISO 8601)' })
  @IsDateString()
  start_time: string;

  @ApiPropertyOptional({ description: 'Event end time (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  end_time?: string;

  @ApiPropertyOptional({ description: 'Event image URL' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ description: 'Requires XLM balance to register', default: false })
  @IsBoolean()
  requires_xlm: boolean;

  @ApiPropertyOptional({ description: 'Minimum XLM required' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  xlm_minimum?: number;

  @ApiPropertyOptional({ description: 'Maximum attendees' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  max_attendees?: number;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, unknown>;
}

