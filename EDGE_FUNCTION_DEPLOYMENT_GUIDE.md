# 🚀 Edge Function Deployment Guide - COMPLETE SOLUTION

**Problem Summary:** Form was sending `service.slug` but database expected UUID in `service_id` column.

**Solution:** Store slug in `service_slug` column, keep `service_id` for UUID references (optional).

---

## STEP 1: Update Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Add service_slug column to store the service identifier (slug like "renovierung")
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS service_slug TEXT;

-- Add state column for 3 German states
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS state TEXT;

-- Make service_id nullable (optional - for future UUID references)
ALTER TABLE leads
ALTER COLUMN service_id DROP NOT NULL;

-- Remove old state constraints
ALTER TABLE leads DROP CONSTRAINT IF EXISTS valid_state;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_state_check;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS valid_state_3;

-- Add new constraint for 3 states
ALTER TABLE leads
ADD CONSTRAINT valid_state_all
CHECK (state IN ('hesse', 'nrw', 'rhineland-palatinate'));

-- Verify columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('state', 'service_slug', 'service_id', 'property_ownership', 'property_type');
```

**Expected Output:** Should show all 5 columns

---

## STEP 2: Create Edge Function

### Method A: Via Supabase Dashboard (Recommended)

1. **Go to:** Supabase Dashboard → Edge Functions → **Create Function**
2. **Function name:** `create-lead`
3. **Paste this complete code:**

\`\`\`typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 20;
const MAX_EMAIL_LENGTH = 255;
const MAX_CITY_LENGTH = 100;
const MAX_DETAILS_LENGTH = 2000;
const MAX_TIMELINE_LENGTH = 50;

const PHONE_REGEX = /^[\d\s+()-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLead(data: any) {
  const errors: string[] = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  } else if (data.name.trim().length === 0) {
    errors.push('Name cannot be empty');
  } else if (data.name.length > MAX_NAME_LENGTH) {
    errors.push(\`Name must be less than \${MAX_NAME_LENGTH} characters\`);
  }

  // Phone validation
  if (!data.phone || typeof data.phone !== 'string') {
    errors.push('Phone is required');
  } else if (data.phone.trim().length === 0) {
    errors.push('Phone cannot be empty');
  } else if (data.phone.length > MAX_PHONE_LENGTH) {
    errors.push(\`Phone must be less than \${MAX_PHONE_LENGTH} characters\`);
  } else if (!PHONE_REGEX.test(data.phone)) {
    errors.push('Phone number contains invalid characters');
  }

  // Email validation (required)
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (data.email.trim().length === 0) {
    errors.push('Email cannot be empty');
  } else if (data.email.length > MAX_EMAIL_LENGTH) {
    errors.push(\`Email must be less than \${MAX_EMAIL_LENGTH} characters\`);
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Property ownership validation (required, accepts both owner and renter)
  if (!data.property_ownership || typeof data.property_ownership !== 'string') {
    errors.push('Property ownership status is required');
  } else if (data.property_ownership !== 'owner' && data.property_ownership !== 'renter') {
    errors.push('Invalid property ownership value');
  }

  // Property type validation (required)
  if (!data.property_type || typeof data.property_type !== 'string') {
    errors.push('Property type is required');
  } else if (!['single_family', 'apartment', 'multi_family', 'commercial'].includes(data.property_type)) {
    errors.push('Invalid property type');
  }

  // State validation (required - 3 states)
  if (!data.state || typeof data.state !== 'string') {
    errors.push('State is required');
  } else if (!['hesse', 'nrw', 'rhineland-palatinate'].includes(data.state)) {
    errors.push('Invalid state');
  }

  // City validation
  if (!data.city || typeof data.city !== 'string') {
    errors.push('City is required');
  } else if (data.city.trim().length === 0) {
    errors.push('City cannot be empty');
  } else if (data.city.length > MAX_CITY_LENGTH) {
    errors.push(\`City must be less than \${MAX_CITY_LENGTH} characters\`);
  }

  // Service details validation
  if (!data.service_details || typeof data.service_details !== 'string') {
    errors.push('Service details are required');
  } else if (data.service_details.trim().length < 10) {
    errors.push('Service details must be at least 10 characters');
  } else if (data.service_details.length > MAX_DETAILS_LENGTH) {
    errors.push(\`Service details must be less than \${MAX_DETAILS_LENGTH} characters\`);
  }

  // Timeline validation
  if (!data.timeline || typeof data.timeline !== 'string') {
    errors.push('Timeline is required');
  } else if (data.timeline.length > MAX_TIMELINE_LENGTH) {
    errors.push(\`Timeline must be less than \${MAX_TIMELINE_LENGTH} characters\`);
  }

  // Service ID validation (optional slug)
  if (data.service_id && typeof data.service_id !== 'string') {
    errors.push('Invalid service ID format');
  }

  return errors;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const leadData = await req.json();
    console.log('Received lead data:', { ...leadData, phone: '[REDACTED]', email: '[REDACTED]' });

    // Validate input
    const validationErrors = validateLead(leadData);
    if (validationErrors.length > 0) {
      console.warn('Validation failed:', validationErrors);
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validationErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize input (trim strings)
    const sanitizedData = {
      name: leadData.name.trim(),
      phone: leadData.phone.trim(),
      email: leadData.email.trim(),
      state: leadData.state,
      city: leadData.city.trim(),
      service_details: leadData.service_details.trim(),
      timeline: leadData.timeline.trim(),
      service_slug: leadData.service_id || null, // Store slug (like "renovierung")
      property_ownership: leadData.property_ownership,
      property_type: leadData.property_type,
      source: 'website',
      status: 'new'
    };

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create lead', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Lead created successfully:', data.id);

    // Trigger webhook if configured (optional, don't fail if webhook fails)
    const webhookUrl = Deno.env.get('WEBHOOK_URL');
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        console.log('Webhook triggered successfully');
      } catch (webhookError) {
        console.warn('Webhook failed (non-critical):', webhookError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, lead_id: data.id }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
\`\`\`

4. **Click "Deploy function"**
5. **Wait for green success message**

---

### Method B: Via CLI (If dashboard fails again)

Get a new access token from: https://supabase.com/dashboard/account/tokens

Then run:

\`\`\`bash
export SUPABASE_ACCESS_TOKEN=your_new_token_here
npx supabase functions deploy create-lead --project-ref jitrgujjlxampmtunrjj
\`\`\`

---

## STEP 3: Test Locally

\`\`\`bash
npm run dev
\`\`\`

1. Open http://localhost:5173
2. Fill out a service request form
3. Should redirect to /danke page
4. Check Supabase Dashboard → Table Editor → leads table
5. Verify new lead with `state` and `service_slug` populated

---

## STEP 4: Deploy to Production

\`\`\`bash
npm run build
\`\`\`

Then deploy the `dist/` folder to your hosting provider.

---

## ✅ Verification Checklist

- [ ] SQL migration ran successfully (all 5 columns exist)
- [ ] Edge function deployed without errors
- [ ] Local test works (form → danke page)
- [ ] Lead appears in database with correct data
- [ ] Production build successful
- [ ] Production deployment successful
- [ ] Production test works

---

## 🐛 Debugging Tips

### If form still fails:

1. **Check Edge Function Logs:**
   - Supabase Dashboard → Edge Functions → create-lead → Logs tab
   - Look for latest ERROR entry
   - Share the error message

2. **Check Browser Console:**
   - F12 → Console tab
   - Look for red errors
   - Share the full error

3. **Check Database:**
   - Table Editor → leads table
   - Verify columns: state, service_slug, property_ownership, property_type
   - All should exist and accept TEXT/string values

---

## 📊 What Changed

### Frontend (`ServiceRequestForm.tsx`):
- **Before:** `service_id: service.id` (UUID)
- **After:** `service_id: service.slug` (string like "renovierung")

### Database (`leads` table):
- **Added:** `service_slug TEXT` column
- **Added:** `state TEXT` column with constraint
- **Changed:** `service_id` now nullable (optional UUID reference)

### Edge Function:
- **Stores:** `service_slug` instead of `service_id`
- **Validates:** All 3 states (hesse, nrw, rhineland-palatinate)
- **Returns:** lead_id for redirect to thank you page

---

**End of Guide**
