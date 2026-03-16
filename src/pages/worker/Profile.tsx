// KYSS Vision — Worker Profile View (US-057)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { Loader2, Edit, CheckCircle, MapPin, Briefcase, Globe } from "lucide-react"
import WorkerLayout from "@/components/WorkerLayout"
import { useAuth } from "@/contexts/AuthContext"
import { getWorkerProfile } from "@/lib/kyss"
import type { WorkerProfile } from "@/integrations/supabase/types"

export default function WorkerProfilePage() {
  const { user, userProfile } = useAuth()
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getWorkerProfile(user.id).then((p) => { setWorkerProfile(p); setLoading(false) })
  }, [user])

  const completionFields = [
    { label: "Full name", done: !!userProfile?.full_name },
    { label: "Country", done: !!userProfile?.country },
    { label: "Nationality", done: !!workerProfile?.nationality },
    { label: "Visa type", done: !!workerProfile?.visa_type },
    { label: "Work experience", done: (workerProfile?.work_experience_years ?? 0) > 0 },
    { label: "Availability", done: !!workerProfile?.available_from },
  ]
  const completionPct = Math.round((completionFields.filter((f) => f.done).length / completionFields.length) * 100)

  return (
    <>
      <Helmet><title>My Profile — KYSS Vision</title></Helmet>
      <WorkerLayout>
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground text-sm mt-1">This is what employers see when you join their pool.</p>
            </div>
            <Link to="/worker/profile-wizard" className="inline-flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
              <Edit className="w-4 h-4" /> Edit Profile
            </Link>
          </div>

          {/* Completion */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Profile completion</p>
              <p className="text-sm font-bold text-primary">{completionPct}%</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {completionFields.map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-xs">
                  <CheckCircle className={`w-3.5 h-3.5 ${f.done ? "text-green-400" : "text-muted-foreground/30"}`} />
                  <span className={f.done ? "text-foreground" : "text-muted-foreground"}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                  {userProfile?.full_name?.charAt(0) || "?"}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{userProfile?.full_name || "—"}</h2>
                  <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                {[
                  { icon: <MapPin className="w-4 h-4" />, label: "Country", value: userProfile?.country || "—" },
                  { icon: <Globe className="w-4 h-4" />, label: "Nationality", value: workerProfile?.nationality || "—" },
                  { icon: <Briefcase className="w-4 h-4" />, label: "Visa Type", value: workerProfile?.visa_type || "—" },
                  { icon: <Briefcase className="w-4 h-4" />, label: "Experience", value: workerProfile?.work_experience_years != null ? `${workerProfile.work_experience_years} years` : "—" },
                  { icon: <MapPin className="w-4 h-4" />, label: "Available From", value: workerProfile?.available_from ? new Date(workerProfile.available_from).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" }) : "—" },
                  { icon: <MapPin className="w-4 h-4" />, label: "Available Until", value: workerProfile?.available_until ? new Date(workerProfile.available_until).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" }) : "—" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center shrink-0 text-muted-foreground mt-0.5">{item.icon}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {workerProfile?.bio && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Bio</p>
                  <p className="text-sm text-foreground leading-relaxed">{workerProfile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </WorkerLayout>
    </>
  )
}
