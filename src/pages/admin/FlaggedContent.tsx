// KYSS Vision — Admin Flagged Content (US-049)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Flag, Loader2, CheckCircle, XCircle } from "lucide-react"
import AdminLayout from "@/components/AdminLayout"
import { supabase } from "@/integrations/supabase/client"
import type { Report } from "@/integrations/supabase/types"

export default function AdminFlaggedContent() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from("reports").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setReports(data || []); setLoading(false) })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("reports").update({ status }).eq("id", id)
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: status as Report["status"] } : r))
  }

  const pending = reports.filter((r) => r.status === "pending")
  const resolved = reports.filter((r) => r.status !== "pending")

  return (
    <>
      <Helmet><title>Flagged Content — Admin — KYSS Vision</title></Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Flagged Content</h1>
            <p className="text-muted-foreground text-sm mt-1">{pending.length} pending reports</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : reports.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Flag className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">No reports yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...pending, ...resolved].map((r) => (
                <div key={r.id} className={`bg-card border rounded-xl p-4 ${r.status === "pending" ? "border-yellow-500/30" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${r.status === "pending" ? "bg-yellow-400/10 text-yellow-400" : r.status === "resolved" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                          {r.status}
                        </span>
                        <span className="text-xs text-muted-foreground">{r.content_type} · {r.reason}</span>
                      </div>
                      <p className="text-sm text-foreground">{r.description || "No description provided."}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    {r.status === "pending" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => updateStatus(r.id, "resolved")} className="p-1.5 rounded-lg hover:bg-green-400/10 transition-colors" title="Resolve">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </button>
                        <button onClick={() => updateStatus(r.id, "dismissed")} className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors" title="Dismiss">
                          <XCircle className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
