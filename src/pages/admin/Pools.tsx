// KYSS Vision — Admin Pools (US-045)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Search, Loader2 } from "lucide-react"
import AdminLayout from "@/components/AdminLayout"
import { supabase } from "@/integrations/supabase/client"
import StatusBadge from "@/components/pools/StatusBadge"
import type { WorkPool } from "@/integrations/supabase/types"

export default function AdminPools() {
  const [pools, setPools] = useState<WorkPool[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    supabase.from("work_pools").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setPools(data || []); setLoading(false) })
  }, [])

  const filtered = pools.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.region || "").toLowerCase().includes(search.toLowerCase())
  )

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("work_pools").update({ status }).eq("id", id)
    setPools((prev) => prev.map((p) => p.id === id ? { ...p, status: status as WorkPool["status"] } : p))
  }

  return (
    <>
      <Helmet><title>Pools — Admin — KYSS Vision</title></Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Work Pools</h1>
              <p className="text-muted-foreground text-sm mt-1">{pools.length} total pools</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pools..." className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-56" />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pool</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Region</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Workers</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pay</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No pools found.</td></tr>
                  ) : filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.country}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.region || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.current_count}/{p.max_workers}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.currency} {p.pay_rate}/{p.pay_type}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3">
                        <select value={p.status} onChange={(e) => updateStatus(p.id, e.target.value)} className="bg-muted border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                          <option value="open">Open</option>
                          <option value="full">Full</option>
                          <option value="closed">Closed</option>
                          <option value="draft">Draft</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
