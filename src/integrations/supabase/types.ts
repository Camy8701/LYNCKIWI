export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_clicks: {
        Row: {
          ad_id: string
          clicked_at: string
          device_type: string | null
          id: string
          ip_hash: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          ad_id: string
          clicked_at?: string
          device_type?: string | null
          id?: string
          ip_hash?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          ad_id?: string
          clicked_at?: string
          device_type?: string | null
          id?: string
          ip_hash?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_clicks_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_impressions: {
        Row: {
          ad_id: string
          date: string
          device_type: string | null
          id: string
          impression_count: number | null
        }
        Insert: {
          ad_id: string
          date?: string
          device_type?: string | null
          id?: string
          impression_count?: number | null
        }
        Update: {
          ad_id?: string
          date?: string
          device_type?: string | null
          id?: string
          impression_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_impressions_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_waitlist: {
        Row: {
          company_name: string
          converted_to_ad_id: string | null
          created_at: string
          email: string
          id: string
          industry: string | null
          notified: boolean | null
          notified_at: string | null
          phone: string | null
          preferred_duration: number | null
        }
        Insert: {
          company_name: string
          converted_to_ad_id?: string | null
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          notified?: boolean | null
          notified_at?: string | null
          phone?: string | null
          preferred_duration?: number | null
        }
        Update: {
          company_name?: string
          converted_to_ad_id?: string | null
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          notified?: boolean | null
          notified_at?: string | null
          phone?: string | null
          preferred_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_waitlist_converted_to_ad_id_fkey"
            columns: ["converted_to_ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ads: {
        Row: {
          advertiser_email: string
          advertiser_name: string
          advertiser_phone: string | null
          approved_at: string | null
          approved_by: string | null
          auto_renew: boolean | null
          company_name: string
          created_at: string
          duration_months: number
          expires_at: string | null
          id: string
          industry: string
          logo_url: string
          price_paid: number
          rejection_reason: string | null
          short_description: string | null
          slot_position: number | null
          starts_at: string | null
          status: Database["public"]["Enums"]["ad_status"]
          stripe_payment_id: string | null
          stripe_subscription_id: string | null
          target_all_cities: boolean | null
          target_cities: string[] | null
          updated_at: string
          website_url: string
        }
        Insert: {
          advertiser_email: string
          advertiser_name: string
          advertiser_phone?: string | null
          approved_at?: string | null
          approved_by?: string | null
          auto_renew?: boolean | null
          company_name: string
          created_at?: string
          duration_months?: number
          expires_at?: string | null
          id?: string
          industry: string
          logo_url: string
          price_paid: number
          rejection_reason?: string | null
          short_description?: string | null
          slot_position?: number | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["ad_status"]
          stripe_payment_id?: string | null
          stripe_subscription_id?: string | null
          target_all_cities?: boolean | null
          target_cities?: string[] | null
          updated_at?: string
          website_url: string
        }
        Update: {
          advertiser_email?: string
          advertiser_name?: string
          advertiser_phone?: string | null
          approved_at?: string | null
          approved_by?: string | null
          auto_renew?: boolean | null
          company_name?: string
          created_at?: string
          duration_months?: number
          expires_at?: string | null
          id?: string
          industry?: string
          logo_url?: string
          price_paid?: number
          rejection_reason?: string | null
          short_description?: string | null
          slot_position?: number | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["ad_status"]
          stripe_payment_id?: string | null
          stripe_subscription_id?: string | null
          target_all_cities?: boolean | null
          target_cities?: string[] | null
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          cities: string[] | null
          contact_person: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          phone: string
          service_ids: string[] | null
          whatsapp: string | null
        }
        Insert: {
          cities?: string[] | null
          contact_person?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          phone: string
          service_ids?: string[] | null
          whatsapp?: string | null
        }
        Update: {
          cities?: string[] | null
          contact_person?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string
          service_ids?: string[] | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      lead_assignments: {
        Row: {
          amount_charged: number
          assigned_at: string | null
          assigned_by: string
          company_id: string | null
          id: string
          lead_id: string | null
          notes: string | null
        }
        Insert: {
          amount_charged: number
          assigned_at?: string | null
          assigned_by: string
          company_id?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
        }
        Update: {
          amount_charged?: number
          assigned_at?: string | null
          assigned_by?: string
          company_id?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          admin_notes: string | null
          city: string
          created_at: string | null
          decision_maker: string | null
          email: string | null
          id: string
          name: string
          phone: string
          plz: string
          property_age: string | null
          property_ownership: string | null
          property_type: string | null
          service_details: string
          service_id: string | null
          source: string | null
          status: string | null
          timeline: string
        }
        Insert: {
          admin_notes?: string | null
          city: string
          created_at?: string | null
          decision_maker?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
          plz: string
          property_age?: string | null
          property_ownership?: string | null
          property_type?: string | null
          service_details: string
          service_id?: string | null
          source?: string | null
          status?: string | null
          timeline: string
        }
        Update: {
          admin_notes?: string | null
          city?: string
          created_at?: string | null
          decision_maker?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
          plz?: string
          property_age?: string | null
          property_ownership?: string | null
          property_type?: string | null
          service_details?: string
          service_id?: string | null
          source?: string | null
          status?: string | null
          timeline?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          status: string | null
          created_at: string | null
          updated_at: string | null
          read_at: string | null
          read_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          read_at?: string | null
          read_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          read_at?: string | null
          read_by?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_read_by_fkey"
            columns: ["read_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          description_en: string | null
          icon: string
          id: string
          is_active: boolean | null
          lead_price_shared: number | null
          name: string
          name_en: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          icon: string
          id?: string
          is_active?: boolean | null
          lead_price_shared?: number | null
          name: string
          name_en: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          lead_price_shared?: number | null
          name?: string
          name_en?: string
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ad_analytics: {
        Args: { p_ad_id: string }
        Returns: {
          ctr: number
          total_clicks: number
          total_impressions: number
        }[]
      }
      get_available_ad_slots: { Args: never; Returns: number }
      get_next_available_slot_date: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_ad_impression: {
        Args: { p_ad_id: string; p_device_type?: string }
        Returns: undefined
      }
    }
    Enums: {
      ad_status: "pending" | "active" | "paused" | "rejected" | "expired"
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ad_status: ["pending", "active", "paused", "rejected", "expired"],
      app_role: ["admin", "user"],
    },
  },
} as const
