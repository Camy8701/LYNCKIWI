// KYSS Vision — Worker Profile Wizard (US-036)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { updateWorkerProfile } from '@/lib/kyss'
import { nzRegions, auRegions, allRegions } from '@/data/regionsData'

const STEPS = ['Personal', 'Nationality', 'Visa', 'Experience', 'Availability', 'Review']

const visaTypes = ['Working Holiday (WHV)', 'Student Visa', 'Resident', 'Citizen', 'Other']
const experienceLevels = ['No experience', 'Some experience (1 season)', 'Experienced (2-3 seasons)', 'Very experienced (4+ seasons)']
const languages = ['English', 'French', 'German', 'Spanish', 'Portuguese', 'Japanese', 'Korean', 'Mandarin', 'Other']

export default function ProfileWizard() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    nationality: '',
    languages: [] as string[],
    visa_type: '',
    visa_expiry: '',
    experience_level: '',
    bio: '',
    preferred_regions: [] as string[],
    available_from: '',
    available_until: '',
    accommodation_needed: false,
    transport_available: false,
  })

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }))

  const toggleArray = (key: 'languages' | 'preferred_regions', val: string) => {
    setForm((f) => {
      const arr = f[key] as string[]
      return { ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] }
    })
  }

  const handleSubmit = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    const { error: err } = await updateWorkerProfile(user.id, {
      ...form,
      profile_complete: true,
    })
    if (err) {
      setError(err)
      setSaving(false)
    } else {
      await refreshProfile()
      navigate('/worker/dashboard')
    }
  }

  return (
    <>
      <Helmet><title>Complete Your Profile — KYSS Vision</title></Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
            <p className="text-muted-foreground text-sm mt-1">This helps employers find the right workers for their pools.</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-muted text-muted-foreground'}`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 w-6 sm:w-10 mx-1 transition-colors ${i < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">{STEPS[step]}</h2>

            {/* Step 0: Personal */}
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                  <input type="text" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Your full name" className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+64 or +61..." className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Short Bio</label>
                  <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Tell employers a bit about yourself..." rows={3} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            )}

            {/* Step 1: Nationality & Languages */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Nationality</label>
                  <input type="text" value={form.nationality} onChange={(e) => set('nationality', e.target.value)} placeholder="e.g. French, German, Japanese..." className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <button key={lang} type="button" onClick={() => toggleArray('languages', lang)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.languages.includes(lang) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary'}`}>
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Visa */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Visa Type</label>
                  <div className="space-y-2">
                    {visaTypes.map((v) => (
                      <button key={v} type="button" onClick={() => set('visa_type', v)} className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${form.visa_type === v ? 'bg-primary/10 border-primary text-foreground' : 'bg-background border-border text-muted-foreground hover:border-primary'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Visa Expiry Date</label>
                  <input type="date" value={form.visa_expiry} onChange={(e) => set('visa_expiry', e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            )}

            {/* Step 3: Experience */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Farm Work Experience</label>
                  <div className="space-y-2">
                    {experienceLevels.map((lvl) => (
                      <button key={lvl} type="button" onClick={() => set('experience_level', lvl)} className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${form.experience_level === lvl ? 'bg-primary/10 border-primary text-foreground' : 'bg-background border-border text-muted-foreground hover:border-primary'}`}>
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Availability & Preferences */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Available From</label>
                    <input type="date" value={form.available_from} onChange={(e) => set('available_from', e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Available Until</label>
                    <input type="date" value={form.available_until} onChange={(e) => set('available_until', e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Preferred Regions</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {allRegions.map((r) => (
                      <button key={r.value} type="button" onClick={() => toggleArray('preferred_regions', r.value)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.preferred_regions.includes(r.value) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary'}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.accommodation_needed} onChange={(e) => set('accommodation_needed', e.target.checked)} className="rounded border-border" />
                    <span className="text-sm text-foreground">Need accommodation</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.transport_available} onChange={(e) => set('transport_available', e.target.checked)} className="rounded border-border" />
                    <span className="text-sm text-foreground">Have own transport</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-3">
                {[
                  { label: 'Name', value: form.full_name },
                  { label: 'Nationality', value: form.nationality },
                  { label: 'Languages', value: form.languages.join(', ') },
                  { label: 'Visa', value: form.visa_type },
                  { label: 'Experience', value: form.experience_level },
                  { label: 'Available', value: form.available_from ? `${form.available_from} → ${form.available_until || 'open'}` : 'Not set' },
                  { label: 'Regions', value: form.preferred_regions.join(', ') || 'Any' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm text-foreground font-medium text-right max-w-[60%]">{value || '—'}</span>
                  </div>
                ))}
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep((s) => s + 1)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
