// KYSS Vision — ContactSection CTA (US-023)
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function ContactSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ready to Start Your Next Adventure?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Join thousands of backpackers finding safe, verified seasonal work across New Zealand and Australia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8" asChild>
            <Link to="/auth/sign-up">Get Started Free <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8" asChild>
            <Link to="/how-it-works">Learn How It Works</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-6">Free to join · No credit card required · Working holiday visa friendly</p>
      </div>
    </section>
  )
}
