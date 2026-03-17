// KYSS Vision — Auth Callback
// Handles email confirmation redirect and Google OAuth callback
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const navigate = useNavigate()
  const { role, isLoading } = useAuth()

  useEffect(() => {
    // Exchange the auth code in the URL for a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth/sign-in")
      }
    })
  }, [])

  useEffect(() => {
    if (!isLoading && role) {
      if (role === "admin") navigate("/admin")
      else if (role === "employer") navigate("/employer/dashboard")
      else navigate("/worker/profile-wizard")
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
