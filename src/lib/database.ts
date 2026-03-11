import { supabase } from '@/integrations/supabase/client';

// ============================================
// TYPES
// ============================================

export type Service = {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  description: string | null;
  description_en: string | null;
  is_active: boolean;
  icon: string;
  lead_price_shared: number;
  created_at: string;
};

export type City = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

export type Company = {
  id: string;
  name: string;
  contact_person: string | null;
  email: string;
  phone: string;
  whatsapp: string | null;
  service_ids: string[];
  cities: string[];
  is_active: boolean;
  created_at: string;
};

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  state: string | null;
  city: string;
  plz: string | null;
  service_id: string;
  service_details: string;
  timeline: 'sofort' | 'diese_woche' | 'diesen_monat' | 'flexibel';
  status: 'new' | 'contacted' | 'converted';
  source: string;
  admin_notes: string | null;
  property_ownership: 'owner' | 'renter' | null;
  property_type: 'single_family' | 'apartment' | 'multi_family' | 'commercial' | null;
  decision_maker: 'yes' | 'no' | null;
  property_age: 'before_1980' | '1980_2000' | '2000_2010' | 'after_2010' | 'not_sure' | null;
};

export type LeadWithService = Lead & {
  service: Service;
};

// ============================================
// SERVICES
// ============================================

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
  return data as Service[];
}

export async function getServiceBySlug(slug: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  
  if (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
  return data as Service;
}

// ============================================
// CITIES
// ============================================

export async function getCities() {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
  return data as City[];
}

// ============================================
// LEADS
// ============================================

export async function createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'status' | 'source' | 'admin_notes'>) {
  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...leadData,
      status: 'new',
      source: 'website'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
  
  // Trigger webhook if configured
  if (data) {
    await triggerWebhook(data as Lead);
  }
  
  return data as Lead;
}

export async function getLeadById(id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      service:services(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching lead:', error);
    throw error;
  }
  return data as LeadWithService;
}

// ============================================
// WEBHOOK TRIGGER (for Zapier/n8n)
// ============================================

export async function triggerWebhook(leadData: Lead) {
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('No webhook URL configured, skipping webhook trigger');
    return;
  }
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lead_id: leadData.id,
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        city: leadData.city,
        plz: leadData.plz,
        service_id: leadData.service_id,
        details: leadData.service_details,
        timeline: leadData.timeline,
        timestamp: leadData.created_at
      })
    });
    
    console.log(`Webhook triggered for lead #${leadData.id}`);
  } catch (error) {
    console.error('Webhook trigger failed:', error);
    // Don't throw error - webhook failure shouldn't break lead creation
  }
}

// ============================================
// ADMIN DASHBOARD STATISTICS
// ============================================

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay()); // Sunday
  
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  // Leads today
  const { count: leadsToday } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());
  
  // Leads yesterday (for comparison)
  const { count: leadsYesterday } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', yesterday.toISOString())
    .lt('created_at', today.toISOString());
  
  // Leads this week
  const { count: leadsThisWeek } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thisWeekStart.toISOString());
  
  // Leads last week (for comparison)
  const { count: leadsLastWeek } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', lastWeekStart.toISOString())
    .lt('created_at', thisWeekStart.toISOString());
  
  // Active companies
  const { count: activeCompanies } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  
  // Revenue this week (sum of lead assignments)
  const { data: assignmentsThisWeek } = await supabase
    .from('lead_assignments')
    .select('amount_charged')
    .gte('assigned_at', thisWeekStart.toISOString());
  
  const revenueThisWeek = assignmentsThisWeek?.reduce(
    (sum, assignment) => sum + Number(assignment.amount_charged || 0),
    0
  ) || 0;
  
  // Revenue last week (for comparison)
  const { data: assignmentsLastWeek } = await supabase
    .from('lead_assignments')
    .select('amount_charged')
    .gte('assigned_at', lastWeekStart.toISOString())
    .lt('assigned_at', thisWeekStart.toISOString());
  
  const revenueLastWeek = assignmentsLastWeek?.reduce(
    (sum, assignment) => sum + Number(assignment.amount_charged || 0),
    0
  ) || 0;
  
  return {
    leadsToday: leadsToday || 0,
    leadsYesterday: leadsYesterday || 0,
    leadsThisWeek: leadsThisWeek || 0,
    leadsLastWeek: leadsLastWeek || 0,
    activeCompanies: activeCompanies || 0,
    revenueThisWeek,
    revenueLastWeek,
  };
}

// ============================================
// RECENT LEADS (for dashboard table)
// ============================================

