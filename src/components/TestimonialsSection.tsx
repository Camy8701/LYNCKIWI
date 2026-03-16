// KYSS Vision — TestimonialsSection (US-021)
import { Star } from 'lucide-react'

const testimonials = [
  { initials: "SL", name: "Sophie L.", role: "Worker · France", text: "I found a grape harvesting job in Marlborough within 2 days of signing up. The pool system is genius — joining really does mean you are hired.", color: "bg-blue-500" },
  { initials: "KT", name: "Kenji T.", role: "Worker · Japan", text: "No more sending CVs into the void. I joined a fruit picking pool in Hawke’s Bay and started the following Monday. Incredible platform.", color: "bg-emerald-500" },
  { initials: "LM", name: "Laura M.", role: "Worker · Germany", text: "The verified employer badge gave me real confidence. I knew exactly what I was getting into — pay rate, location, start date. No surprises.", color: "bg-purple-500" },
  { initials: "JF", name: "James F.", role: "Employer · Bay of Plenty", text: "We filled our entire harvest crew through KYSS in under a week. The workers are pre-vetted and serious. Worth every cent.", color: "bg-amber-500" },
  { initials: "MR", name: "Maria R.", role: "Employer · Marlborough", text: "The pool system means workers are committed before they even arrive. Our no-show rate dropped to almost zero this season.", color: "bg-rose-500" },
  { initials: "TW", name: "Tom W.", role: "Employer · Central Otago", text: "KYSS saved us weeks of recruitment admin. The admin team is responsive and the platform just works.", color: "bg-cyan-500" },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">What People Are Saying</h2>
          <p className="text-muted-foreground text-lg">Workers and employers across NZ and AU trust KYSS Vision.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
