-- ============================================
-- SECURITY FIX: Update RLS Policies to Use has_role()
-- ============================================
-- This migration fixes the security vulnerability where admin policies
-- were checking email domain instead of using the secure has_role() function.
--
-- Issue: Email domain checks (@lynckservices.com) are insecure because:
-- 1. Anyone could potentially create an account with that email if domain isn't controlled
-- 2. Email verification bypass could grant unauthorized admin access
-- 3. Inconsistent with other secure policies using has_role()
--
-- Run this migration AFTER the initial ads_system migration has been applied.
-- ============================================

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Admins can manage ads" ON ads;
DROP POLICY IF EXISTS "Admins can view impressions" ON ad_impressions;
DROP POLICY IF EXISTS "Admins can view clicks" ON ad_clicks;
DROP POLICY IF EXISTS "Admins can manage waitlist" ON ad_waitlist;

-- Create new secure policies using has_role()

-- Admins can do everything with ads
CREATE POLICY "Admins can manage ads" ON ads
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can view impressions
CREATE POLICY "Admins can view impressions" ON ad_impressions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update/delete impressions
CREATE POLICY "Admins can modify impressions" ON ad_impressions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete impressions" ON ad_impressions
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view clicks
CREATE POLICY "Admins can view clicks" ON ad_clicks
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update/delete clicks
CREATE POLICY "Admins can modify clicks" ON ad_clicks
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clicks" ON ad_clicks
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage waitlist
CREATE POLICY "Admins can manage waitlist" ON ad_waitlist
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add comment to document the security fix
COMMENT ON POLICY "Admins can manage ads" ON ads IS 'Uses has_role() for secure admin verification instead of email domain check';
COMMENT ON POLICY "Admins can view impressions" ON ad_impressions IS 'Uses has_role() for secure admin verification instead of email domain check';
COMMENT ON POLICY "Admins can view clicks" ON ad_clicks IS 'Uses has_role() for secure admin verification instead of email domain check';
COMMENT ON POLICY "Admins can manage waitlist" ON ad_waitlist IS 'Uses has_role() for secure admin verification instead of email domain check';
