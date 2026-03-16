// KYSS Vision — HeroSection (US-019)
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-24">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
          <Shield className="w-3.5 h-3.5" />
          Verified employers only — no scams, no surprises
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
          Find Farm Work Across<br />
          <span className="text-primary">New Zealand & Australia</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Join verified backpackers already matched with seasonal employers. Safe, fast, and built for working holiday visa holders.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8" asChild>
            <Link to="/auth/sign-up">Find Work Now <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8" asChild>
            <Link to="/for-employers">I am an Employer</Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">2,400+</strong> workers placed</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">100%</strong> verified employers</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span><strong className="text-foreground">4.9/5</strong> worker satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  )
}
