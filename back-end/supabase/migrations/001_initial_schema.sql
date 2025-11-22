-- Initial schema for Meet.XLM Backend

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  organizer_id VARCHAR(255) NOT NULL,
  organizer_address VARCHAR(255) NOT NULL,
  organizer_name VARCHAR(255) NOT NULL,
  organizer_icon VARCHAR(10),
  location VARCHAR(255) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  image_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('LIVE', 'UPCOMING', 'ENDED')),
  requires_xlm BOOLEAN NOT NULL DEFAULT false,
  xlm_minimum NUMERIC(20, 7),
  max_attendees INTEGER,
  current_attendees INTEGER NOT NULL DEFAULT 0,
  qr_code_url TEXT,
  claim_link TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for events
CREATE INDEX IF NOT EXISTS idx_events_organizer_address ON events(organizer_address);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Attendances table
CREATE TABLE IF NOT EXISTS attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_address VARCHAR(255) NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  badge_id UUID,
  transaction_hash VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_address)
);

-- Indexes for attendances
CREATE INDEX IF NOT EXISTS idx_attendances_event_id ON attendances(event_id);
CREATE INDEX IF NOT EXISTS idx_attendances_user_address ON attendances(user_address);
CREATE INDEX IF NOT EXISTS idx_attendances_registered_at ON attendances(registered_at);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  attendance_id UUID NOT NULL REFERENCES attendances(id) ON DELETE CASCADE,
  user_address VARCHAR(255) NOT NULL,
  asset_code VARCHAR(12) NOT NULL,
  transaction_hash VARCHAR(255) NOT NULL,
  minted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for badges
CREATE INDEX IF NOT EXISTS idx_badges_event_id ON badges(event_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_address ON badges(user_address);
CREATE INDEX IF NOT EXISTS idx_badges_transaction_hash ON badges(transaction_hash);

-- Event store for event sourcing
CREATE TABLE IF NOT EXISTS event_store (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aggregate_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for event_store
CREATE INDEX IF NOT EXISTS idx_event_store_aggregate_id ON event_store(aggregate_id);
CREATE INDEX IF NOT EXISTS idx_event_store_event_type ON event_store(event_type);
CREATE INDEX IF NOT EXISTS idx_event_store_timestamp ON event_store(timestamp);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL,
  level VARCHAR(20) NOT NULL,
  context VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  stack TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for logs
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_context ON logs(context);

-- Function to increment event attendees
CREATE OR REPLACE FUNCTION increment_event_attendees(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET current_attendees = current_attendees + 1,
      updated_at = NOW()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at
  BEFORE UPDATE ON attendances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

