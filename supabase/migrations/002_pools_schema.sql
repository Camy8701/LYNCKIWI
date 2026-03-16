-- ============================================================
-- KYSS Vision — Migration 002: Work Pools + Pool Memberships
-- US-006
-- Apply AFTER 001_kyss_schema.sql
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- TABLE: work_pools
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS work_pools (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id               UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  work_type_category_id     UUID NOT NULL REFERENCES work_type_categories(id),
  title                     TEXT NOT NULL,
  region                    TEXT NOT NULL,
  country                   country_code NOT NULL,
  location_address          TEXT,
  location_lat              DECIMAL(9, 6),
  location_lng              DECIMAL(9, 6),
  season_start              DATE NOT NULL,
  season_end                DATE NOT NULL,
  pay_rate                  DECIMAL(10, 2) NOT NULL,
  pay_type                  pay_type NOT NULL,
  pay_description           TEXT,
  hours_description         TEXT NOT NULL,
  physical_requirements     TEXT,
  accommodation_available   BOOLEAN NOT NULL DEFAULT false,
  accommodation_details     TEXT,
  accommodation_cost        DECIMAL(10, 2),
  transport_available       BOOLEAN NOT NULL DEFAULT false,
  transport_details         TEXT,
  transport_cost            DECIMAL(10, 2),
  contract_url              TEXT,
  induction_video_url       TEXT,
  max_capacity              INTEGER NOT NULL CHECK (max_capacity > 0),
  current_count             INTEGER NOT NULL DEFAULT 0 CHECK (current_count >= 0),
  status                    pool_status NOT NULL DEFAULT 'open',
  auto_close_at_capacity    BOOLEAN NOT NULL DEFAULT true,
  created_by                UUID NOT NULL REFERENCES auth.users(id),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_work_pools_employer_id ON work_pools(employer_id);
CREATE INDEX IF NOT EXISTS idx_work_pools_work_type_category_id ON work_pools(work_type_category_id);
CREATE INDEX IF NOT EXISTS idx_work_pools_status ON work_pools(status);
CREATE INDEX IF NOT EXISTS idx_work_pools_country ON work_pools(country);
CREATE INDEX IF NOT EXISTS idx_work_pools_season_start ON work_pools(season_start);
CREATE INDEX IF NOT EXISTS idx_work_pools_region ON work_pools(region);

CREATE TRIGGER update_work_pools_updated_at
  BEFORE UPDATE ON work_pools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────────────────
-- TABLE: pool_memberships
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pool_memberships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pool_id     UUID NOT NULL REFERENCES work_pools(id) ON DELETE CASCADE,
  status      membership_status NOT NULL DEFAULT 'active',
  added_by    UUID REFERENCES auth.users(id),
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (worker_id, pool_id)
);

CREATE INDEX IF NOT EXISTS idx_pool_memberships_worker_id ON pool_memberships(worker_id);
CREATE INDEX IF NOT EXISTS idx_pool_memberships_pool_id ON pool_memberships(pool_id);
CREATE INDEX IF NOT EXISTS idx_pool_memberships_status ON pool_memberships(status);

-- ──────────────────────────────────────────────────────────
-- FUNCTION: auto-update pool status based on capacity
-- Called after INSERT/UPDATE on pool_memberships
-- ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_pool_capacity_status()
RETURNS TRIGGER AS $$
DECLARE
  v_pool work_pools%ROWTYPE;
  v_new_count INTEGER;
  v_new_status pool_status;
BEGIN
  -- Recalculate current_count from active memberships
  SELECT COUNT(*) INTO v_new_count
  FROM pool_memberships
  WHERE pool_id = COALESCE(NEW.pool_id, OLD.pool_id)
    AND status = 'active';

  SELECT * INTO v_pool FROM work_pools WHERE id = COALESCE(NEW.pool_id, OLD.pool_id);

  -- Determine new status
  IF v_pool.status = 'archived' THEN
    v_new_status := 'archived';
  ELSIF v_new_count >= v_pool.max_capacity AND v_pool.auto_close_at_capacity THEN
    v_new_status := 'closed';
  ELSIF v_new_count >= (v_pool.max_capacity * 0.9) THEN
    v_new_status := 'almost_full';
  ELSE
    v_new_status := 'open';
  END IF;

  UPDATE work_pools
  SET current_count = v_new_count,
      status = v_new_status,
      updated_at = now()
  WHERE id = COALESCE(NEW.pool_id, OLD.pool_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_pool_capacity
  AFTER INSERT OR UPDATE OR DELETE ON pool_memberships
  FOR EACH ROW EXECUTE FUNCTION update_pool_capacity_status();
