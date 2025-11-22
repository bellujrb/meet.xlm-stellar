export interface Event {
  id: string;
  title: string;
  organizer: string;
  organizerIcon: string;
  time: string;
  location: string;
  image: string;
  status: 'LIVE' | 'UPCOMING';
  statusTime?: string;
  description?: string;
  attendees?: number;
  requiresXLM?: boolean;
  xlmMinimum?: number;
  isRegistered?: boolean;
}

export interface Calendar {
  id: string;
  name: string;
  image: string;
  color?: string;
  eventCount?: number;
}

export type TabName = 'home' | 'search' | 'add' | 'notifications' | 'settings';

