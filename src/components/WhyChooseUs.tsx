// KYSS Vision — How It Works (US-020)
import { UserPlus, Search, Users, Briefcase } from 'lucide-react'

const steps = [
  { icon: UserPlus, step: '01', title: 'Create Your Profile', description: 'Sign up as a worker or employer. Tell us your skills, visa type, and preferred regions.' },
  { icon: Search, step: '02', title: 'Browse Work Types', description: 'Explore 9 categories of seasonal work across New Zealand and Australia.' },
  { icon: Users, step: '03', title: 'Join a Pool', description: 'Find an open pool and join with one click. Joining = confirmed hire. No applications needed.' },
  { icon: Briefcase, step: '04', title: 'Start Working', description: 'Connect with your employer in the pool feed, get your start date, and begin your adventure.' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From sign-up to first day of work in four simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="relative">
              <div className="text-5xl font-black text-primary/10 mb-3">{s.step}</div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
