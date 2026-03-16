// KYSS Vision — Landing Page (US-024)
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import CategoryGrid from '@/components/categories/CategoryGrid'
import FeaturesSection from '@/components/FeaturesSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import TestimonialsSection from '@/components/TestimonialsSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import { Helmet } from 'react-helmet-async'

export default function Index() {
  return (
    <>
      <Helmet>
        <title>KYSS Vision — Find Farm Work in New Zealand & Australia</title>
        <meta name="description" content="Join verified backpackers already matched with seasonal employers across NZ and AU. Safe, fast, and built for working holiday visa holders." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1">
          <HeroSection />
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
