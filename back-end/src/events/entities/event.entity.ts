/**
 * Event Entity
 *
 * Represents an event in the system
 */
export interface Event {
  id: string;
  title: string;
  description?: string;
  organizer_id: string;
  organizer_address: string;
  organizer_name: string;
  organizer_icon?: string;
  location: string;
  start_time: string;
  end_time?: string;
  image_url?: string;
  status: 'LIVE' | 'UPCOMING' | 'ENDED';
  requires_xlm: boolean;
  xlm_minimum?: number;
  max_attendees?: number;
  current_attendees: number;
  qr_code_url?: string;
  claim_link?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

