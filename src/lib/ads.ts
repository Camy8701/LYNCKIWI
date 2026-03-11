import { supabase } from '@/integrations/supabase/client';

// ============================================
// TYPES
// ============================================

export type AdStatus = 'pending' | 'active' | 'paused' | 'rejected' | 'expired';

export type Ad = {
  id: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  website_url: string;
  industry: string;
  short_description: string | null;
  logo_url: string;
  target_cities: string[];
  target_all_cities: boolean;
  duration_months: number;
  auto_renew: boolean;
  price_paid: number;
  status: AdStatus;
  rejection_reason: string | null;
  starts_at: string | null;
  expires_at: string | null;
  stripe_payment_id: string | null;
  stripe_subscription_id: string | null;
  advertiser_email: string;
  advertiser_name: string;
  advertiser_phone: string | null;
  approved_by: string | null;
  approved_at: string | null;
  slot_position: number | null;
};

export type AdWithAnalytics = Ad & {
  total_impressions: number;
  total_clicks: number;
  ctr: number;
};

export type WaitlistEntry = {
  id: string;
  created_at: string;
  company_name: string;
  email: string;
  phone: string | null;
  industry: string | null;
  preferred_duration: number;
  notified: boolean;
  notified_at: string | null;
  converted_to_ad_id: string | null;
};

// ============================================
// PRICING
// ============================================

export const AD_PRICING = {
  1: { total: 300, perMonth: 300, savings: 0 },
  3: { total: 810, perMonth: 270, savings: 10 },
  6: { total: 1500, perMonth: 250, savings: 17 },
  12: { total: 2700, perMonth: 225, savings: 25 },
} as const;

export const MAX_SLOTS = 7;

// ============================================
// PUBLIC AD QUERIES
// ============================================

export async function getActiveAds(): Promise<Ad[]> {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('slot_position', { ascending: true });

  if (error) {
    console.error('Error fetching active ads:', error);
    return [];
  }

  return data as Ad[];
}

export async function getAvailableSlotsCount(): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_available_ad_slots');

  if (error) {
    console.error('Error getting available slots:', error);
    // Fallback: count manually
    const activeAds = await getActiveAds();
    return MAX_SLOTS - activeAds.length;
  }

  return data as number;
}

export async function getNextAvailableSlotDate(): Promise<Date | null> {
  const { data, error } = await supabase
    .rpc('get_next_available_slot_date');

  if (error) {
    console.error('Error getting next available slot date:', error);
    return null;
  }

  return data ? new Date(data) : null;
}

// ============================================
// AD CREATION
// ============================================

export type CreateAdInput = {
  company_name: string;
  website_url: string;
  industry: string;
  short_description?: string;
  logo_url: string;
  target_cities?: string[];
  target_all_cities?: boolean;
  duration_months: number;
  auto_renew?: boolean;
  advertiser_email: string;
  advertiser_name: string;
  advertiser_phone?: string;
};

