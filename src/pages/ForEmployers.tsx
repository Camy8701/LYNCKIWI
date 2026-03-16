// KYSS Vision — For Employers (US-051)
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { CheckCircle, Users, DollarSign, Clock, Shield, Star, ArrowRight } from "lucide-react"

const benefits = [
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Pre-qualified workers only",
    description: "Every worker in KYSS has been screened by Manus AI before joining the platform. No cold applications, no wasted interviews.",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-primary" />,
    title: "Simple $1/hr pricing",
    description: "Pay just $1 per worker per hour they are active in your pool. No upfront fees, no contracts, no hidden costs.",
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: "Hire in hours, not weeks",
    description: "Post a pool, set your capacity, and workers join. When your pool is full, your team is ready. That simple.",
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: "Verified visa status",
    description: "KYSS tracks working holiday visa eligibility for NZ and AU. You only see workers who are legally allowed to work in your region.",
  },
  {
    icon: <Star className="w-6 h-6 text-primary" />,
    title: "Rated and reviewed workers",
    description: "Workers build a reputation across pools. You can see ratings and reviews from other employers before they join your team.",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
    title: "Full pool control",
    description: "Post updates, message your team, remove workers, and manage capacity — all from your employer dashboard.",
  },
]

const steps = [
  { step: "01", title: "Create your employer account", description: "Sign up free. No credit card required to get started." },
  { step: "02", title: "Create a work pool", description: "Set your work type, region, dates, pay rate, and max workers. Takes 5 minutes." },
  { step: "03", title: "Workers join your pool", description: "Pre-qualified workers browse open pools and join. Joining = confirmed hire." },
  { step: "04", title: "Manage your team", description: "Post updates, communicate via the pool feed, and track your workforce from your dashboard." },
]

const faqs = [
  { q: "How is KYSS different from a job board?", a: "On a job board, you post a job and hope the right people apply. On KYSS, workers are pre-qualified by Manus AI before they ever see your pool. Joining a pool is a confirmed hire — not an application." },
  { q: "What types of work can I post?", a: "KYSS is built for seasonal and agricultural work in NZ and AU: fruit picking, grape harvesting, dairy, horticulture, shearing, and more. If you need seasonal workers, KYSS is built for you." },
  { q: "How does billing work?", a: "You are charged $1 per worker per hour they are active in your pool. There are no setup fees, no monthly subscriptions, and no lock-in contracts." },
  { q: "Can I remove a worker from my pool?", a: "Yes. You have full control over your pool. You can remove any worker at any time from your pool management dashboard." },
  { q: "Do workers need a visa to join?", a: "KYSS verifies working holiday visa eligibility for NZ and AU. Workers indicate their visa status during onboarding and it is verified by the KYSS admin team." },
]

export default function ForEmployers() {
  return (
    <>
      <Helmet>
        <title>For Employers — Hire Pre-Qualified Farm Workers | KYSS Vision</title>
        <meta name="description" content="Hire pre-qualified seasonal workers in New Zealand and Australia. Simple $1/hr pricing, no contracts, workers join your pool confirmed and ready to work." />
      </Helmet>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">For Farms & Employers</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Stop chasing workers.<br />
              <span className="text-primary">Let them come to you.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              KYSS connects NZ and AU farms with pre-qualified seasonal workers. Post a pool, set your capacity, and workers join confirmed and ready to work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/sign-up" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                Post Your First Pool <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-muted transition-colors">
                How It Works
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">Free to sign up. $1/hr per active worker. No contracts.</p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why farms choose KYSS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div key={b.title} className="bg-card border border-border rounded-xl p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">{b.icon}</div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">How it works for employers</h2>
            <div className="space-y-6">
              {steps.map((s, i) => (
                <div key={s.step} className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-lg font-bold shrink-0">{s.step}</div>
                  <div className="pt-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Transparent pricing</h2>
            <p className="text-muted-foreground mb-8">One simple rule. No surprises.</p>
            <div className="bg-card border border-primary/30 rounded-2xl p-10">
              <p className="text-7xl font-black text-primary mb-2">$1</p>
              <p className="text-xl text-foreground font-semibold mb-4">per worker per hour</p>
              <p className="text-muted-foreground text-sm mb-8">Only charged while workers are active in your pool. Pause or close your pool anytime.</p>
              <div className="grid grid-cols-3 gap-4 text-center border-t border-border pt-6">
                {[
                  { label: "10 workers × 8hr day", value: "$80/day" },
                  { label: "10 workers × 5-day week", value: "$400/wk" },
                  { label: "10 workers × 4-week season", value: "$1,600" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-10">Frequently asked questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-base font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to build your team?</h2>
            <p className="text-muted-foreground mb-8">Create your employer account free. Post your first pool in 5 minutes.</p>
            <Link to="/auth/sign-up" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-colors">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
