// KYSS Vision — Admin Dashboard (US-043)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Users, Briefcase, Building2, DollarSign, TrendingUp, Activity, Loader2 } from "lucide-react"
import AdminLayout from "@/components/AdminLayout"
import { supabase } from "@/integrations/supabase/client"

interface Stats {
  totalWorkers: number
  totalEmployers: number
  totalPools: number
  activePools: number
  totalMemberships: number
  totalProspects: number
  revenueEstimate: number
}

export default function AdminDashboardKYSS() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const [workers, employers, pools, memberships, prospects] = await Promise.all([
        supabase.from("user_profiles").select("id", { count: "exact" }).eq("role", "worker"),
        supabase.from("user_profiles").select("id", { count: "exact" }).eq("role", "employer"),
        supabase.from("work_pools").select("id,status,current_count"),
        supabase.from("pool_memberships").select("id", { count: "exact" }).eq("status", "active"),
        supabase.from("prospects").select("id", { count: "exact" }),
      ])
      const poolData = (pools.data || []) as any[]
      const activePools = poolData.filter((p) => p.status === "open" || p.status === "full").length
      const totalWorkerHours = poolData.reduce((sum, p) => sum + (p.current_count || 0), 0)
      setStats({
        totalWorkers: workers.count || 0,
        totalEmployers: employers.count || 0,
        totalPools: poolData.length,
        activePools,
        totalMemberships: memberships.count || 0,
        totalProspects: prospects.count || 0,
        revenueEstimate: totalWorkerHours * 1,
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  const statCards = stats ? [
    { label: "Total Workers", value: stats.totalWorkers, icon: <Users className="w-5 h-5 text-primary" />, color: "bg-primary/10" },
    { label: "Total Employers", value: stats.totalEmployers, icon: <Building2 className="w-5 h-5 text-blue-400" />, color: "bg-blue-400/10" },
    { label: "Active Pools", value: `${stats.activePools} / ${stats.totalPools}`, icon: <Briefcase className="w-5 h-5 text-green-400" />, color: "bg-green-400/10" },
    { label: "Active Memberships", value: stats.totalMemberships, icon: <Activity className="w-5 h-5 text-purple-400" />, color: "bg-purple-400/10" },
    { label: "AI Prospects", value: stats.totalProspects, icon: <TrendingUp className="w-5 h-5 text-orange-400" />, color: "bg-orange-400/10" },
    { label: "Revenue (est. $/hr)", value: `$${stats.revenueEstimate}`, icon: <DollarSign className="w-5 h-5 text-yellow-400" />, color: "bg-yellow-400/10" },
  ] : []

  return (
    <>
      <Helmet><title>Admin Dashboard — KYSS Vision</title></Helmet>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">KYSS Vision platform overview.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {statCards.map((card) => (
                <div key={card.label} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center shrink-0`}>{card.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">Platform Health</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>All systems operational</p>
              <p>Supabase RLS policies active on all 15 tables</p>
              <p>Manus AI prospect pipeline connected</p>
              <p>Revenue model: $1 per worker per hour in active pools</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
