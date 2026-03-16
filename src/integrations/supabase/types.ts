// ============================================================
// KYSS Vision — Supabase TypeScript Types
// US-010: Manually written to match the KYSS schema (migrations 001-005)
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ──────────────────────────────────────────────────────────
// ENUMS
// ──────────────────────────────────────────────────────────

export type UserRole = 'worker' | 'employer' | 'admin'
export type UserStatus = 'active' | 'suspended' | 'banned'
export type VisaType = 'working_holiday' | 'student' | 'resident' | 'citizen' | 'other'
export type ExperienceLevel = 'none' | 'some' | 'experienced'
export type AccommodationPref = 'provided' | 'own' | 'either'
export type PayType = 'hourly' | 'piece_rate' | 'salary'
export type PoolStatus = 'open' | 'almost_full' | 'closed' | 'archived'
export type MembershipStatus = 'active' | 'left' | 'removed'
export type ReviewType = 'worker_to_employer' | 'employer_to_worker'
export type ReportReason = 'spam' | 'harassment' | 'fake_profile' | 'inappropriate_content' | 'other'
export type ReportStatus = 'pending' | 'reviewed' | 'actioned' | 'dismissed'
export type NotificationType =
  | 'pool_joined'
  | 'pool_left'
  | 'pool_full'
  | 'pool_post'
  | 'message_received'
  | 'review_received'
  | 'profile_approved'
  | 'admin_action'

// ──────────────────────────────────────────────────────────
// TABLE TYPES
// ──────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  user_id: string
  role: UserRole
  name: string
  nationality: string | null
  profile_photo_url: string | null
  country: string | null
  phone: string | null
  status: UserStatus
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface WorkerProfile {
  id: string
  user_id: string
  visa_type: VisaType | null
  visa_expiry: string | null
  experience_level: ExperienceLevel | null
  work_type_preferences: string[] | null
  region_preferences: string[] | null
  country_preference: string | null
  accommodation_pref: AccommodationPref | null
  has_transport: boolean
  bio: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relation: string | null
  profile_complete: boolean
  manus_prospect_id: string | null
  created_at: string
  updated_at: string
}

export interface EmployerProfile {
  id: string
  user_id: string
  business_name: string
  region: string | null
  country: string | null
  logo_url: string | null
  description: string | null
  verified: boolean
  created_at: string
  updated_at: string
}

export interface WorkTypeCategory {
  id: string
  name: string
  slug: string
  icon: string
  description: string | null
  display_order: number
  active: boolean
  created_at: string
}

export interface WorkPool {
  id: string
  employer_id: string
  work_type_category_id: string
  title: string
  region: string
  country: string
  location: string | null
  season_start: string | null
  season_end: string | null
  pay_type: PayType
  pay_rate: number
  pay_currency: string
  hours_per_week: number | null
  physical_requirements: string | null
  accommodation_provided: boolean
  accommodation_details: string | null
  transport_provided: boolean
  transport_details: string | null
  contract_url: string | null
  induction_video_url: string | null
  max_capacity: number
  current_count: number
  status: PoolStatus
  auto_close_at_capacity: boolean
  created_by: string
  created_at: string
  updated_at: string
  employer?: EmployerProfile
  work_type_category?: WorkTypeCategory
}

export interface PoolMembership {
  id: string
  worker_id: string
  pool_id: string
  status: MembershipStatus
  added_by: string | null
  joined_at: string
  left_at: string | null
  work_pool?: WorkPool
  user_profile?: UserProfile
}

export interface PoolPost {
  id: string
  pool_id: string
  author_id: string
  content: string
  pinned: boolean
  created_at: string
  updated_at: string
  author?: UserProfile
  comments?: PoolPostComment[]
}

export interface PoolPostComment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  updated_at: string
  author?: UserProfile
}

export interface Conversation {
  id: string
  participant_ids: string[]
  pool_id: string | null
  last_message_at: string | null
  created_at: string
  messages?: Message[]
  participants?: UserProfile[]
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
  sender?: UserProfile
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  link: string | null
  created_at: string
}

export interface Review {
  id: string
  reviewer_id: string
  reviewee_id: string
  pool_id: string
  review_type: ReviewType
  rating: number
  text: string | null
  created_at: string
  reviewer?: UserProfile
  reviewee?: UserProfile
}

