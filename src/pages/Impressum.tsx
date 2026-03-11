import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle } from "lucide-react";

const Impressum = () => {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-12 py-12">
        <div className="glass-card rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal mb-6">
            {t("Impressum", "Legal Notice")}
          </h1>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-300 mb-2">
                  {t("Hinweis", "Notice")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "Diese Seite benötigt echte Unternehmensdaten.",
                    "This page requires real company data."
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <div>
              <h2 className="text-2xl text-foreground font-serif font-normal mb-4">
                {t("Angaben gemäß § 5 TMG:", "Information according to § 5 TMG:")}
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>[Placeholder: Firmenname / Company name]</p>
                <p>[Placeholder: Straße und Hausnummer / Street and number]</p>
                <p>[Placeholder: PLZ und Ort / Postal code and city]</p>
                <p>[Placeholder: Land / Country]</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-foreground font-serif font-normal mb-3">
                {t("Kontakt:", "Contact:")}
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>E-Mail: info@lynckservices.de</p>
                <p>{t("Telefon:", "Phone:")} +49 30 1234 5678</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-foreground font-serif font-normal mb-3">
                {t("Registereintrag:", "Register entry:")}
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>[Placeholder: Registergericht / Register court]</p>
                <p>[Placeholder: Registernummer / Registration number]</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-foreground font-serif font-normal mb-3">
                {t("Umsatzsteuer-ID:", "VAT number:")}
              </h3>
              <p className="text-muted-foreground">[Placeholder: DE123456789]</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Impressum;
