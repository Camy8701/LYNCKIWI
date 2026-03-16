-- ============================================================
-- KYSS Vision — Migration 004: Reviews, Reports, Admin Log, Prospects
-- US-008
-- Apply AFTER 003_communication_schema.sql
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- TABLE: reviews
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pool_id       UUID NOT NULL REFERENCES work_pools(id) ON DELETE CASCADE,
  review_type   review_type NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text          TEXT CHECK (char_length(text) <= 1000),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (reviewer_id, pool_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_pool_id ON reviews(pool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_review_type ON reviews(review_type);

-- ──────────────────────────────────────────────────────────
-- TABLE: reports
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason          report_reason NOT NULL,
  description     TEXT,
  status          report_status NOT NULL DEFAULT 'pending',
  admin_notes     TEXT,
  actioned_by     UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_id ON reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────────────────
-- TABLE: admin_actions (audit log)
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_actions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type   TEXT NOT NULL,
  target_type   TEXT NOT NULL,
  target_id     UUID NOT NULL,
  details       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_id ON admin_actions(target_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at DESC);

-- ──────────────────────────────────────────────────────────
-- TABLE: prospects (Manus AI pipeline)
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS prospects (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  facebook_url            TEXT,
  source_group            TEXT,
  nationality             TEXT,
  visa_confirmed          BOOLEAN NOT NULL DEFAULT false,
  start_date_confirmed    DATE,
  work_type_interest      TEXT,
  region_interest         TEXT,
  dm_sent                 BOOLEAN NOT NULL DEFAULT false,
  dm_sent_at              TIMESTAMPTZ,
  dm_replied              BOOLEAN NOT NULL DEFAULT false,
  dm_replied_at           TIMESTAMPTZ,
  platform_signed_up      BOOLEAN NOT NULL DEFAULT false,
  signed_up_at            TIMESTAMPTZ,
  user_id                 UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pool_joined             BOOLEAN NOT NULL DEFAULT false,
  pool_joined_at          TIMESTAMPTZ,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prospects_user_id ON prospects(user_id);
CREATE INDEX IF NOT EXISTS idx_prospects_dm_sent ON prospects(dm_sent);
CREATE INDEX IF NOT EXISTS idx_prospects_platform_signed_up ON prospects(platform_signed_up);
CREATE INDEX IF NOT EXISTS idx_prospects_pool_joined ON prospects(pool_joined);
CREATE INDEX IF NOT EXISTS idx_prospects_created_at ON prospects(created_at DESC);

CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key from worker_profiles.manus_prospect_id → prospects.id
-- (Added here after prospects table is created)
ALTER TABLE worker_profiles
  ADD CONSTRAINT fk_worker_profiles_prospect
  FOREIGN KEY (manus_prospect_id) REFERENCES prospects(id) ON DELETE SET NULL;
