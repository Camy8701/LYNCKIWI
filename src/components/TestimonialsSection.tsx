// KYSS Vision — TestimonialsSection (Redesigned — large glass cards)
import { Star, Quote } from 'lucide-react'

const testimonials = [
  { initials: 'SL', name: 'Sophie L.', role: 'Worker', location: 'France', text: 'I found a grape harvesting job in Marlborough within 2 days of signing up. The pool system is genius — joining really does mean you are hired.', color: 'bg-blue-500' },
  { initials: 'KT', name: 'Kenji T.', role: 'Worker', location: 'Japan', text: 'No more sending CVs into the void. I joined a fruit picking pool in Hawke\'s Bay and started the following Monday. Incredible platform.', color: 'bg-emerald-500' },
  { initials: 'LM', name: 'Laura M.', role: 'Worker', location: 'Germany', text: 'The verified employer badge gave me real confidence. I knew exactly what I was getting into — pay rate, location, start date. No surprises.', color: 'bg-purple-500' },
  { initials: 'JF', name: 'James F.', role: 'Employer', location: 'Bay of Plenty', text: 'We filled our entire harvest crew through KYSS in under a week. The workers are pre-vetted and serious. Worth every cent.', color: 'bg-amber-500' },
  { initials: 'MR', name: 'Maria R.', role: 'Employer', location: 'Marlborough', text: 'The pool system means workers are committed before they even arrive. Our no-show rate dropped to almost zero this season.', color: 'bg-rose-500' },
  { initials: 'TW', name: 'Tom W.', role: 'Employer', location: 'Central Otago', text: 'KYSS saved us weeks of recruitment admin. The admin team is responsive and the platform just works. Highly recommend.', color: 'bg-cyan-500' },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-5">
            Real reviews from real users
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">What People Are Saying</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Workers and employers across NZ and AU trust KYSS Vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card rounded-2xl p-7 flex flex-col gap-5 group">
              {/* Quote icon + stars */}
              <div className="flex items-center justify-between">
                <Quote className="w-8 h-8 text-primary/20" />
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
                </div>
              </div>

              {/* Quote text */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <span className="text-xs text-primary/80 bg-primary/10 px-2.5 py-1 rounded-full font-medium">
                  {t.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
