-- ============================================
-- ADS SYSTEM DATABASE SCHEMA
-- ============================================

-- Create ad_status enum
DO $$ BEGIN
    CREATE TYPE ad_status AS ENUM ('pending', 'active', 'paused', 'rejected', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- ADS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Company Info
  company_name VARCHAR(50) NOT NULL,
  website_url TEXT NOT NULL,
  industry VARCHAR(100) NOT NULL,
  short_description VARCHAR(80),
  logo_url TEXT NOT NULL,

  -- Targeting (for future use)
  target_cities TEXT[] DEFAULT '{}',
  target_all_cities BOOLEAN DEFAULT true,

  -- Duration & Pricing
  duration_months INTEGER NOT NULL DEFAULT 1 CHECK (duration_months IN (1, 3, 6, 12)),
  auto_renew BOOLEAN DEFAULT false,
  price_paid INTEGER NOT NULL, -- in EUR cents

  -- Status
  status ad_status DEFAULT 'pending' NOT NULL,
  rejection_reason TEXT,

  -- Dates
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Stripe
  stripe_payment_id TEXT,
  stripe_subscription_id TEXT,

  -- Advertiser Contact
  advertiser_email VARCHAR(255) NOT NULL,
  advertiser_name VARCHAR(100) NOT NULL,
  advertiser_phone VARCHAR(30),

  -- Admin
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,

  -- Slot (1-7)
  slot_position INTEGER CHECK (slot_position >= 1 AND slot_position <= 7)
);

-- Index for faster active ad lookups
CREATE INDEX IF NOT EXISTS idx_ads_status_active ON ads (status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_ads_expires_at ON ads (expires_at) WHERE status = 'active';

-- ============================================
-- AD IMPRESSIONS TABLE (aggregated by day)
-- ============================================

CREATE TABLE IF NOT EXISTS ad_impressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  device_type VARCHAR(20) DEFAULT 'unknown',
  impression_count INTEGER DEFAULT 1,

  UNIQUE(ad_id, date, device_type)
);

CREATE INDEX IF NOT EXISTS idx_ad_impressions_ad_id ON ad_impressions (ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_date ON ad_impressions (date);

-- ============================================
-- AD CLICKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ad_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  device_type VARCHAR(20) DEFAULT 'unknown',
  user_agent TEXT,
  referrer TEXT,
  ip_hash VARCHAR(64) -- Hashed IP for deduplication, not stored raw
);

CREATE INDEX IF NOT EXISTS idx_ad_clicks_ad_id ON ad_clicks (ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_clicked_at ON ad_clicks (clicked_at);

-- ============================================
-- AD WAITLIST TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ad_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  industry VARCHAR(100),
  preferred_duration INTEGER DEFAULT 1,
  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  converted_to_ad_id UUID REFERENCES ads(id)
);

CREATE INDEX IF NOT EXISTS idx_ad_waitlist_email ON ad_waitlist (email);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get available ad slots
CREATE OR REPLACE FUNCTION get_available_ad_slots()
RETURNS INTEGER AS $$
DECLARE
  active_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO active_count
  FROM ads
  WHERE status = 'active'
    AND expires_at > NOW();

  RETURN 7 - COALESCE(active_count, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get next available slot date
CREATE OR REPLACE FUNCTION get_next_available_slot_date()
RETURNS TIMESTAMPTZ AS $$
DECLARE
  next_date TIMESTAMPTZ;
BEGIN
  SELECT MIN(expires_at) INTO next_date
  FROM ads
  WHERE status = 'active'
    AND expires_at > NOW();

  RETURN next_date;
END;
$$ LANGUAGE plpgsql;

-- Function to increment ad impressions (aggregated)
CREATE OR REPLACE FUNCTION increment_ad_impression(
  p_ad_id UUID,
  p_device_type VARCHAR DEFAULT 'unknown'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO ad_impressions (ad_id, date, device_type, impression_count)
  VALUES (p_ad_id, CURRENT_DATE, p_device_type, 1)
  ON CONFLICT (ad_id, date, device_type)
  DO UPDATE SET impression_count = ad_impressions.impression_count + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get ad analytics
CREATE OR REPLACE FUNCTION get_ad_analytics(p_ad_id UUID)
RETURNS TABLE (
  total_impressions BIGINT,
  total_clicks BIGINT,
  ctr NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(i.impression_count), 0)::BIGINT AS total_impressions,
    COALESCE((SELECT COUNT(*) FROM ad_clicks WHERE ad_id = p_ad_id), 0)::BIGINT AS total_clicks,
    CASE
      WHEN COALESCE(SUM(i.impression_count), 0) = 0 THEN 0
      ELSE ROUND(
        (COALESCE((SELECT COUNT(*) FROM ad_clicks WHERE ad_id = p_ad_id), 0)::NUMERIC /
        COALESCE(SUM(i.impression_count), 1)::NUMERIC) * 100,
        2
      )
    END AS ctr
  FROM ad_impressions i
  WHERE i.ad_id = p_ad_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_waitlist ENABLE ROW LEVEL SECURITY;

-- Public can view active ads
CREATE POLICY "Public can view active ads" ON ads
  FOR SELECT
  USING (status = 'active' AND expires_at > NOW());

-- Public can insert new ads (for self-service)
CREATE POLICY "Anyone can create ads" ON ads
  FOR INSERT
  WITH CHECK (true);

-- Admins can do everything with ads
CREATE POLICY "Admins can manage ads" ON ads
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Anyone can record impressions
CREATE POLICY "Anyone can record impressions" ON ad_impressions
  FOR INSERT
  WITH CHECK (true);

-- Admins can view impressions
CREATE POLICY "Admins can view impressions" ON ad_impressions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can record clicks
CREATE POLICY "Anyone can record clicks" ON ad_clicks
  FOR INSERT
  WITH CHECK (true);

-- Admins can view clicks
CREATE POLICY "Admins can view clicks" ON ad_clicks
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can join waitlist
CREATE POLICY "Anyone can join waitlist" ON ad_waitlist
  FOR INSERT
  WITH CHECK (true);

-- Admins can manage waitlist
CREATE POLICY "Admins can manage waitlist" ON ad_waitlist
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ads_updated_at ON ads;
CREATE TRIGGER update_ads_updated_at
    BEFORE UPDATE ON ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET FOR AD LOGOS
-- ============================================

-- Create storage bucket for ad logos (run this in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('ad-logos', 'ad-logos', true);

-- Storage policies would need to be added via dashboard:
-- - Public can view: SELECT on ad-logos bucket
-- - Anyone can upload: INSERT on ad-logos bucket with path check
