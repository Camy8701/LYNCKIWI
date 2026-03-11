import { Wrench, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="consultation" className="mt-24 px-4 sm:px-6 lg:px-12 mb-16">
      <div className="glass-card rounded-3xl p-8 lg:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground font-serif font-normal mb-4">
            {t("Bereit für Ihr Projekt?", "Ready for Your Project?")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("Jetzt kostenlos Angebot anfordern", "Request your free quote now")}
          </p>
          <div className="flex justify-center">
            <a
              href="/#services"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
            >
              <Wrench className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
              {t("Angebot anfordern", "Request Quote")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
