import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2, Mail } from "lucide-react";

const ForBusinesses = () => {
  const { t, language } = useLanguage();

  const benefits = [
    {
      titleDe: "Qualifizierte Leads direkt in Ihr Postfach",
      titleEn: "Qualified leads directly to your inbox"
    },
    {
      titleDe: "Nur für tatsächliche Anfragen zahlen",
      titleEn: "Only pay for actual inquiries"
    },
    {
      titleDe: "Keine monatlichen Fixkosten",
      titleEn: "No monthly fixed costs"
    },
    {
      titleDe: "Einfache Verwaltung über Dashboard",
      titleEn: "Easy management via dashboard"
    }
  ];

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-12 py-12">
        <div className="glass-card rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal mb-6">
            {t("Für Unternehmen", "For Businesses")}
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl text-foreground font-serif font-normal mt-8 mb-4">
              {t("Werden Sie Partner von Lynck Services", "Become a Lynck Services Partner")}
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t(
                "Erreichen Sie mehr Kunden in Ihrer Region. Erhalten Sie qualifizierte Anfragen von Hausbesitzern, die aktiv nach Ihren Dienstleistungen suchen.",
                "Reach more customers in your region. Receive qualified inquiries from homeowners actively looking for your services."
              )}
            </p>

            <h3 className="text-2xl text-foreground font-serif font-normal mt-8 mb-6">
              {t("Ihre Vorteile:", "Your Benefits:")}
            </h3>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground/90">
                    {language === 'de' ? benefit.titleDe : benefit.titleEn}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl">
              <p className="text-lg text-foreground mb-4">
                {t("Interessiert?", "Interested?")}
              </p>
              <a 
                href="mailto:info@lynckservices.de"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="w-5 h-5" />
                info@lynckservices.de
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ForBusinesses;
