// KYSS Vision — Worker Settings (US-056)
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Loader2, Save, Bell, Lock, User } from "lucide-react"
import WorkerLayout from "@/components/WorkerLayout"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/kyss"
import { supabase } from "@/integrations/supabase/client"

export default function WorkerSettings() {
  const { user, userProfile, refreshProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    full_name: userProfile?.full_name || "",
    phone: userProfile?.phone || "",
    country: userProfile?.country || "NZ",
  })
  const [notifPrefs, setNotifPrefs] = useState({
    pool_updates: true,
    new_pools: true,
    messages: true,
    system: false,
  })
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" })
  const [pwError, setPwError] = useState("")
  const [pwSaving, setPwSaving] = useState(false)

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    await updateUserProfile(user.id, { full_name: form.full_name, phone: form.phone, country: form.country as "NZ" | "AU" | "Both" })
    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = async () => {
    setPwError("")
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Passwords do not match."); return }
    if (pwForm.newPw.length < 8) { setPwError("Password must be at least 8 characters."); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPw })
    if (error) { setPwError(error.message) } else { setPwForm({ current: "", newPw: "", confirm: "" }) }
    setPwSaving(false)
  }

  return (
    <>
      <Helmet><title>Settings — KYSS Vision</title></Helmet>
      <WorkerLayout>
        <div className="space-y-8 max-w-2xl">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your account preferences.</p>
          </div>

          {/* Profile */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Profile Details</h2>
            </div>
            {[
              { key: "full_name", label: "Full Name", type: "text", placeholder: "Jane Smith" },
              { key: "phone", label: "Phone Number", type: "tel", placeholder: "+64 21 123 4567" },
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
              <label className="text-xs text-muted-foreground mb-1 block">Target Country</label>
              <select value={form.country} onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="NZ">New Zealand</option>
                <option value="AU">Australia</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <button onClick={handleSaveProfile} disabled={saving} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Notification Preferences</h2>
            </div>
            {[
              { key: "pool_updates", label: "Pool updates", description: "Updates from pools you have joined" },
              { key: "new_pools", label: "New pools", description: "New pools matching your work type and region" },
              { key: "messages", label: "Messages", description: "New messages from employers" },
              { key: "system", label: "System announcements", description: "Platform news and maintenance notices" },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{pref.label}</p>
                  <p className="text-xs text-muted-foreground">{pref.description}</p>
                </div>
                <button
                  onClick={() => setNotifPrefs((prev) => ({ ...prev, [pref.key]: !(prev as any)[pref.key] }))}
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${(notifPrefs as any)[pref.key] ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${(notifPrefs as any)[pref.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Password */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Change Password</h2>
            </div>
            {[
              { key: "newPw", label: "New Password", placeholder: "Min. 8 characters" },
              { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                <input
                  type="password"
                  value={(pwForm as any)[field.key]}
                  onChange={(e) => setPwForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
            {pwError && <p className="text-sm text-destructive">{pwError}</p>}
            <button onClick={handleChangePassword} disabled={pwSaving || !pwForm.newPw} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {pwSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              Update Password
            </button>
          </div>
        </div>
      </WorkerLayout>
    </>
  )
}
