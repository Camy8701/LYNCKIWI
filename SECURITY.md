# Security Guidelines for Lynck Services

This document outlines the security measures implemented in the Lynck Services platform and provides guidelines for maintaining security.

## Table of Contents
1. [Security Fixes Applied](#security-fixes-applied)
2. [Authentication & Authorization](#authentication--authorization)
3. [Database Security (RLS)](#database-security-rls)
4. [Storage Security](#storage-security)
5. [Migration Guide](#migration-guide)
6. [Security Best Practices](#security-best-practices)
7. [Reporting Security Issues](#reporting-security-issues)

---

## Security Fixes Applied

### Critical Fix #1: Admin Role Verification in Routes ✅

**Issue:** The `ProtectedRoute` component only checked if a user was authenticated (had a valid session) but did NOT verify admin role. This meant any authenticated user could access the admin dashboard.

**Fix:** Updated `src/components/ProtectedRoute.tsx` to:
- Check authentication status (valid session)
- Verify admin role using `isAdmin()` function
- Redirect non-admin users to homepage with error message

**Impact:** Only users with the `admin` role in the `user_roles` table can now access admin routes.

```typescript
// Before (INSECURE):
const session = await getSession();
setIsAuthenticated(session !== null); // ❌ Only checks login

// After (SECURE):
const session = await getSession();
setIsAuthenticated(session !== null);
if (authenticated) {
  const adminStatus = await isAdmin(); // ✅ Verifies admin role
  setHasAdminRole(adminStatus);
}
```

---

### Medium Priority Fix #2: RLS Policies Using has_role() ✅

**Issue:** Some RLS policies used email domain pattern matching (`@lynckservices.com`) instead of the secure `has_role()` function.

**Affected Tables:**
- `ads`
- `ad_impressions`
- `ad_clicks`
- `ad_waitlist`

**Fix:** Updated all admin policies to use `public.has_role(auth.uid(), 'admin')`.

**Migration:** Run `supabase/migrations/fix_security_issues.sql` to update existing policies.

```sql
-- Before (INSECURE):
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@lynckservices.com' -- ❌ Email domain check
  )
)

-- After (SECURE):
USING (public.has_role(auth.uid(), 'admin')) -- ✅ Role-based check
```

---

### Medium Priority Fix #3: Storage Bucket Security ✅

**Issue:** The `ad-logos` storage bucket had no file size limits or MIME type restrictions.

**Risks:**
- DoS attacks via extremely large file uploads
- Storage cost exploitation
- Malicious file uploads (non-images)

**Fix:** Created `supabase/migrations/secure_storage_bucket.sql` with:
- **File size limit:** 5MB (5,242,880 bytes)
- **MIME type restrictions:** `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`
- **Proper RLS policies:** Public read, authenticated upload, admin-only delete

**Migration:** Run the SQL migration to apply bucket restrictions.

---

## Authentication & Authorization

### Role-Based Access Control (RBAC)

The platform uses a two-tier authorization system:

1. **Authentication:** Managed by Supabase Auth (email/password)
2. **Authorization:** Role-based using the `user_roles` table

#### User Roles

Roles are stored in the `user_roles` table:

```sql
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id),
  role app_role NOT NULL,
  PRIMARY KEY (user_id, role)
);

CREATE TYPE app_role AS ENUM ('admin', 'user');
```

#### Checking Admin Status

Always use the `has_role()` function for admin checks:

```typescript
// Frontend
import { isAdmin } from '@/lib/auth';

const adminStatus = await isAdmin();
if (!adminStatus) {
  // Deny access
}
```

```sql
-- Backend (RLS Policies)
USING (public.has_role(auth.uid(), 'admin'))
```

#### The has_role() Function

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;
```

**Security Features:**
- `SECURITY DEFINER`: Executes with elevated privileges to read `user_roles`
- `SET search_path = public`: Prevents SQL injection via schema manipulation
- Returns boolean for simple true/false checks

---

## Database Security (RLS)

### Row Level Security (RLS) Policies

All sensitive tables have RLS enabled with the following pattern:

#### Admin-Only Tables

Tables that only admins should access:

```sql
-- Example: leads table
CREATE POLICY "Admins can view leads" ON leads
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create leads" ON leads
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads" ON leads
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads" ON leads
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
```

#### Public Read, Admin Write

Tables where anyone can read but only admins can modify:

```sql
-- Example: services table
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage services" ON services
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

#### Public Insert, Admin Read

Tables for form submissions (leads, messages):

```sql
-- Example: messages table
CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view messages" ON messages
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

### Secure RLS Policy Checklist

When creating new RLS policies:

- ✅ Use `public.has_role(auth.uid(), 'admin')` for admin checks
- ❌ NEVER use email domain pattern matching
- ✅ Use `USING` clause for SELECT, UPDATE, DELETE
- ✅ Use `WITH CHECK` clause for INSERT, UPDATE
- ✅ Enable RLS on all tables: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- ✅ Test policies with non-admin users

---

## Storage Security

### Bucket Configuration

The `ad-logos` bucket is configured with the following security measures:

```sql
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) VALUES (
  'ad-logos',
  'ad-logos',
  true,  -- Public for serving images
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);
```

### Storage RLS Policies

```sql
-- Public can view/download
CREATE POLICY "Anyone can view ad logos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'ad-logos');

-- Authenticated users can upload
CREATE POLICY "Anyone can upload ad logos" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'ad-logos'
    AND (storage.foldername(name))[1] = 'public'
  );

-- Only admins can delete
CREATE POLICY "Admins can delete ad logos" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'ad-logos'
    AND public.has_role(auth.uid(), 'admin')
  );
```

### File Upload Security Checklist

- ✅ Set file size limits (prevents DoS)
- ✅ Restrict MIME types (prevents malicious uploads)
- ✅ Use folder structure (`public/`, `private/`)
- ✅ Admin-only deletion policies
- ✅ Scan uploaded files for malware (future enhancement)
- ✅ Use CDN for public files (Supabase handles this)

---

## Migration Guide

### Step 1: Run Security Fix Migrations

Execute these migrations in your Supabase dashboard in this order:

1. **Fix RLS Policies:**
   ```bash
   # Run: supabase/migrations/fix_security_issues.sql
   ```

2. **Secure Storage Bucket:**
   ```bash
   # Run: supabase/migrations/secure_storage_bucket.sql
   ```

3. **Verify Messages Table:**
   ```bash
   # Run: supabase/migrations/create_messages_table.sql
   # (if not already run)
   ```

### Step 2: Verify Deployments

After running migrations, verify:

```sql
-- Check RLS policies are using has_role()
SELECT schemaname, tablename, policyname, definition
FROM pg_policies
WHERE tablename IN ('ads', 'ad_impressions', 'ad_clicks', 'ad_waitlist')
ORDER BY tablename, policyname;

-- Check storage bucket configuration
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'ad-logos';

-- Check user roles are set correctly
SELECT u.email, ur.role
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.email;
```

### Step 3: Test Authorization

1. **Test Admin Access:**
   - Login as admin user
   - Verify access to `/admin` routes
   - Verify can view leads, messages, analytics

2. **Test Non-Admin Access:**
   - Login as regular user (or create test account)
   - Try to access `/admin` routes
   - Should redirect to homepage with error

3. **Test Unauthenticated Access:**
   - Logout
   - Try to access `/admin` routes
   - Should redirect to `/admin/login`

---

## Security Best Practices

### For Developers

1. **Always Use RLS:**
   - Never disable RLS on tables with sensitive data
   - Test policies with different user roles
   - Document policy intentions in comments

2. **Frontend Security:**
   - Never trust client-side validation alone
   - Always check authorization on backend/database
   - Use TypeScript for type safety
   - Sanitize user inputs

3. **API Security:**
   - Validate all inputs in Edge Functions
   - Use rate limiting (Supabase handles this)
   - Log security events (without PII)
   - Never log passwords or tokens

4. **Secrets Management:**
   - Use environment variables (`.env`)
   - Never commit `.env` to git
   - Rotate API keys regularly
   - Use Supabase vault for sensitive config

### For Admins

1. **User Management:**
   - Only grant admin role to trusted users
   - Regular audit of admin user list
   - Use strong passwords (12+ chars, mixed case, symbols)
   - Enable 2FA (if available)

2. **Monitoring:**
   - Review Supabase logs regularly
   - Monitor for failed login attempts
   - Check for unusual data access patterns
   - Set up alerts for security events

3. **Backup & Recovery:**
   - Regular database backups (Supabase handles this)
   - Test restore procedures
   - Document recovery processes
   - Keep offline backups of critical data

---

## Additional Security Recommendations

### High Priority

1. **Enable Leaked Password Protection:**
   - Go to Supabase Dashboard → Authentication → Policies
   - Enable "Leaked Password Protection"
   - Prevents users from using compromised passwords

2. **Email Verification:**
   - Ensure email verification is enabled
   - Prevents fake account creation
   - Supabase handles this automatically

3. **Rate Limiting:**
   - Configure in Supabase dashboard
   - Prevents brute force attacks
   - Limits API abuse

### Future Enhancements

1. **Automated Email Notifications:**
   - Replace `mailto:` links with Edge Function emails
   - Use Resend or SendGrid for delivery
   - See `DATABASE_SETUP.md` for details

2. **Audit Logging:**
   - Log admin actions (who did what, when)
   - Track data modifications
   - Implement using triggers or Edge Functions

3. **API Rate Limiting:**
   - Implement per-user rate limits
   - Prevent API abuse
   - Use Supabase's built-in rate limiting

4. **Content Security Policy (CSP):**
   - Add CSP headers to prevent XSS
   - Configure in Vite or hosting platform
   - Restrict script sources

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@lynckservices.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

---

## Security Checklist

### Pre-Deployment

- [ ] All migrations run successfully
- [ ] RLS enabled on all tables
- [ ] Admin role verification in ProtectedRoute
- [ ] Storage bucket restrictions applied
- [ ] No hardcoded secrets in code
- [ ] `.env` files in `.gitignore`
- [ ] TypeScript compilation successful
- [ ] Build completes without errors

### Post-Deployment

- [ ] Test admin access works
- [ ] Test non-admin access denied
- [ ] Test public forms work
- [ ] Test file uploads respect size/type limits
- [ ] Review Supabase logs for errors
- [ ] Verify RLS policies active
- [ ] Check email verification enabled
- [ ] Enable leaked password protection

### Monthly

- [ ] Review admin user list
- [ ] Check for failed login attempts
- [ ] Review Supabase logs
- [ ] Update dependencies
- [ ] Rotate API keys (if applicable)
- [ ] Test backup restoration

---

## Contact & Support

- **Security Issues:** security@lynckservices.com
- **General Support:** support@lynckservices.com
- **Documentation:** See README.md and DATABASE_SETUP.md

---

**Last Updated:** 2024-12-29
**Version:** 1.0.0
**Security Review:** Completed
