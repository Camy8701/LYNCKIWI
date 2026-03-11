import PageLayout from "@/components/PageLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle } from "lucide-react";

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-12 py-12">
        <div className="glass-card rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal mb-6">
            {t("Datenschutzerklärung", "Privacy Policy")}
          </h1>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-300 mb-2">
                  {t("Rechtlicher Hinweis", "Legal Notice")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "Diese Seite benötigt echte rechtliche Inhalte. Bitte konsultieren Sie einen Rechtsanwalt für eine DSGVO-konforme Datenschutzerklärung.",
                    "This page requires real legal content. Please consult a lawyer for a GDPR-compliant privacy policy."
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {t(
                "[Placeholder: Hier würde Ihre vollständige Datenschutzerklärung stehen, die alle Aspekte der Datenerfassung, -verarbeitung und -speicherung gemäß DSGVO abdeckt.]",
                "[Placeholder: Your complete privacy policy covering all aspects of data collection, processing, and storage in accordance with GDPR would be here.]"
              )}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;
