// US-001: Stub — fully rebuilt in US-020 with KYSS content
import { CheckCircle, Shield, Zap } from "lucide-react";

const features = [
  { icon: CheckCircle, title: "Verified Employers", description: "Every employer is vetted. Read real worker reviews before you join." },
  { icon: Shield, title: "Built for Safety", description: "Emergency contacts, visa verification, and report system built in." },
  { icon: Zap, title: "Instant Matching", description: "Complete your profile, get matched to relevant work pools immediately." },
];

const FeaturesSection = () => (
  <section className="py-20 px-4 md:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif font-normal text-foreground">Why KYSS?</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="text-center p-6 rounded-2xl bg-card border border-border">
              <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
