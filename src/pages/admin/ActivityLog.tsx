// KYSS Vision — Admin Activity Log (US-050)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Activity, Loader2, Filter } from "lucide-react"
import AdminLayout from "@/components/AdminLayout"
import { supabase } from "@/integrations/supabase/client"
import type { AdminAction } from "@/integrations/supabase/types"

const ACTION_COLORS: Record<string, string> = {
  ban_user: "text-red-400",
  unban_user: "text-green-400",
  verify_user: "text-blue-400",
  close_pool: "text-yellow-400",
  resolve_report: "text-green-400",
  dismiss_report: "text-muted-foreground",
}

export default function AdminActivityLog() {
  const [actions, setActions] = useState<AdminAction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    supabase.from("admin_actions").select("*").order("created_at", { ascending: false }).limit(200)
      .then(({ data }) => { setActions(data || []); setLoading(false) })
  }, [])

  const filtered = filter
    ? actions.filter((a) => a.action_type?.toLowerCase().includes(filter.toLowerCase()) || a.notes?.toLowerCase().includes(filter.toLowerCase()))
    : actions

  return (
    <>
      <Helmet><title>Activity Log — Admin — KYSS Vision</title></Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
              <p className="text-muted-foreground text-sm mt-1">Audit trail of all admin actions.</p>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter actions..." className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-56" />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Activity className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">No activity recorded yet.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Target</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs font-medium ${ACTION_COLORS[a.action_type] || "text-foreground"}`}>
                          {a.action_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{a.target_id?.slice(0, 12)}...</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{a.notes || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(a.created_at).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
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
