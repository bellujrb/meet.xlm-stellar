-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  organizer VARCHAR(255) NOT NULL,
  organizer_icon VARCHAR(10) DEFAULT '🎉',
  start_time TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('LIVE', 'UPCOMING', 'ENDED')),
  requires_xlm BOOLEAN DEFAULT false,
  xlm_minimum DECIMAL(18, 2),
  created_by VARCHAR(255) NOT NULL, -- Stellar wallet address
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_id ON events(event_id);
CREATE INDEX IF NOT EXISTS idx_event_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_event_created_by ON events(created_by);

-- Create event_attendances table
CREATE TABLE IF NOT EXISTS event_attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id VARCHAR(255) UNIQUE NOT NULL,
  event_id VARCHAR(255) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  user_wallet VARCHAR(255) NOT NULL, -- Stellar wallet address
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_wallet)
);

CREATE INDEX IF NOT EXISTS idx_attendance_id ON event_attendances(attendance_id);
CREATE INDEX IF NOT EXISTS idx_attendance_event_id ON event_attendances(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_wallet ON event_attendances(user_wallet);
CREATE INDEX IF NOT EXISTS idx_attendance_event_user ON event_attendances(event_id, user_wallet);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create logs table (for function logging)
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP DEFAULT NOW(),
  level VARCHAR(20) NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
  context VARCHAR(100),
  message TEXT NOT NULL,
  metadata JSONB,
  operation_id VARCHAR(255),
  error_stack TEXT
);

CREATE INDEX IF NOT EXISTS idx_logs_operation ON logs(operation_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);

-- Function to automatically update event status based on start_time
CREATE OR REPLACE FUNCTION update_event_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status based on current time vs start_time
  IF NEW.start_time <= NOW() AND NEW.start_time + INTERVAL '1 day' > NOW() THEN
    NEW.status := 'LIVE';
  ELSIF NEW.start_time > NOW() THEN
    NEW.status := 'UPCOMING';
  ELSE
    NEW.status := 'ENDED';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update status on insert/update
CREATE TRIGGER update_event_status_trigger
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_event_status();

