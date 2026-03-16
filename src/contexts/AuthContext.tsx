// ============================================================
// KYSS Vision — AuthContext
// US-011: Three-role auth context (worker | employer | admin)
// ============================================================

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { UserProfile, UserRole } from '@/integrations/supabase/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  role: UserRole | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    country: string
  ) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
      return data as UserProfile
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      return null
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    const profile = await fetchUserProfile(user.id)
    if (profile) {
      setUserProfile(profile)
      setRole(profile.role)
    }
  }

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Defer profile fetch to avoid Supabase deadlock
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id)
            if (profile) {
              setUserProfile(profile)
              setRole(profile.role)
            }
            setIsLoading(false)
          }, 0)
        } else {
          setUserProfile(null)
          setRole(null)
          setIsLoading(false)
        }
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      return { error: null }
    } catch (err) {
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    country: string
  ): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) return { error: error.message }
      if (!data.user) return { error: 'Sign up failed. Please try again.' }

      // Create user_profiles row
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          role,
          name,
          country,
          status: 'active',
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        return { error: 'Account created but profile setup failed. Please contact support.' }
      }

      // Create role-specific profile row
      if (role === 'worker') {
        await supabase.from('worker_profiles').insert({
          user_id: data.user.id,
          has_transport: false,
          profile_complete: false,
        })
      } else if (role === 'employer') {
        await supabase.from('employer_profiles').insert({
          user_id: data.user.id,
          business_name: name,
          country,
          verified: false,
        })
      }

      return { error: null }
    } catch (err) {
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setUserProfile(null)
    setRole(null)
  }

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    role,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
