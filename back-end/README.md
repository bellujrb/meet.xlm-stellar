# Meet.XLM Backend

**Backend API** for Meet.XLM - Stellar-native proof-of-attendance protocol.

## Overview

Meet.XLM Backend is a modern, event-driven API that:

- 🎯 **Manages events** - Create, update, and query Stellar events
- ⚙️ **Processes attendance** - Register and verify event participation
- ⛓️ **Mints badges** - Issue verifiable attendance badges on Stellar
- 📊 **Provides analytics** - Dashboard with event statistics
- 🚀 **Event-driven** - Complete audit trail with event sourcing
- 📝 **Logs everything** - Persistent logging to PostgreSQL

## Quick Start

### Prerequisites

- Node.js v18+
- pnpm v10+ (or npm)
- Supabase account
- Git

### Setup

```bash
# 1. Install dependencies
cd back-end
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run database migrations
# See supabase/migrations/ for SQL migrations

# 4. Start development server
npm run start:dev

# 5. Visit Swagger docs
open http://localhost:3000/api/docs
```

## Project Structure

```
src/
├── core/              # Core services (config, logger, events, errors)
├── database/          # Repository pattern for Supabase
├── events/            # Event management module
│   ├── dto/          # Data Transfer Objects
│   ├── entities/     # Event entities
│   ├── events.controller.ts
│   ├── events.service.ts
│   └── events.module.ts
├── attendances/       # Attendance management (TODO)
├── dashboard/         # Dashboard and analytics (TODO)
└── stellar/          # Stellar integration (TODO)

supabase/
└── migrations/       # Database schema migrations
```

## API Endpoints

### Events

- `POST /events` - Create a new event
- `GET /events` - List all events
- `GET /events/:id` - Get event by ID
- `GET /events/upcoming` - Get upcoming events
- `GET /events/live` - Get live events
- `GET /events/search?q=query` - Search events
- `GET /events/organizer/:address` - Get events by organizer
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

## Design Patterns

### Repository Pattern

Clean data access abstraction:

```typescript
const event = await this.eventRepository.findById(id);
const events = await this.eventRepository.findUpcoming(10);
await this.eventRepository.create(eventData);
```

### Event-Driven Architecture

Decoupled, auditable event processing:

```typescript
const event = new EventCreatedEvent(eventId, title, ...);
await this.eventPublisher.publish(event);
```

### Event Sourcing

Complete immutable history:

```sql
SELECT * FROM event_store
WHERE aggregate_id = 'event-123'
ORDER BY timestamp ASC;
```

## Technology Stack

- **Framework**: NestJS - Modern, scalable backend framework
- **Language**: TypeScript - Type safety and better DX
- **Database**: Supabase/PostgreSQL - Open-source, serverless
- **Blockchain**: Stellar SDK - Stellar network integration
- **Logging**: Pino - Fast, structured logging
- **Validation**: Zod + class-validator - Type-safe schema validation
- **Documentation**: OpenAPI 3.0 - Standard API spec

## Configuration

Copy `.env.example` to `.env` and fill in:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_KEY=your-key

# Stellar
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

## Available Scripts

```bash
npm run build           # Build TypeScript
npm run start           # Run production build
npm run start:dev       # Run with watch mode
npm run lint            # Run ESLint
npm run format          # Format with Prettier
```

## Database Schema

Key tables:

- `events` - Event information
- `attendances` - Attendance records
- `badges` - Minted badges
- `event_store` - Event sourcing store (append-only)
- `logs` - Structured application logs

## Roadmap

- [x] Project initialization
- [x] Core architecture setup
- [x] Events module
- [ ] Attendances module
- [ ] Badge minting
- [ ] Dashboard module
- [ ] Stellar integration
- [ ] Production hardening

## License

ISC

