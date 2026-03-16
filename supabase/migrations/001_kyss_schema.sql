-- ============================================================
-- KYSS Vision — Migration 001: Enums + Core User/Profile Tables
-- US-005
-- Apply via: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- ENUMS
-- ──────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('worker', 'employer', 'admin');

CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned');

CREATE TYPE country_code AS ENUM ('NZ', 'AU', 'BOTH');

CREATE TYPE visa_type AS ENUM ('WHV', 'STUDENT', 'WORK', 'PARTNER', 'OTHER');

CREATE TYPE experience_level AS ENUM ('first_time', 'some', 'experienced');

CREATE TYPE accommodation_pref AS ENUM ('own_vehicle', 'hostel', 'on_site', 'flexible');

CREATE TYPE pay_type AS ENUM ('hourly', 'piece_rate');

CREATE TYPE pool_status AS ENUM ('open', 'almost_full', 'closed', 'archived');

CREATE TYPE membership_status AS ENUM ('active', 'removed', 'left', 'season_completed');

CREATE TYPE review_type AS ENUM ('worker_rates_employer', 'employer_rates_worker');

CREATE TYPE report_reason AS ENUM ('harassment', 'no_show', 'misleading_info', 'unsafe_conditions', 'scam', 'other');

CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'actioned', 'dismissed');

CREATE TYPE notification_type AS ENUM (
  'worker_joined_pool',
  'pool_status_changed',
  'new_message',
  'new_pool_post',
  'new_pool_match',
  'visa_expiring',
  'pool_almost_full',
  'pool_full',
  'admin_message',
  'review_received',
  'worker_left_pool',
  'profile_incomplete'
);

-- ──────────────────────────────────────────────────────────
-- TABLE: user_profiles
-- Extends auth.users with KYSS-specific fields
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role                user_role NOT NULL,
  name                TEXT NOT NULL,
  nationality         TEXT,
  profile_photo_url   TEXT,
  country             country_code,
  phone               TEXT,
  status              user_status NOT NULL DEFAULT 'active',
  ban_reason          TEXT,
  last_login_at       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- ──────────────────────────────────────────────────────────
-- TABLE: worker_profiles
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS worker_profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  visa_type             visa_type,
  visa_doc_url          TEXT,
  visa_expiry           DATE,
  visa_verified         BOOLEAN NOT NULL DEFAULT false,
  availability_start    DATE,
  availability_end      DATE,
  work_preferences      TEXT[] DEFAULT '{}',
  region_preferences    TEXT[] DEFAULT '{}',
  has_transport         BOOLEAN,
  accommodation_pref    accommodation_pref,
  experience_level      experience_level,
  languages             TEXT[] DEFAULT '{English}',
  emergency_name        TEXT,
  emergency_phone       TEXT,
  emergency_relation    TEXT,
  bio                   TEXT CHECK (char_length(bio) <= 500),
  ird_number            TEXT,
  tfn_number            TEXT,
  profile_complete      BOOLEAN NOT NULL DEFAULT false,
  manus_prospect_id     UUID,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_worker_profiles_user_id ON worker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_visa_verified ON worker_profiles(visa_verified);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_profile_complete ON worker_profiles(profile_complete);

-- ──────────────────────────────────────────────────────────
-- TABLE: employer_profiles
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS employer_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name   TEXT NOT NULL,
  region          TEXT NOT NULL,
  country         country_code NOT NULL,
  logo_url        TEXT,
  description     TEXT,
  website         TEXT,
  contact_phone   TEXT,
  verified        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employer_profiles_user_id ON employer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_country ON employer_profiles(country);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_verified ON employer_profiles(verified);

-- ──────────────────────────────────────────────────────────
-- TABLE: work_type_categories
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS work_type_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,
  slug            TEXT NOT NULL UNIQUE,
  icon            TEXT NOT NULL,
  description     TEXT NOT NULL,
  display_order   INTEGER NOT NULL,
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_work_type_categories_slug ON work_type_categories(slug);
CREATE INDEX IF NOT EXISTS idx_work_type_categories_active ON work_type_categories(active);
CREATE INDEX IF NOT EXISTS idx_work_type_categories_display_order ON work_type_categories(display_order);

-- ──────────────────────────────────────────────────────────
-- Auto-update updated_at trigger function
-- ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_profiles_updated_at
  BEFORE UPDATE ON worker_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employer_profiles_updated_at
  BEFORE UPDATE ON employer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
