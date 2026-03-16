// KYSS Vision — FeaturesSection "Why KYSS?" (US-020)
import { Shield, Zap, DollarSign } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Verified Employers Only',
    description: 'Every employer on KYSS is manually vetted. No fake listings, no scams. Your safety is our first priority.',
  },
  {
    icon: Zap,
    title: 'Instant Pool Placement',
    description: 'Join a pool and you are confirmed. No waiting, no applications, no ghosting. Start work when the season begins.',
  },
  {
    icon: DollarSign,
    title: 'Fair Pay, Guaranteed',
    description: 'All pay rates are listed upfront and verified. Know exactly what you will earn before you commit.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why KYSS?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We built the platform we wish existed when we were backpackers.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
