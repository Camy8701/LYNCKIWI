import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

interface BlogCTAProps {
  position?: 'top' | 'middle' | 'bottom';
  service?: string; // Service slug
  serviceName?: string; // Service name for display
  blogSlug?: string; // For tracking which blog the CTA was clicked from
}

export const BlogCTA = ({ position = 'bottom', service, serviceName, blogSlug }: BlogCTAProps) => {
  const { t, language } = useLanguage();

  const handleClick = () => {
    // GTM Event Tracking
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'blog_cta_click',
        cta_position: position,
        target_service: service || 'general',
        blog_slug: blogSlug,
        service_name: serviceName
      });
    }
  };

  // Top CTA - Short and attention-grabbing
  if (position === 'top') {
    return (
      <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-lg mb-8">
        <p className="text-sm text-foreground">
          {t("Suchen Sie einen geprüften Fachmann?", "Looking for a verified professional?")}
          {" "}
          <Link
            to={service ? `/services/${service}` : "/contact"}
            onClick={handleClick}
            className="text-primary font-semibold hover:text-primary/80 inline-flex items-center gap-1"
          >
            {t("Kostenloses Angebot anfordern", "Request free quote")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </p>
      </div>
    );
  }

  // Middle CTA - Problem-solution focused
  if (position === 'middle') {
    return (
      <div className="my-12 bg-card border border-border rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {serviceName
            ? t(`Benötigen Sie Hilfe bei ${serviceName}?`, `Need help with ${serviceName}?`)
            : t("Benötigen Sie professionelle Hilfe?", "Need professional help?")}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t(
            "Unsere geprüften Fachleute beraten Sie kostenlos und unverbindlich. Kontaktaufnahme innerhalb von 24 Stunden garantiert.",
            "Our verified professionals advise you free of charge and without obligation. Contact within 24 hours guaranteed."
          )}
        </p>
        <Link
          to={service ? `/services/${service}` : "/contact"}
          onClick={handleClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          {t("Jetzt Kontakt aufnehmen", "Get in touch now")}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  // Bottom CTA - Comprehensive with benefits
  return (
    <div className="my-12 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
      <div className="max-w-2xl">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          {serviceName
            ? t(`Bereit für Ihr ${serviceName}-Projekt?`, `Ready for your ${serviceName} project?`)
            : t("Bereit für Ihr Projekt?", "Ready for your project?")}
        </h3>
        <p className="text-foreground/80 mb-6">
          {t(
            "Verbinden Sie sich mit geprüften Fachbetrieben in Ihrer Nähe. Kostenlose Erstberatung und transparente Angebote.",
            "Connect with verified professionals in your area. Free initial consultation and transparent quotes."
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {t("100% Kostenlos", "100% Free")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("Keine versteckten Kosten", "No hidden costs")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {t("Geprüfte Fachleute", "Verified Professionals")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("Alle Handwerker sind zertifiziert", "All contractors are certified")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {t("Schnelle Antwort", "Fast Response")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("Kontakt innerhalb von 24h", "Contact within 24h")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {t("Lokale Anbieter", "Local Providers")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("In Ihrer Region verfügbar", "Available in your region")}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={service ? `/services/${service}` : "/contact"}
          onClick={handleClick}
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-semibold text-lg hover:gap-3"
        >
          {t("Kostenloses Angebot anfordern", "Request free quote")}
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};
