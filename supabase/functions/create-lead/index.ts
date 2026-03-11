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
const MAX_PLZ_LENGTH = 10;
const MAX_CITY_LENGTH = 100;
const MAX_DETAILS_LENGTH = 2000;
const MAX_TIMELINE_LENGTH = 50;

const PLZ_REGEX = /^\d{5}$/; // German postal code format
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
    errors.push(`Name must be less than ${MAX_NAME_LENGTH} characters`);
  }

  // Phone validation
  if (!data.phone || typeof data.phone !== 'string') {
    errors.push('Phone is required');
  } else if (data.phone.trim().length === 0) {
    errors.push('Phone cannot be empty');
  } else if (data.phone.length > MAX_PHONE_LENGTH) {
    errors.push(`Phone must be less than ${MAX_PHONE_LENGTH} characters`);
  } else if (!PHONE_REGEX.test(data.phone)) {
    errors.push('Phone number contains invalid characters');
  }

  // Email validation (required)
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (data.email.trim().length === 0) {
    errors.push('Email cannot be empty');
  } else if (data.email.length > MAX_EMAIL_LENGTH) {
    errors.push(`Email must be less than ${MAX_EMAIL_LENGTH} characters`);
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Property ownership validation (required, accepts both owner and renter)
  if (!data.property_ownership || typeof data.property_ownership !== 'string') {
    errors.push('Property ownership status is required');
  } else if (data.property_ownership !== 'owner' && data.property_ownership !== 'renter') {
    errors.push('Invalid property ownership value');
  }
  // Removed blocking validation for renters - now accepts all submissions with quality tagging

  // Property type validation (required)
  if (!data.property_type || typeof data.property_type !== 'string') {
    errors.push('Property type is required');
  } else if (!['single_family', 'apartment', 'multi_family', 'commercial'].includes(data.property_type)) {
    errors.push('Invalid property type');
  }

  // Property age field removed - not needed for initial qualification

  // Decision maker field removed - property ownership is sufficient for qualification

  // State validation (required)
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
    errors.push(`City must be less than ${MAX_CITY_LENGTH} characters`);
  }

  // PLZ field removed - city selection is sufficient for location

  // Service details validation
  if (!data.service_details || typeof data.service_details !== 'string') {
    errors.push('Service details are required');
  } else if (data.service_details.trim().length < 10) {
    errors.push('Service details must be at least 10 characters');
  } else if (data.service_details.length > MAX_DETAILS_LENGTH) {
    errors.push(`Service details must be less than ${MAX_DETAILS_LENGTH} characters`);
  }

  // Timeline validation
  if (!data.timeline || typeof data.timeline !== 'string') {
    errors.push('Timeline is required');
  } else if (data.timeline.length > MAX_TIMELINE_LENGTH) {
    errors.push(`Timeline must be less than ${MAX_TIMELINE_LENGTH} characters`);
  }

  // Service ID validation (optional)
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
      service_slug: leadData.service_id || null, // Store slug, not UUID
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