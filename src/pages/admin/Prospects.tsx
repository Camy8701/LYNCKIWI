// KYSS Vision — Admin Prospects (Manus AI Pipeline) (US-048)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Search, Loader2, Plus, Bot } from "lucide-react"
import AdminLayout from "@/components/AdminLayout"
import { getProspects, createProspect, updateProspect } from "@/lib/kyss"
import type { Prospect } from "@/integrations/supabase/types"

const STATUS_COLORS: Record<string, string> = {
  identified: "bg-blue-400/10 text-blue-400",
  contacted: "bg-yellow-400/10 text-yellow-400",
  qualified: "bg-green-400/10 text-green-400",
  converted: "bg-primary/10 text-primary",
  rejected: "bg-red-400/10 text-red-400",
}

export default function AdminProspects() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ full_name: "", email: "", source: "", notes: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getProspects().then((p) => { setProspects(p); setLoading(false) })
  }, [])

  const filtered = prospects.filter((p) =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!form.full_name || !form.email) return
    setSaving(true)
    await createProspect({ full_name: form.full_name, email: form.email, source: form.source, notes: form.notes, status: "identified" })
    const updated = await getProspects()
    setProspects(updated)
    setForm({ full_name: "", email: "", source: "", notes: "" })
    setShowForm(false)
    setSaving(false)
  }

  const handleStatus = async (id: string, status: string) => {
    await updateProspect(id, { status: status as Prospect["status"] })
    setProspects((prev) => prev.map((p) => p.id === id ? { ...p, status: status as Prospect["status"] } : p))
  }

  return (
    <>
      <Helmet><title>Prospects — Admin — KYSS Vision</title></Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Manus AI Prospects</h1>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  <Bot className="w-3 h-3" /> AI Pipeline
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">Workers pre-qualified by Manus AI off-platform.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search prospects..." className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-56" />
              </div>
              <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" /> Add Prospect
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="text-base font-semibold text-foreground">Add New Prospect</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "full_name", label: "Full Name", placeholder: "Jane Smith" },
                  { key: "email", label: "Email", placeholder: "jane@example.com" },
                  { key: "source", label: "Source", placeholder: "Facebook, WhatsApp, etc." },
                  { key: "notes", label: "Notes", placeholder: "Pre-qualified for fruit picking..." },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                    <input
                      type="text"
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={saving || !form.full_name || !form.email} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Save
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prospect</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Source</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No prospects yet. Add your first Manus AI prospect above.</td></tr>
                  ) : filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{p.full_name}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.source || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{p.notes || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLORS[p.status] || "bg-muted text-muted-foreground"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select value={p.status} onChange={(e) => handleStatus(p.id, e.target.value)} className="bg-muted border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                          <option value="identified">Identified</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="rejected">Rejected</option>
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
