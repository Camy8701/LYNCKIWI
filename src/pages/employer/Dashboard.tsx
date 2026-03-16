// KYSS Vision — Employer Dashboard (US-041)
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { Users, Briefcase, DollarSign, Plus, ChevronRight, Loader2, TrendingUp } from "lucide-react"
import EmployerLayout from "@/components/EmployerLayout"
import { useAuth } from "@/contexts/AuthContext"
import { getPoolsByEmployer } from "@/lib/kyss"
import StatusBadge from "@/components/pools/StatusBadge"
import type { WorkPool } from "@/integrations/supabase/types"

export default function EmployerDashboard() {
  const { user, userProfile } = useAuth()
  const [pools, setPools] = useState<WorkPool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getPoolsByEmployer(user.id).then((p) => { setPools(p); setLoading(false) })
  }, [user])

  const totalWorkers = pools.reduce((sum, p) => sum + (p.current_count || 0), 0)
  const activePools = pools.filter((p) => p.status === "open" || p.status === "full").length

  return (
    <>
      <Helmet><title>Employer Dashboard — KYSS Vision</title></Helmet>
      <EmployerLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome{userProfile?.full_name ? `, ${userProfile.full_name.split(" ")[0]}` : ""}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Manage your pools and workforce.</p>
            </div>
            <Link to="/employer/pools/create" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> New Pool
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Active Pools", value: activePools, icon: <Briefcase className="w-5 h-5 text-primary" />, color: "bg-primary/10" },
              { label: "Total Workers", value: totalWorkers, icon: <Users className="w-5 h-5 text-blue-400" />, color: "bg-blue-400/10" },
              { label: "Platform Cost", value: `$${totalWorkers}/hr`, icon: <DollarSign className="w-5 h-5 text-green-400" />, color: "bg-green-400/10" },
            ].map((card) => (
              <div key={card.label} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>{card.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Simple, transparent pricing</p>
              <p className="text-sm text-muted-foreground mt-1">
                KYSS charges <strong className="text-foreground">$1 per worker per hour</strong> for every worker active in your pools. No upfront fees, no contracts.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">My Pools</h2>
              <Link to="/employer/pools" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : pools.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <p className="text-muted-foreground text-sm mb-4">You have not created any pools yet.</p>
                <Link to="/employer/pools/create" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" /> Create Your First Pool
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {pools.slice(0, 5).map((pool) => (
                  <Link key={pool.id} to={`/employer/pools/${pool.id}`} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors group">
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{pool.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{pool.region} · {pool.current_count}/{pool.max_workers} workers</p>
                    </div>
                    <StatusBadge status={pool.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </EmployerLayout>
    </>
  )
}
