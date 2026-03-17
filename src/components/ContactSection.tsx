// KYSS Vision — CTA Section (Redesigned — immersive glass card)
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Users, Star } from 'lucide-react'

export default function ContactSection() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div
          className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(212,160,23,0.08) 0%, transparent 50%, rgba(212,160,23,0.05) 100%)',
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
              Ready to Start Your<br />
              <span className="text-primary">Next Adventure?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Join thousands of backpackers finding safe, verified seasonal work across New Zealand and Australia. Free to join, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                to="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-base hover:bg-primary/90 transition-colors animate-pulse-glow"
              >
                Create Your Free Profile <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/for-employers"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-foreground px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/20 transition-colors"
              >
                I'm an Employer
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
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
                <span><strong className="text-foreground">4.9/5</strong> satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
