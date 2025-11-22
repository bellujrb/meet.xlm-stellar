import { SUPABASE_FUNCTIONS_URL } from '../config/api';
import { Event } from '../types';

export interface CreateEventRequest {
  title: string;
  organizer: string;
  organizerIcon?: string;
  startTime: string; // ISO 8601 format
  location: string;
  description?: string;
  imageUrl?: string;
  requiresXlm?: boolean;
  xlmMinimum?: number;
}

export interface CreateEventResponse {
  event_id: string;
  title: string;
  organizer: string;
  organizer_icon: string;
  start_time: string;
  location: string;
  description: string | null;
  image_url: string | null;
  status: 'LIVE' | 'UPCOMING' | 'ENDED';
  requires_xlm: boolean;
  xlm_minimum: number | null;
  created_by: string;
  created_at: string;
}

export interface ListEventsResponse {
  events: Array<{
    id: string;
    event_id: string;
    title: string;
    organizer: string;
    organizer_icon: string;
    time: string;
    location: string;
    description: string | null;
    image: string | null;
    status: 'LIVE' | 'UPCOMING' | 'ENDED';
    requires_xlm: boolean;
    xlm_minimum: number | null;
    created_by: string;
    created_at: string;
    attendees: number;
    is_registered: boolean;
  }>;
  count: number;
  limit: number;
  offset: number;
}

export interface RegisterAttendanceRequest {
  event_id: string;
}

export interface RegisterAttendanceResponse {
  attendance_id: string;
  event_id: string;
  event_title: string;
  user_wallet: string;
  registered_at: string;
}

export interface ApiError {
  error: string;
  code?: string;
}

class ApiClient {
  private getHeaders(walletAddress?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (walletAddress) {
      headers['x-wallet-address'] = walletAddress;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Supabase Edge Functions return data directly (not wrapped in 'data' property)
    return data as T;
  }

  async createEvent(
    data: CreateEventRequest,
    walletAddress: string
  ): Promise<CreateEventResponse> {
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-event`, {
      method: 'POST',
      headers: this.getHeaders(walletAddress),
      body: JSON.stringify(data),
    });

    return this.handleResponse<CreateEventResponse>(response);
  }

  async listEvents(
    options?: {
      status?: 'LIVE' | 'UPCOMING' | 'ENDED';
      limit?: number;
      offset?: number;
      walletAddress?: string;
    }
  ): Promise<ListEventsResponse> {
    const params = new URLSearchParams();
    if (options?.status) params.append('status', options.status);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const url = `${SUPABASE_FUNCTIONS_URL}/list-events${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(options?.walletAddress),
    });

    return this.handleResponse<ListEventsResponse>(response);
  }

  async registerAttendance(
    eventId: string,
    walletAddress: string
  ): Promise<RegisterAttendanceResponse> {
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/register-attendance`, {
      method: 'POST',
      headers: this.getHeaders(walletAddress),
      body: JSON.stringify({ event_id: eventId }),
    });

    return this.handleResponse<RegisterAttendanceResponse>(response);
  }

  async getEvent(
    eventId: string,
    walletAddress?: string
  ): Promise<ListEventsResponse['events'][0]> {
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/get-event?event_id=${eventId}`, {
      method: 'GET',
      headers: this.getHeaders(walletAddress),
    });

    return this.handleResponse<ListEventsResponse['events'][0]>(response);
  }

  async listUserEvents(
    walletAddress: string,
    options?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<ListEventsResponse> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const url = `${SUPABASE_FUNCTIONS_URL}/list-user-events${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(walletAddress),
    });

    return this.handleResponse<ListEventsResponse>(response);
  }

  // Helper to convert API event to app Event type
  convertApiEventToEvent(apiEvent: ListEventsResponse['events'][0]): Event {
    return {
      id: apiEvent.event_id,
      title: apiEvent.title,
      organizer: apiEvent.organizer,
      organizerIcon: apiEvent.organizer_icon,
      time: apiEvent.time,
      location: apiEvent.location,
      image: apiEvent.image || '',
      status: apiEvent.status === 'ENDED' ? 'UPCOMING' : apiEvent.status,
      description: apiEvent.description || undefined,
      attendees: apiEvent.attendees,
      requiresXLM: apiEvent.requires_xlm,
      xlmMinimum: apiEvent.xlm_minimum || undefined,
      isRegistered: apiEvent.is_registered,
    };
  }
}

export const apiClient = new ApiClient();

