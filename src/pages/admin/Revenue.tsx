// KYSS Vision — Admin Revenue (US-047)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { DollarSign, Users, Briefcase, TrendingUp, Loader2 } from "lucide-react"
import AdminLayout from "@/components/AdminLayout"
import { supabase } from "@/integrations/supabase/client"

export default function AdminRevenue() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: pools } = await supabase.from("work_pools").select("id,title,current_count,max_workers,status,region,country")
      const poolData = (pools || []) as any[]
      const activePools = poolData.filter((p) => p.status === "open" || p.status === "full")
      const totalActiveWorkers = activePools.reduce((sum: number, p: any) => sum + (p.current_count || 0), 0)
      setData({
        totalActiveWorkers,
        activePools: activePools.length,
        revenuePerHour: totalActiveWorkers * 1,
        revenuePerDay: totalActiveWorkers * 1 * 8,
        revenuePerWeek: totalActiveWorkers * 1 * 40,
        topPools: activePools.sort((a: any, b: any) => (b.current_count || 0) - (a.current_count || 0)).slice(0, 5),
      })
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <Helmet><title>Revenue — Admin — KYSS Vision</title></Helmet>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Revenue Tracking</h1>
            <p className="text-muted-foreground text-sm mt-1">$1 per worker per hour in active pools.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Workers", value: data.totalActiveWorkers, icon: <Users className="w-5 h-5 text-primary" />, color: "bg-primary/10" },
                  { label: "Revenue / Hour", value: `$${data.revenuePerHour}`, icon: <DollarSign className="w-5 h-5 text-green-400" />, color: "bg-green-400/10" },
                  { label: "Revenue / Day (8hr)", value: `$${data.revenuePerDay}`, icon: <TrendingUp className="w-5 h-5 text-blue-400" />, color: "bg-blue-400/10" },
                  { label: "Revenue / Week (40hr)", value: `$${data.revenuePerWeek}`, icon: <Briefcase className="w-5 h-5 text-purple-400" />, color: "bg-purple-400/10" },
                ].map((card) => (
                  <div key={card.label} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                    <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center shrink-0`}>{card.icon}</div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{card.value}</p>
                      <p className="text-xs text-muted-foreground">{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-foreground mb-4">Top Revenue Pools</h2>
                <div className="space-y-3">
                  {data.topPools.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No active pools yet.</p>
                  ) : data.topPools.map((pool: any) => (
                    <div key={pool.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{pool.title}</p>
                        <p className="text-xs text-muted-foreground">{pool.region} · {pool.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">${pool.current_count || 0}/hr</p>
                        <p className="text-xs text-muted-foreground">{pool.current_count}/{pool.max_workers} workers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