export async function createAd(input: CreateAdInput): Promise<Ad | null> {
  const pricing = AD_PRICING[input.duration_months as keyof typeof AD_PRICING];
  if (!pricing) {
    throw new Error('Invalid duration');
  }

  const { data, error } = await supabase
    .from('ads')
    .insert({
      ...input,
      price_paid: pricing.total,
      status: 'pending',
      target_all_cities: input.target_all_cities ?? true,
      target_cities: input.target_cities ?? [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating ad:', error);
    throw error;
  }

  return data as Ad;
}

// ============================================
// LOGO UPLOAD
// ============================================

export async function uploadAdLogo(file: File, adId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${adId}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('ad-logos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading logo:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('ad-logos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// ============================================
// WAITLIST
// ============================================

export async function joinWaitlist(input: {
  company_name: string;
  email: string;
  phone?: string;
  industry?: string;
  preferred_duration?: number;
}): Promise<WaitlistEntry | null> {
  const { data, error } = await supabase
    .from('ad_waitlist')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('Error joining waitlist:', error);
    throw error;
  }

  return data as WaitlistEntry;
}

// ============================================
// ANALYTICS TRACKING
// ============================================

export async function trackImpression(adId: string, deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop'): Promise<void> {
  try {
    await supabase.rpc('increment_ad_impression', {
      p_ad_id: adId,
      p_device_type: deviceType,
    });
  } catch (error) {
    console.error('Error tracking impression:', error);
  }
}

export async function trackClick(adId: string, deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop'): Promise<void> {
  try {
    await supabase
      .from('ad_clicks')
      .insert({
        ad_id: adId,
        device_type: deviceType,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
      });
  } catch (error) {
    console.error('Error tracking click:', error);
  }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

export async function getPendingAds(): Promise<Ad[]> {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending ads:', error);
    throw error;
  }

  return data as Ad[];
}

export async function getAllAds(): Promise<Ad[]> {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all ads:', error);
    throw error;
  }

  return data as Ad[];
}

export async function getAdById(id: string): Promise<Ad | null> {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching ad:', error);
    throw error;
  }

  return data as Ad;
}

export async function approveAd(adId: string, userId: string): Promise<Ad> {
  // Find next available slot
  const activeAds = await getActiveAds();
  const usedSlots = activeAds.map(a => a.slot_position).filter(Boolean);
  let nextSlot = 1;
  while (usedSlots.includes(nextSlot) && nextSlot <= MAX_SLOTS) {
    nextSlot++;
  }

  if (nextSlot > MAX_SLOTS) {
    throw new Error('No available slots');
  }

  // Get the ad to calculate expires_at
  const ad = await getAdById(adId);
  if (!ad) {
    throw new Error('Ad not found');
  }

  const startsAt = new Date();
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + ad.duration_months);

  const { data, error } = await supabase
    .from('ads')
    .update({
      status: 'active',
      approved_by: userId,
      approved_at: new Date().toISOString(),
      starts_at: startsAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      slot_position: nextSlot,
    })
    .eq('id', adId)
    .select()
    .single();

  if (error) {
    console.error('Error approving ad:', error);
    throw error;
  }

  return data as Ad;
}

export async function rejectAd(adId: string, reason: string): Promise<Ad> {
  const { data, error } = await supabase
    .from('ads')
    .update({
      status: 'rejected',
      rejection_reason: reason,
    })
    .eq('id', adId)
    .select()
    .single();

  if (error) {
    console.error('Error rejecting ad:', error);
    throw error;
  }

  return data as Ad;
}

export async function pauseAd(adId: string): Promise<Ad> {
  const { data, error } = await supabase
    .from('ads')
    .update({ status: 'paused' })
    .eq('id', adId)
    .select()
    .single();

  if (error) {
    console.error('Error pausing ad:', error);
    throw error;
  }

  return data as Ad;
}

export async function resumeAd(adId: string): Promise<Ad> {
  const { data, error } = await supabase
    .from('ads')
    .update({ status: 'active' })
    .eq('id', adId)
    .select()
    .single();

  if (error) {
    console.error('Error resuming ad:', error);
    throw error;
  }

  return data as Ad;
}

export async function getAdAnalytics(adId: string): Promise<{
  total_impressions: number;
  total_clicks: number;
  ctr: number;
}> {
  const { data, error } = await supabase
    .rpc('get_ad_analytics', { p_ad_id: adId });

  if (error) {
    console.error('Error getting ad analytics:', error);
    return { total_impressions: 0, total_clicks: 0, ctr: 0 };
  }

  return data[0] || { total_impressions: 0, total_clicks: 0, ctr: 0 };
}

export async function getWaitlist(): Promise<WaitlistEntry[]> {
  const { data, error } = await supabase
    .from('ad_waitlist')
    .select('*')
    .is('converted_to_ad_id', null)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching waitlist:', error);
    throw error;
  }

  return data as WaitlistEntry[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents);
}

export function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
