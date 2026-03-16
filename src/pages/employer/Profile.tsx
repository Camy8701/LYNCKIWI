// KYSS Vision — Employer Profile Edit (US-058)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Loader2, Save, Building2 } from "lucide-react"
import EmployerLayout from "@/components/EmployerLayout"
import { useAuth } from "@/contexts/AuthContext"
import { getEmployerProfile, updateEmployerProfile, updateUserProfile } from "@/lib/kyss"
import type { EmployerProfile } from "@/integrations/supabase/types"

export default function EmployerProfilePage() {
  const { user, userProfile, refreshProfile } = useAuth()
  const [profile, setProfile] = useState<EmployerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    company_description: "",
    website: "",
    region: "",
    country: "NZ",
  })

  useEffect(() => {
    if (!user) return
    getEmployerProfile(user.id).then((p) => {
      setProfile(p)
      setForm({
        full_name: userProfile?.full_name || "",
        company_name: p?.company_name || "",
        company_description: p?.company_description || "",
        website: p?.website || "",
        region: p?.region || "",
        country: userProfile?.country || "NZ",
      })
      setLoading(false)
    })
  }, [user, userProfile])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await updateUserProfile(user.id, { full_name: form.full_name, country: form.country as "NZ" | "AU" | "Both" })
    await updateEmployerProfile(user.id, {
      company_name: form.company_name,
      company_description: form.company_description,
      website: form.website,
      region: form.region,
    })
    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <Helmet><title>Business Profile — KYSS Vision</title></Helmet>
      <EmployerLayout>
        <div className="space-y-6 max-w-2xl">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Business Profile</h1>
            <p className="text-muted-foreground text-sm mt-1">This information is shown to workers when they view your pools.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Business Details</h2>
              </div>
              {[
                { key: "full_name", label: "Contact Name", type: "text", placeholder: "Your full name" },
                { key: "company_name", label: "Business / Farm Name", type: "text", placeholder: "e.g. Sunrise Orchards" },
                { key: "website", label: "Website (optional)", type: "url", placeholder: "https://yourfarm.co.nz" },
                { key: "region", label: "Region", type: "text", placeholder: "e.g. Hawke's Bay, NZ" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Country</label>
                <select value={form.country} onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="NZ">New Zealand</option>
                  <option value="AU">Australia</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">About Your Farm / Business</label>
                <textarea
                  value={form.company_description}
                  onChange={(e) => setForm((prev) => ({ ...prev, company_description: e.target.value }))}
                  placeholder="Tell workers about your farm, what you grow, and what makes working with you great..."
                  rows={4}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saved ? "Saved!" : "Save Profile"}
              </button>
            </div>
          )}
        </div>
      </EmployerLayout>
    </>
  )
}
