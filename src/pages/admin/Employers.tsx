// KYSS Vision — Admin Employers (US-046)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Search, Loader2, Building2, CheckCircle, XCircle } from "lucide-react"
import AdminLayout from "@/components/AdminLayout"
import { supabase } from "@/integrations/supabase/client"
import type { UserProfile } from "@/integrations/supabase/types"

export default function AdminEmployers() {
  const [employers, setEmployers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    supabase.from("user_profiles").select("*").eq("role", "employer").order("created_at", { ascending: false })
      .then(({ data }) => { setEmployers(data || []); setLoading(false) })
  }, [])

  const filtered = employers.filter((e) =>
    e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleVerify = async (id: string, current: boolean) => {
    await supabase.from("user_profiles").update({ is_verified: !current }).eq("id", id)
    setEmployers((prev) => prev.map((e) => e.id === id ? { ...e, is_verified: !current } : e))
  }

  const toggleBan = async (id: string, current: boolean) => {
    await supabase.from("user_profiles").update({ is_banned: !current }).eq("id", id)
    setEmployers((prev) => prev.map((e) => e.id === id ? { ...e, is_banned: !current } : e))
  }

  return (
    <>
      <Helmet><title>Employers — Admin — KYSS Vision</title></Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Employers</h1>
              <p className="text-muted-foreground text-sm mt-1">{employers.length} registered employers</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employers..." className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-64" />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employer</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Country</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Joined</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No employers found.</td></tr>
                  ) : filtered.map((e) => (
                    <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-400/10 rounded-full flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{e.full_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{e.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{e.country || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(e.created_at).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {e.is_verified && <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">Verified</span>}
                          {e.is_banned && <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full">Banned</span>}
                          {!e.is_verified && !e.is_banned && <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">Pending</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleVerify(e.id, !!e.is_verified)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <CheckCircle className={`w-4 h-4 ${e.is_verified ? "text-green-400" : "text-muted-foreground"}`} />
                          </button>
                          <button onClick={() => toggleBan(e.id, !!e.is_banned)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <XCircle className={`w-4 h-4 ${e.is_banned ? "text-red-400" : "text-muted-foreground"}`} />
                          </button>
                        </div>
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
