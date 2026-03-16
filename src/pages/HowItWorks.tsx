// KYSS Vision — How It Works (US-052)
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { ArrowRight, Users, Briefcase, Bot } from "lucide-react"

const workerSteps = [
  { step: "01", title: "Create your account", description: "Sign up as a worker. Choose New Zealand, Australia, or both as your target markets." },
  { step: "02", title: "Complete your profile", description: "Tell us your nationality, visa type, work experience, and availability. This is what employers see." },
  { step: "03", title: "Browse work pools", description: "Explore open pools by work type and region. Each pool shows the employer, pay rate, capacity, and start dates." },
  { step: "04", title: "Join a pool", description: "Click Join. That is it. Joining a pool is a confirmed hire — not an application. You are on the team." },
  { step: "05", title: "Stay connected", description: "Receive pool updates via the feed, message your employer, and get notified about new opportunities that match your profile." },
]

const employerSteps = [
  { step: "01", title: "Create your employer account", description: "Sign up free. No credit card required. Your account is reviewed and verified by the KYSS team." },
  { step: "02", title: "Create a work pool", description: "Set your work type (fruit picking, dairy, etc.), region, pay rate, start and end dates, and maximum worker capacity." },
  { step: "03", title: "Workers join your pool", description: "Pre-qualified workers browse open pools and join. You are notified each time someone joins. When the pool is full, hiring is done." },
  { step: "04", title: "Manage your team", description: "Post updates to your pool feed, communicate with workers, remove anyone who is not a fit, and track your workforce from your dashboard." },
  { step: "05", title: "Pay as you go", description: "You are charged $1 per worker per hour they are active in your pool. No contracts, no lock-in, no hidden fees." },
]

const aiSteps = [
  { step: "01", title: "Manus AI identifies prospects", description: "The Manus AI agent actively scouts backpacker groups, travel forums, and social platforms to find workers who are looking for seasonal work in NZ and AU." },
  { step: "02", title: "Prospects are qualified off-platform", description: "Manus AI engages with prospects, checks visa eligibility, work experience, and availability before they ever touch the KYSS platform." },
  { step: "03", title: "Qualified workers are invited to KYSS", description: "Only prospects who pass the qualification process receive an invitation to create a KYSS account. This keeps the worker pool quality high." },
  { step: "04", title: "Workers are tracked in the admin pipeline", description: "Admins can see every prospect in the Manus AI pipeline — from identified to contacted to qualified to converted — in the Admin Prospects dashboard." },
]

export default function HowItWorks() {
  return (
    <>
      <Helmet>
        <title>How It Works — KYSS Vision</title>
        <meta name="description" content="Learn how KYSS Vision connects pre-qualified seasonal workers with farms in New Zealand and Australia. Simple pool-based hiring, $1/hr pricing." />
      </Helmet>
      <Navigation />
      <main>
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">How KYSS Works</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">The pool model explained</h1>
            <p className="text-xl text-muted-foreground">
              KYSS is not a job board. It is a workforce placement platform built around the pool model — where joining a pool means you are hired, not just applied.
            </p>
          </div>
        </section>

        {/* Worker flow */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
              <h2 className="text-2xl font-bold text-foreground">For Workers</h2>
            </div>
            <div className="space-y-6">
              {workerSteps.map((s) => (
                <div key={s.step} className="flex gap-6 items-start bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-bold shrink-0">{s.step}</div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/auth/sign-up" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                Sign Up as a Worker <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Employer flow */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center"><Briefcase className="w-5 h-5 text-blue-400" /></div>
              <h2 className="text-2xl font-bold text-foreground">For Employers</h2>
            </div>
            <div className="space-y-6">
              {employerSteps.map((s) => (
                <div key={s.step} className="flex gap-6 items-start bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">{s.step}</div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/for-employers" className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                Learn More for Employers <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Manus AI flow */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-purple-400/10 rounded-xl flex items-center justify-center"><Bot className="w-5 h-5 text-purple-400" /></div>
              <h2 className="text-2xl font-bold text-foreground">The Manus AI Pipeline</h2>
            </div>
            <p className="text-muted-foreground mb-8 text-sm">
              What makes KYSS different is that workers are not self-selected from a job board. They are identified and pre-qualified by Manus AI before they ever join the platform. Here is how that pipeline works.
            </p>
            <div className="space-y-6">
              {aiSteps.map((s) => (
                <div key={s.step} className="flex gap-6 items-start bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 bg-purple-400 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">{s.step}</div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-muted/20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">Join KYSS as a worker or employer today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/sign-up" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                Sign Up Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/find-work" className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-muted transition-colors">
                Browse Work Pools
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
