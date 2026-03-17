// KYSS Vision — How It Works (Redesigned — visual step cards)
import { UserPlus, Search, Users, Briefcase, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up as a worker or employer. Upload your visa, set your skills, and choose your preferred regions.',
  },
  {
    icon: Search,
    step: '02',
    title: 'Browse Work Pools',
    description: 'Explore 9 categories of seasonal work. Filter by region, pay rate, and accommodation.',
  },
  {
    icon: Users,
    step: '03',
    title: 'Join a Pool',
    description: 'One tap and you are hired. No applications, no interviews. Joining a pool means confirmed placement.',
  },
  {
    icon: Briefcase,
    step: '04',
    title: 'Start Working',
    description: 'Get your contract, join the pool feed for updates, and show up on day one ready to go.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
            Simple 4-step process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            From sign-up to first day of work in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={s.step} className="glass-card rounded-2xl p-7 relative group">
              {/* Step number */}
              <div className="text-6xl font-black text-primary/[0.08] absolute top-4 right-5 select-none">{s.step}</div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-5 transition-colors">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>

              {/* Connector arrow (except last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-background border border-border items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/auth/sign-up"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