export async function getRecentLeadsForDashboard(limit: number = 10) {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      service:services(name, name_en, icon, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data as LeadWithService[];
}

// ============================================
// LEADS MANAGEMENT - LIST WITH FILTERS
// ============================================

interface LeadsFilterOptions {
  search?: string;
  service_id?: string;
  city?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export async function getLeadsWithFilters(filters: LeadsFilterOptions = {}) {
  const {
    search,
    service_id,
    city,
    status,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 25,
  } = filters;
  
  let query = supabase
    .from('leads')
    .select(`
      *,
      service:services(name, name_en, icon, slug)
    `, { count: 'exact' });
  
  // Apply filters
  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  }
  
  if (service_id) {
    query = query.eq('service_id', service_id);
  }
  
  if (city) {
    query = query.eq('city', city);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (dateFrom) {
    query = query.gte('created_at', dateFrom);
  }
  
  if (dateTo) {
    query = query.lte('created_at', dateTo);
  }
  
  // Pagination
  const start = (page - 1) * pageSize;
  query = query
    .order('created_at', { ascending: false })
    .range(start, start + pageSize - 1);
  
  const { data, error, count } = await query;
  
  if (error) throw error;
  
  return {
    leads: data as LeadWithService[],
    totalCount: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

// ============================================
// LEAD DETAIL - UPDATE STATUS
// ============================================

export async function updateLeadStatus(
  leadId: string, 
  status: 'new' | 'contacted' | 'converted'
) {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Lead;
}

// ============================================
// BULK UPDATE LEAD STATUS
// ============================================

export async function bulkUpdateLeadStatus(
  leadIds: string[],
  status: 'new' | 'contacted' | 'converted'
) {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .in('id', leadIds)
    .select();
  
  if (error) throw error;
  return data as Lead[];
}

// ============================================
// LEAD DETAIL - UPDATE ADMIN NOTES
// ============================================

export async function updateLeadNotes(leadId: string, notes: string) {
  const { data, error } = await supabase
    .from('leads')
    .update({ admin_notes: notes })
    .eq('id', leadId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Lead;
}

// ============================================
// LEAD ASSIGNMENTS - GET FOR LEAD
// ============================================

export async function getLeadAssignments(leadId: string) {
  const { data, error } = await supabase
    .from('lead_assignments')
    .select(`
      *,
      company:companies(name, phone, email, whatsapp)
    `)
    .eq('lead_id', leadId)
    .order('assigned_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// ============================================
// DELETE LEAD
// ============================================

export async function deleteLead(leadId: string) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId);
  
  if (error) throw error;
}

// ============================================
// COMPANIES MANAGEMENT
// ============================================

export async function getAllCompanies(filters: { 
  search?: string
  is_active?: boolean
} = {}) {
  let query = supabase
    .from('companies')
    .select('*')
    .order('name', { ascending: true });
  
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
  }
  
  if (filters.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as Company[];
}

export async function getCompanyById(id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Company;
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single();
  
  if (error) throw error;
  return data as Company;
}

export async function updateCompany(id: string, updates: Partial<Company>) {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Company;
}

export async function deleteCompany(id: string) {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ============================================
// LEAD ASSIGNMENT
// ============================================

export async function getMatchingCompanies(leadId: string) {
  // Get lead details first
  const lead = await getLeadById(leadId);
  
  // Find companies that:
  // 1. Offer this service (service_id in service_ids array)
  // 2. Operate in this city (city in cities array)
  // 3. Are active
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .contains('service_ids', [lead.service_id])
    .contains('cities', [lead.city])
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data as Company[];
}

// Alias for getMatchingCompanies for compatibility
export const getMatchingCompaniesForLead = getMatchingCompanies;

export async function assignLeadToCompanies(
  leadId: string,
  companyIds: string[],
  assignedBy: string
) {
  // Get lead and service details for pricing
  const lead = await getLeadById(leadId);
  
  const assignments = await Promise.all(
    companyIds.map(async (companyId) => {
      // Get service price (default to 50 if not found)
      const pricePerLead = lead.service?.lead_price_shared || 50;
      
      const { data, error } = await supabase
        .from('lead_assignments')
        .insert({
          lead_id: leadId,
          company_id: companyId,
          assigned_by: assignedBy,
          amount_charged: pricePerLead,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    })
  );
  
  return assignments;
}

export async function removeLeadAssignment(assignmentId: string) {
  const { error } = await supabase
    .from('lead_assignments')
    .delete()
    .eq('id', assignmentId);
  
  if (error) throw error;
}

// ============================================
// SERVICES MANAGEMENT
// ============================================

export async function getAllServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data as Service[];
}

export async function updateService(id: string, updates: Partial<Service>) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Service;
}

export async function toggleServiceActive(id: string, is_active: boolean) {
  return updateService(id, { is_active });
}

// ============================================
// ANALYTICS DATA
// ============================================

export type LeadTrendData = {
  date: string;
  count: number;
};

export type ServiceConversionData = {
  name: string;
  total: number;
  converted: number;
  rate: number;
};

export type CityPerformanceData = {
  city: string;
  leads: number;
  revenue: number;
};

export type RevenueData = {
  date: string;
  revenue: number;
};

// Get leads trend over last 30 days
export async function getLeadsTrend(days: number = 30): Promise<LeadTrendData[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('leads')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Group by date
  const grouped: Record<string, number> = {};

  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const key = date.toISOString().split('T')[0];
    grouped[key] = 0;
  }

  // Count leads per day
  data?.forEach((lead) => {
    const date = new Date(lead.created_at).toISOString().split('T')[0];
    if (grouped[date] !== undefined) {
      grouped[date]++;
    }
  });

  return Object.entries(grouped).map(([date, count]) => ({
    date,
    count,
  }));
}

// Get conversion rates by service
export async function getConversionByService(): Promise<ServiceConversionData[]> {
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select(`
      status,
      service:services(name)
    `);

  if (leadsError) throw leadsError;

  // Group by service
  const serviceStats: Record<string, { total: number; converted: number }> = {};

  leads?.forEach((lead: any) => {
    const serviceName = lead.service?.name || 'Unknown';
    if (!serviceStats[serviceName]) {
      serviceStats[serviceName] = { total: 0, converted: 0 };
    }
    serviceStats[serviceName].total++;
    if (lead.status === 'converted') {
      serviceStats[serviceName].converted++;
    }
  });

  return Object.entries(serviceStats).map(([name, stats]) => ({
    name,
    total: stats.total,
    converted: stats.converted,
    rate: stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0,
  })).sort((a, b) => b.total - a.total);
}

// Get revenue trend over last 30 days
export async function getRevenueTrend(days: number = 30): Promise<RevenueData[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('lead_assignments')
    .select('assigned_at, amount_charged')
    .gte('assigned_at', startDate.toISOString())
    .order('assigned_at', { ascending: true });

  if (error) throw error;

  // Group by date
  const grouped: Record<string, number> = {};

  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const key = date.toISOString().split('T')[0];
    grouped[key] = 0;
  }

  // Sum revenue per day
  data?.forEach((assignment) => {
    const date = new Date(assignment.assigned_at).toISOString().split('T')[0];
    if (grouped[date] !== undefined) {
      grouped[date] += Number(assignment.amount_charged) || 0;
    }
  });

  return Object.entries(grouped).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}

// Get top performing cities
export async function getTopCities(limit: number = 10): Promise<CityPerformanceData[]> {
  // Get all leads with their assignments
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('city');

  if (leadsError) throw leadsError;

  const { data: assignments, error: assignmentsError } = await supabase
    .from('lead_assignments')
    .select(`
      amount_charged,
      lead:leads(city)
    `);

  if (assignmentsError) throw assignmentsError;

  // Count leads per city
  const cityLeads: Record<string, number> = {};
  leads?.forEach((lead) => {
    if (!cityLeads[lead.city]) {
      cityLeads[lead.city] = 0;
    }
    cityLeads[lead.city]++;
  });

  // Sum revenue per city
  const cityRevenue: Record<string, number> = {};
  assignments?.forEach((assignment: any) => {
    const city = assignment.lead?.city;
    if (city) {
      if (!cityRevenue[city]) {
        cityRevenue[city] = 0;
      }
      cityRevenue[city] += Number(assignment.amount_charged) || 0;
    }
  });

  // Combine and sort
  const cities = Object.keys({ ...cityLeads, ...cityRevenue });
  return cities
    .map((city) => ({
      city,
      leads: cityLeads[city] || 0,
      revenue: cityRevenue[city] || 0,
    }))
    .sort((a, b) => b.leads - a.leads)
    .slice(0, limit);
}

// Get analytics summary
export async function getAnalyticsSummary() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Total leads last 30 days
  const { count: leadsLast30 } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  // Total leads previous 30 days (for comparison)
  const { count: leadsPrevious30 } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString());

  // Converted leads last 30 days
  const { count: convertedLast30 } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'converted')
    .gte('created_at', thirtyDaysAgo.toISOString());

  // Revenue last 30 days
  const { data: revenueData } = await supabase
    .from('lead_assignments')
    .select('amount_charged')
    .gte('assigned_at', thirtyDaysAgo.toISOString());

  const revenueLast30 = revenueData?.reduce(
    (sum, a) => sum + Number(a.amount_charged || 0),
    0
  ) || 0;

  // Revenue previous 30 days
  const { data: revenuePrevData } = await supabase
    .from('lead_assignments')
    .select('amount_charged')
    .gte('assigned_at', sixtyDaysAgo.toISOString())
    .lt('assigned_at', thirtyDaysAgo.toISOString());

  const revenuePrevious30 = revenuePrevData?.reduce(
    (sum, a) => sum + Number(a.amount_charged || 0),
    0
  ) || 0;

  return {
    leadsLast30: leadsLast30 || 0,
    leadsPrevious30: leadsPrevious30 || 0,
    leadsChange: leadsPrevious30 ? Math.round(((leadsLast30! - leadsPrevious30) / leadsPrevious30) * 100) : 0,
    conversionRate: leadsLast30 ? Math.round((convertedLast30! / leadsLast30) * 100) : 0,
    revenueLast30,
    revenuePrevious30,
    revenueChange: revenuePrevious30 ? Math.round(((revenueLast30 - revenuePrevious30) / revenuePrevious30) * 100) : 0,
  };
}
