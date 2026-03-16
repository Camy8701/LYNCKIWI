-- ============================================================
-- KYSS Vision — Migration 003: Communication Tables
-- Pool Feed, Messaging, Notifications
-- US-007
-- Apply AFTER 002_pools_schema.sql
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- TABLE: pool_posts (pool feed)
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pool_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id     UUID NOT NULL REFERENCES work_pools(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) <= 2000),
  pinned      BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pool_posts_pool_id ON pool_posts(pool_id);
CREATE INDEX IF NOT EXISTS idx_pool_posts_author_id ON pool_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_pool_posts_pinned ON pool_posts(pinned);
CREATE INDEX IF NOT EXISTS idx_pool_posts_created_at ON pool_posts(created_at DESC);

CREATE TRIGGER update_pool_posts_updated_at
  BEFORE UPDATE ON pool_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────────────────
-- TABLE: pool_post_comments
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pool_post_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES pool_posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pool_post_comments_post_id ON pool_post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_pool_post_comments_author_id ON pool_post_comments(author_id);

-- ──────────────────────────────────────────────────────────
-- TABLE: conversations (1:1 DMs)
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS conversations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids   UUID[] NOT NULL,
  pool_id           UUID REFERENCES work_pools(id) ON DELETE SET NULL,
  last_message_at   TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_participant_ids ON conversations USING GIN(participant_ids);
CREATE INDEX IF NOT EXISTS idx_conversations_pool_id ON conversations(pool_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- ──────────────────────────────────────────────────────────
-- TABLE: messages
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content           TEXT NOT NULL CHECK (char_length(content) <= 2000),
  read              BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Auto-update last_message_at on conversations when a message is inserted
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ──────────────────────────────────────────────────────────
-- TABLE: notifications
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT false,
  data        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
