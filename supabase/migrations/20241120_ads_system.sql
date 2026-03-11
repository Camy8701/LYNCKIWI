-- =============================================
-- LYNCK SERVICES - ADVERTISING SYSTEM
-- Run this SQL in Supabase SQL Editor
-- =============================================

-- Ad Status Enum
CREATE TYPE ad_status AS ENUM ('pending', 'active', 'paused', 'rejected', 'expired');

-- Main Ads Table
CREATE TABLE IF NOT EXISTS ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Company Info
  company_name VARCHAR(50) NOT NULL,
  website_url TEXT NOT NULL,
  industry VARCHAR(50) NOT NULL,
  short_description VARCHAR(60),

  -- Logo
  logo_url TEXT NOT NULL,

  -- Targeting
  target_cities TEXT[] DEFAULT '{}',
  target_all_cities BOOLEAN DEFAULT TRUE,

  -- Subscription Details
  duration_months INTEGER NOT NULL DEFAULT 1,
  auto_renew BOOLEAN DEFAULT FALSE,
  price_paid DECIMAL(10, 2) NOT NULL,

  -- Status
  status ad_status DEFAULT 'pending',
  rejection_reason TEXT,

  -- Dates
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Payment
  stripe_payment_id TEXT,
  stripe_subscription_id TEXT,

  -- Contact Info (advertiser)
  advertiser_email TEXT NOT NULL,
  advertiser_name TEXT NOT NULL,
  advertiser_phone TEXT,

  -- Admin
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,

  -- Slot position (1-7)
  slot_position INTEGER CHECK (slot_position >= 1 AND slot_position <= 7)
);

-- Ad Impressions Table (aggregated daily)
CREATE TABLE IF NOT EXISTS ad_impressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  impression_count INTEGER DEFAULT 0,
  device_type VARCHAR(20) DEFAULT 'unknown', -- 'mobile', 'desktop', 'tablet'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(ad_id, date, device_type)
);

-- Ad Clicks Table
CREATE TABLE IF NOT EXISTS ad_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_type VARCHAR(20) DEFAULT 'unknown',
  user_agent TEXT,
  ip_hash TEXT, -- Hashed IP for fraud detection
  referrer TEXT
);

-- Waitlist Table
CREATE TABLE IF NOT EXISTS ad_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  company_name VARCHAR(50) NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  industry VARCHAR(50),
  preferred_duration INTEGER DEFAULT 6,

  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP WITH TIME ZONE,
  converted_to_ad_id UUID REFERENCES ads(id)
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_expires_at ON ads(expires_at);
CREATE INDEX idx_ads_slot_position ON ads(slot_position);
CREATE INDEX idx_ad_impressions_ad_id_date ON ad_impressions(ad_id, date);
CREATE INDEX idx_ad_clicks_ad_id ON ad_clicks(ad_id);
CREATE INDEX idx_ad_clicks_clicked_at ON ad_clicks(clicked_at);
CREATE INDEX idx_ad_waitlist_email ON ad_waitlist(email);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_waitlist ENABLE ROW LEVEL SECURITY;

-- Public can read active ads
CREATE POLICY "Active ads are viewable by everyone" ON ads
  FOR SELECT USING (status = 'active');

-- Admins can do everything with ads
CREATE POLICY "Admins can manage all ads" ON ads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Anyone can insert impressions (for tracking)
CREATE POLICY "Anyone can insert impressions" ON ad_impressions
  FOR INSERT WITH CHECK (true);

-- Anyone can read impressions
CREATE POLICY "Anyone can view impressions" ON ad_impressions
  FOR SELECT USING (true);

-- Anyone can insert clicks (for tracking)
CREATE POLICY "Anyone can insert clicks" ON ad_clicks
  FOR INSERT WITH CHECK (true);

-- Admins can read clicks
CREATE POLICY "Admins can view clicks" ON ad_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Anyone can join waitlist
CREATE POLICY "Anyone can join waitlist" ON ad_waitlist
  FOR INSERT WITH CHECK (true);

-- Admins can manage waitlist
CREATE POLICY "Admins can manage waitlist" ON ad_waitlist
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to get available slots count
CREATE OR REPLACE FUNCTION get_available_ad_slots()
RETURNS INTEGER AS $$
BEGIN
  RETURN 7 - (
    SELECT COUNT(*) FROM ads
    WHERE status = 'active'
    AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get next available slot date
CREATE OR REPLACE FUNCTION get_next_available_slot_date()
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  RETURN (
    SELECT MIN(expires_at) FROM ads
    WHERE status = 'active'
    AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to increment impressions (upsert)
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
RETURNS TABLE(
  total_impressions BIGINT,
  total_clicks BIGINT,
  ctr DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(i.impression_count), 0)::BIGINT as total_impressions,
    (SELECT COUNT(*) FROM ad_clicks WHERE ad_id = p_ad_id)::BIGINT as total_clicks,
    CASE
      WHEN COALESCE(SUM(i.impression_count), 0) > 0
      THEN ROUND(
        (SELECT COUNT(*) FROM ad_clicks WHERE ad_id = p_ad_id)::DECIMAL
        / COALESCE(SUM(i.impression_count), 1) * 100, 2
      )
      ELSE 0
    END as ctr
  FROM ad_impressions i
  WHERE i.ad_id = p_ad_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON ads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- STORAGE BUCKET FOR AD LOGOS
-- =============================================

-- Create storage bucket for ad logos (run this separately in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('ad-logos', 'ad-logos', true);

-- Storage policies (run after creating bucket)
-- CREATE POLICY "Anyone can view ad logos" ON storage.objects FOR SELECT USING (bucket_id = 'ad-logos');
-- CREATE POLICY "Anyone can upload ad logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ad-logos');
