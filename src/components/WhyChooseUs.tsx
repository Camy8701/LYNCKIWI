import { CheckCircle2, DollarSign, Zap } from "lucide-react";

const WhyChooseUs = () => {

  const benefits = [
    {
      icon: CheckCircle2,
      titleDe: "Geprüfte Fachleute",
      titleEn: "Verified Professionals",
      descriptionDe: "Alle Handwerker werden von uns geprüft. Erfahrung, Zertifikate und Versicherung werden kontrolliert.",
      descriptionEn: "All contractors are verified by us. Experience, certificates and insurance are checked."
    },
    {
      icon: DollarSign,
      titleDe: "100% Kostenlos",
      titleEn: "100% Free",
      descriptionDe: "Unser Service ist für Sie völlig kostenlos. Keine versteckten Gebühren, keine Verpflichtungen.",
      descriptionEn: "Our service is completely free for you. No hidden fees, no obligations."
    },
    {
      icon: Zap,
      titleDe: "Schnelle Antworten",
      titleEn: "Fast Responses",
      descriptionDe: "Sie erhalten Angebote, sobald Ihre Anfrage eingegangen ist. Unsere geprüften Fachleute antworten schnell und zuverlässig.",
      descriptionEn: "You receive quotes as soon as your request is received. Our verified professionals respond quickly and reliably."
    }
  ];

  return (
    <section className="mt-24 px-4 sm:px-6 lg:px-12">
      <div className="glass-card rounded-3xl p-8 lg:p-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal">
            {"Why KYSS Vision?"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.titleEn}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
