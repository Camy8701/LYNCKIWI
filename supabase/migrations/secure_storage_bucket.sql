-- ============================================
-- SECURITY: Secure Storage Bucket Configuration
-- ============================================
-- This migration creates the ad-logos storage bucket with proper security restrictions:
-- 1. File size limit: 5MB (prevents DoS via large uploads)
-- 2. MIME type restrictions: Only images (prevents malicious file uploads)
-- 3. Proper RLS policies for upload/view access
-- ============================================

-- Create storage bucket with restrictions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ad-logos',
  'ad-logos',
  true,  -- Public for serving ad images
  5242880,  -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']  -- Only allow image files
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- ============================================
-- Storage Policies
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view ad logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload ad logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete ad logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update ad logos" ON storage.objects;

-- Public can view (download) ad logos
CREATE POLICY "Anyone can view ad logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'ad-logos');

-- Anyone can upload ad logos (for ad creation flow)
-- File restrictions are enforced by bucket configuration
CREATE POLICY "Anyone can upload ad logos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'ad-logos'
    AND (storage.foldername(name))[1] = 'public'  -- Enforce public folder
  );

-- Only admins can delete ad logos
CREATE POLICY "Admins can delete ad logos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'ad-logos'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Only admins can update ad logos metadata
CREATE POLICY "Admins can update ad logos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'ad-logos'
    AND public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    bucket_id = 'ad-logos'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Add comments for documentation
COMMENT ON POLICY "Anyone can view ad logos" ON storage.objects IS 'Public read access for serving ad images on website';
COMMENT ON POLICY "Anyone can upload ad logos" ON storage.objects IS 'Allows ad creation, restricted by bucket MIME types and size limits';
COMMENT ON POLICY "Admins can delete ad logos" ON storage.objects IS 'Only admins can delete uploaded ad images';
COMMENT ON POLICY "Admins can update ad logos" ON storage.objects IS 'Only admins can modify ad image metadata';

-- ============================================
-- Security Notes
-- ============================================
-- 1. File size limit: 5MB prevents DoS attacks via large file uploads
-- 2. MIME type restrictions: Only image/* types prevent malicious file uploads
-- 3. Folder enforcement: All files must be in 'public/' folder for organization
-- 4. Admin-only deletion: Prevents unauthorized removal of ad images
-- ============================================
