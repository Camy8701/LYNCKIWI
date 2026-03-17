// KYSS Vision — Landing Page (Social platform style)
// Non-logged-in: Hero + Sign-in form (Facebook-style)
// Logged-in: Redirects to worker/employer/admin dashboard
import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import SecurityBadges from '@/components/SecurityBadges'
import CategoryGrid from '@/components/categories/CategoryGrid'
import FeaturesSection from '@/components/FeaturesSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import TestimonialsSection from '@/components/TestimonialsSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import { Helmet } from 'react-helmet-async'

export default function Index() {
  const { isAuthenticated, role, isLoading } = useAuth()

  // If logged in, redirect to appropriate dashboard
  if (!isLoading && isAuthenticated) {
    if (role === 'admin') return <Navigate to="/admin" replace />
    if (role === 'employer') return <Navigate to="/employer/dashboard" replace />
    return <Navigate to="/worker/dashboard" replace />
  }

  return (
    <>
      <Helmet>
        <title>KYSS Vision — Find Farm Work in New Zealand & Australia</title>
        <meta name="description" content="Join verified backpackers already matched with seasonal employers across NZ and AU. Safe, fast, and built for working holiday visa holders." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 pt-4">
          <HeroSection />
          <SecurityBadges />
          <CategoryGrid />
          <FeaturesSection />
          <WhyChooseUs />
          <TestimonialsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
