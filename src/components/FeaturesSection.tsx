// KYSS Vision — FeaturesSection "Why KYSS?" (Redesigned — large glass cards)
import { Shield, Zap, DollarSign, Users, Star, MapPin } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Verified Employers Only',
    description: 'Every employer on KYSS is manually vetted. No fake listings, no scams. Read real worker reviews before you commit.',
    stat: '100%',
    statLabel: 'verified',
  },
  {
    icon: Zap,
    title: 'Instant Pool Placement',
    description: 'Join a pool and you are confirmed. No waiting, no applications, no ghosting. Start work when the season begins.',
    stat: '< 24h',
    statLabel: 'avg match',
  },
  {
    icon: DollarSign,
    title: 'Fair Pay, Guaranteed',
    description: 'All pay rates are listed upfront and verified. Know exactly what you will earn before you commit to any pool.',
    stat: '$25+',
    statLabel: 'avg hourly',
  },
]

const stats = [
  { icon: Users, value: '2,400+', label: 'Workers placed' },
  { icon: MapPin, value: '24', label: 'Regions covered' },
  { icon: Star, value: '4.9/5', label: 'Worker satisfaction' },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">Why KYSS?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            We built the platform we wish existed when we were backpackers.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {features.map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-8 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{f.stat}</p>
                  <p className="text-xs text-muted-foreground">{f.statLabel}</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="glass-card rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-around gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