export interface Report {
  id: string
  reporter_id: string
  reported_id: string
  reason: ReportReason
  description: string | null
  status: ReportStatus
  admin_notes: string | null
  actioned_by: string | null
  created_at: string
  updated_at: string
}

export interface AdminAction {
  id: string
  admin_id: string
  action_type: string
  target_type: string
  target_id: string
  details: Json | null
  created_at: string
}

export interface Prospect {
  id: string
  name: string
  facebook_url: string | null
  source_group: string | null
  nationality: string | null
  visa_confirmed: boolean
  start_date_confirmed: string | null
  work_type_interest: string | null
  region_interest: string | null
  dm_sent: boolean
  dm_sent_at: string | null
  dm_replied: boolean
  dm_replied_at: string | null
  platform_signed_up: boolean
  signed_up_at: string | null
  user_id: string | null
  pool_joined: boolean
  pool_joined_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// ──────────────────────────────────────────────────────────
// DATABASE TYPE (for Supabase client generic)
// ──────────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>
      }
      worker_profiles: {
        Row: WorkerProfile
        Insert: Omit<WorkerProfile, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<WorkerProfile, 'id' | 'created_at'>>
      }
      employer_profiles: {
        Row: EmployerProfile
        Insert: Omit<EmployerProfile, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<EmployerProfile, 'id' | 'created_at'>>
      }
      work_type_categories: {
        Row: WorkTypeCategory
        Insert: Omit<WorkTypeCategory, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<WorkTypeCategory, 'id' | 'created_at'>>
      }
      work_pools: {
        Row: WorkPool
        Insert: Omit<WorkPool, 'id' | 'created_at' | 'updated_at' | 'current_count' | 'employer' | 'work_type_category'> & { id?: string }
        Update: Partial<Omit<WorkPool, 'id' | 'created_at' | 'employer' | 'work_type_category'>>
      }
      pool_memberships: {
        Row: PoolMembership
        Insert: Omit<PoolMembership, 'id' | 'joined_at' | 'work_pool' | 'user_profile'> & { id?: string }
        Update: Partial<Omit<PoolMembership, 'id' | 'joined_at' | 'work_pool' | 'user_profile'>>
      }
      pool_posts: {
        Row: PoolPost
        Insert: Omit<PoolPost, 'id' | 'created_at' | 'updated_at' | 'author' | 'comments'> & { id?: string }
        Update: Partial<Omit<PoolPost, 'id' | 'created_at' | 'author' | 'comments'>>
      }
      pool_post_comments: {
        Row: PoolPostComment
        Insert: Omit<PoolPostComment, 'id' | 'created_at' | 'updated_at' | 'author'> & { id?: string }
        Update: Partial<Omit<PoolPostComment, 'id' | 'created_at' | 'author'>>
      }
      conversations: {
        Row: Conversation
        Insert: Omit<Conversation, 'id' | 'created_at' | 'messages' | 'participants'> & { id?: string }
        Update: Partial<Omit<Conversation, 'id' | 'created_at' | 'messages' | 'participants'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at' | 'sender'> & { id?: string }
        Update: Partial<Omit<Message, 'id' | 'created_at' | 'sender'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'reviewer' | 'reviewee'> & { id?: string }
        Update: Partial<Omit<Review, 'id' | 'created_at' | 'reviewer' | 'reviewee'>>
      }
      reports: {
        Row: Report
        Insert: Omit<Report, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Report, 'id' | 'created_at'>>
      }
      admin_actions: {
        Row: AdminAction
        Insert: Omit<AdminAction, 'id' | 'created_at'> & { id?: string }
        Update: never
      }
      prospects: {
        Row: Prospect
        Insert: Omit<Prospect, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Prospect, 'id' | 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: {
      get_my_role: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      user_role: UserRole
      user_status: UserStatus
      visa_type: VisaType
      experience_level: ExperienceLevel
      accommodation_pref: AccommodationPref
      pay_type: PayType
      pool_status: PoolStatus
      membership_status: MembershipStatus
      review_type: ReviewType
      report_reason: ReportReason
      report_status: ReportStatus
      notification_type: NotificationType
    }
  }
}
