import { Event, Calendar } from '../types';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Stellar Hack+',
    organizer: 'Stellar Week | Buenos Aires',
    organizerIcon: '🌟',
    time: 'Ontem, 07:00',
    location: 'Nicaragua 5094',
    image: require('../../assets/icon.png'),
    status: 'LIVE',
    description: 'Hackathon oficial da Stellar em Buenos Aires',
    attendees: 120,
  },
  {
    id: '2',
    title: 'Stellar Hack+ Day 2',
    organizer: 'Blockchain Acceleration',
    organizerIcon: '⚡',
    time: 'Hoje, 07:30',
    location: 'Nicaragua 5094',
    image: require('../../assets/icon.png'),
    status: 'LIVE',
    description: 'Segundo dia do hackathon com mentoria e workshops',
    attendees: 95,
  },
  {
    id: '3',
    title: 'Learn how to use Meteora @ Solana Hacker House',
    organizer: 'Superteam Brasil',
    organizerIcon: '🇧🇷',
    time: 'Hoje, 13:00',
    location: 'Puerto Limón Hostel',
    image: require('../../assets/icon.png'),
    status: 'UPCOMING',
    statusTime: 'Em 2h',
    description: 'Workshop sobre Meteora no ecossistema Solana',
    attendees: 45,
  },
  {
    id: '4',
    title: 'Web3 Networking Night',
    organizer: 'Crypto Community',
    organizerIcon: '🌐',
    time: 'Amanhã, 19:00',
    location: 'Palermo Tech Hub',
    image: require('../../assets/icon.png'),
    status: 'UPCOMING',
    statusTime: 'Em 1d',
    description: 'Evento de networking para desenvolvedores Web3 e entusiastas de blockchain',
    attendees: 80,
  },
];

export const MOCK_CALENDARS: Calendar[] = [
  {
    id: '1',
    name: 'Stellar Week',
    image: require('../../assets/icon.png'),
    color: '#FF6B9D',
    eventCount: 12,
  },
  {
    id: '2',
    name: 'Brasil',
    image: require('../../assets/icon.png'),
    color: '#4ECDC4',
    eventCount: 8,
  },
  {
    id: '3',
    name: 'Web3 Events',
    image: require('../../assets/icon.png'),
    color: '#FFD93D',
    eventCount: 15,
  },
];

