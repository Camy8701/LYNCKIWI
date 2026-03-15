// US-001: Stub — fully rebuilt in US-019 with KYSS hero content
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Clock } from "lucide-react";

const HeroSection = () => (
  <section className="py-24 px-4 md:px-6 lg:px-8 text-center">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-foreground mb-6">
        Find Farm Work Across New Zealand &amp; Australia
      </h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
        Join verified backpackers already matched with seasonal employers. Safe, fast, and built for travelers.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link to="/auth/sign-up?country=nz" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors">
          🇳🇿 Explore New Zealand <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
        <Link to="/auth/sign-up?country=au" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors">
          🇦🇺 Explore Australia <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Verified Employers</span>
        <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> 100% Free for Workers</span>
        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> 24h Average Match Time</span>
      </div>
    </div>
  </section>
);

export default HeroSection;
