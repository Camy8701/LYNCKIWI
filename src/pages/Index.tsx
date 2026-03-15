// US-001: Removed deleted imports (AdSidebar, AdCarousel, ads lib, PortfolioGrid)
// US-024 will fully rebuild this page with KYSS sections
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SecurityBadges from "@/components/SecurityBadges";
import TrustBadges from "@/components/TrustBadges";
import FeaturesSection from "@/components/FeaturesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { SEO } from "@/lib/seo";

const Index = () => {
  return (
    <>
      <SEO
        title="KYSS Vision — Find Farm Work in New Zealand & Australia"
        description="Join verified backpackers already matched with seasonal employers. Safe, fast, and built for travelers."
        canonicalUrl="/"
        ogType="website"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <HeroSection />
        <SecurityBadges />
        <TrustBadges />
        <FeaturesSection />
        <WhyChooseUs />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
