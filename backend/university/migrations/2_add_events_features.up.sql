-- Add event categories and RSVP functionality
ALTER TABLE events ADD COLUMN category TEXT DEFAULT 'general';
ALTER TABLE events ADD COLUMN max_attendees INTEGER;
ALTER TABLE events ADD COLUMN is_public BOOLEAN DEFAULT TRUE;
ALTER TABLE events ADD COLUMN image_url TEXT;
ALTER TABLE events ADD COLUMN end_datetime TIMESTAMPTZ;

-- Event RSVPs table
CREATE TABLE event_rsvps (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'interested', 'not_going')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Event comments table
CREATE TABLE event_comments (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id BIGINT REFERENCES event_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for new tables
CREATE INDEX idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user ON event_rsvps(user_id);
CREATE INDEX idx_event_comments_event ON event_comments(event_id);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_datetime ON events(datetime);
