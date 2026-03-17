// KYSS Vision — Auth Callback
// Handles email confirmation redirect and Google OAuth callback
// Creates user_profiles row for first-time OAuth users
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const navigate = useNavigate()
  const { role, isLoading, refreshProfile } = useAuth()
  const profileChecked = useRef(false)

  useEffect(() => {
    const handleOAuth = async () => {
      if (profileChecked.current) return
      profileChecked.current = true

      // Get session (exchanges code if present in URL)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate("/auth/sign-in")
        return
      }

      const userId = session.user.id

      // Check if user_profiles row exists
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle()

      if (!error && profile) {
        // Profile exists — redirect based on role
        if (profile.role === "admin") navigate("/admin")
        else if (profile.role === "employer") navigate("/employer/dashboard")
        else if (profile.role === "worker") navigate("/worker/dashboard")
        else navigate("/worker/profile-wizard")
        return
      }

      // No profile yet (first-time OAuth user) — create one
      const meta = session.user.user_metadata
      const name = meta?.full_name || meta?.name || session.user.email?.split("@")[0] || "User"

      await supabase.from("user_profiles").insert({
        user_id: userId,
        role: "worker",
        name,
        country: "",
        status: "active",
      })

      // Also create worker_profiles row
      await supabase.from("worker_profiles").insert({
        user_id: userId,
        has_transport: false,
        profile_complete: false,
      })

      // Refresh auth context so role is available
      await refreshProfile()

      // Send new user to profile wizard
      navigate("/worker/profile-wizard")
    }

    handleOAuth()
  }, [])

  // Fallback: if role arrives via AuthContext listener before our check
  useEffect(() => {
    if (!isLoading && role && profileChecked.current) return // already handled
    if (!isLoading && role) {
      if (role === "admin") navigate("/admin")
      else if (role === "employer") navigate("/employer/dashboard")
      else navigate("/worker/dashboard")
    }
  }, [isLoading, role])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  )
}
