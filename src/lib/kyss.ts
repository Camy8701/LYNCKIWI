// ============================================================
// KYSS Vision — Core Library Functions
// US-015
// ============================================================

import { supabase } from '@/integrations/supabase/client'
import {
  WorkPool,
  WorkTypeCategory,
  PoolMembership,
  UserProfile,
  WorkerProfile,
  EmployerProfile,
  Notification,
  Prospect,
} from '@/integrations/supabase/types'

// ──────────────────────────────────────────────────────────
// WORK TYPE CATEGORIES
// ──────────────────────────────────────────────────────────

export async function getWorkTypeCategories(): Promise<WorkTypeCategory[]> {
  const { data, error } = await supabase
    .from('work_type_categories')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data as WorkTypeCategory[]
}

export async function getWorkTypeCategoryBySlug(slug: string): Promise<WorkTypeCategory | null> {
  const { data, error } = await supabase
    .from('work_type_categories')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data as WorkTypeCategory
}

// ──────────────────────────────────────────────────────────
// WORK POOLS
// ──────────────────────────────────────────────────────────

export async function getPoolsByCategory(categoryId: string): Promise<WorkPool[]> {
  const { data, error } = await supabase
    .from('work_pools')
    .select('*, employer:employer_profiles(*), work_type_category:work_type_categories(*)')
    .eq('work_type_category_id', categoryId)
    .in('status', ['open', 'almost_full'])
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as WorkPool[]
}

export async function getPoolById(poolId: string): Promise<WorkPool | null> {
  const { data, error } = await supabase
    .from('work_pools')
    .select('*, employer:employer_profiles(*), work_type_category:work_type_categories(*)')
    .eq('id', poolId)
    .single()
  if (error) return null
  return data as WorkPool
}

export async function getPoolsByEmployer(employerId: string): Promise<WorkPool[]> {
  const { data, error } = await supabase
    .from('work_pools')
    .select('*, work_type_category:work_type_categories(*)')
    .eq('employer_id', employerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as WorkPool[]
}

// ──────────────────────────────────────────────────────────
// POOL MEMBERSHIPS
// ──────────────────────────────────────────────────────────

export async function getWorkerMemberships(userId: string): Promise<PoolMembership[]> {
  const { data, error } = await supabase
    .from('pool_memberships')
    .select('*, work_pool:work_pools(*, employer:employer_profiles(*), work_type_category:work_type_categories(*))')
    .eq('worker_id', userId)
    .eq('status', 'active')
    .order('joined_at', { ascending: false })
  if (error) throw error
  return data as PoolMembership[]
}

export async function getPoolMembers(poolId: string): Promise<PoolMembership[]> {
  const { data, error } = await supabase
    .from('pool_memberships')
    .select('*, user_profile:user_profiles(*)')
    .eq('pool_id', poolId)
    .eq('status', 'active')
    .order('joined_at', { ascending: true })
  if (error) throw error
  return data as PoolMembership[]
}

export async function joinPool(workerId: string, poolId: string): Promise<{ error: string | null }> {
  // Check if already a member
  const { data: existing } = await supabase
    .from('pool_memberships')
    .select('id, status')
    .eq('worker_id', workerId)
    .eq('pool_id', poolId)
    .single()

  if (existing) {
    if (existing.status === 'active') return { error: 'You are already in this pool.' }
    // Re-activate if previously left
    const { error } = await supabase
      .from('pool_memberships')
      .update({ status: 'active', left_at: null })
      .eq('id', existing.id)
    return { error: error?.message ?? null }
  }

  const { error } = await supabase
    .from('pool_memberships')
    .insert({ worker_id: workerId, pool_id: poolId, status: 'active' })
  return { error: error?.message ?? null }
}

export async function leavePool(workerId: string, poolId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('pool_memberships')
    .update({ status: 'left', left_at: new Date().toISOString() })
    .eq('worker_id', workerId)
    .eq('pool_id', poolId)
    .eq('status', 'active')
  return { error: error?.message ?? null }
}

// ──────────────────────────────────────────────────────────
// USER PROFILES
// ──────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) return null
  return data as UserProfile
}

export async function getWorkerProfile(userId: string): Promise<WorkerProfile | null> {
  const { data, error } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) return null
  return data as WorkerProfile
}

export async function getEmployerProfile(userId: string): Promise<EmployerProfile | null> {
  const { data, error } = await supabase
    .from('employer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) return null
  return data as EmployerProfile
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
  return { error: error?.message ?? null }
}

export async function updateWorkerProfile(
  userId: string,
  updates: Partial<WorkerProfile>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('worker_profiles')
    .update(updates)
    .eq('user_id', userId)
  return { error: error?.message ?? null }
}

export async function updateEmployerProfile(
  userId: string,
  updates: Partial<EmployerProfile>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('employer_profiles')
    .update(updates)
    .eq('user_id', userId)
  return { error: error?.message ?? null }
}

// ──────────────────────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────────────────────

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data as Notification[]
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
}

// ──────────────────────────────────────────────────────────
// PROSPECTS (Admin)
// ──────────────────────────────────────────────────────────

export async function getProspects(): Promise<Prospect[]> {
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Prospect[]
}

export async function createProspect(
  prospect: Omit<Prospect, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Prospect | null; error: string | null }> {
  const { data, error } = await supabase
    .from('prospects')
    .insert(prospect)
    .select()
    .single()
  return { data: data as Prospect | null, error: error?.message ?? null }
}

export async function updateProspect(
  id: string,
  updates: Partial<Prospect>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('prospects')
    .update(updates)
    .eq('id', id)
  return { error: error?.message ?? null }
}

// ──────────────────────────────────────────────────────────
// UTILITIES
// ──────────────────────────────────────────────────────────

export function formatPayRate(payRate: number, payType: string, currency: string): string {
  const formatted = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency || 'NZD',
    minimumFractionDigits: 2,
  }).format(payRate)

  if (payType === 'hourly') return `${formatted}/hr`
  if (payType === 'piece_rate') return `${formatted}/bin`
  return formatted
}

export function getPoolStatusLabel(status: string): string {
  switch (status) {
    case 'open': return 'Open'
    case 'almost_full': return 'Almost Full'
    case 'closed': return 'Full'
    case 'archived': return 'Archived'
    default: return status
  }
}

export function getCapacityPercent(current: number, max: number): number {
  if (max === 0) return 0
  return Math.round((current / max) * 100)
}
