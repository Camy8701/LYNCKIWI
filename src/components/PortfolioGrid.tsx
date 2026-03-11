import { useLanguage } from "@/contexts/LanguageContext";
import { ClipboardCheck, FileText, MessageSquare, CheckCircle2 } from "lucide-react";

const howItWorksSteps = [
  {
    number: "1",
    icon: ClipboardCheck,
    titleDe: "Service wählen",
    titleEn: "Choose Service",
    descriptionDe: "Wählen Sie aus 9 Dienstleistungen: Heizung, Solar, Dachdecker, Klempner, Elektriker, Wärmepumpe, Klimatechnik, Service & Beratung oder allgemeine Renovierung.",
    descriptionEn: "Choose from 9 services: Heating, Solar, Roofing, Plumbing, Electrician, Heat Pump, Air Conditioning, Service & Consultation or general renovation."
  },
  {
    number: "2",
    icon: FileText,
    titleDe: "Formular ausfüllen",
    titleEn: "Fill Out Form",
    descriptionDe: "Beschreiben Sie Ihr Projekt in 2 Minuten. Name, Stadt, Details und gewünschter Zeitrahmen.",
    descriptionEn: "Describe your project in 2 minutes. Name, city, details and desired timeframe."
  },
  {
    number: "3",
    icon: MessageSquare,
    titleDe: "Kontaktaufnahme",
    titleEn: "Receive Contact",
    descriptionDe: "Geprüfte Fachleute werden Sie kontaktieren, sobald sie Ihre Anfrage erhalten.",
    descriptionEn: "Verified professionals will contact you as soon as they receive your request."
  },
  {
    number: "4",
    icon: CheckCircle2,
    titleDe: "Projekt beauftragen",
    titleEn: "Hire & Start",
    descriptionDe: "Besprechen Sie die Details mit dem Fachmann und beauftragen Sie Ihr Projekt.",
    descriptionEn: "Discuss the details with the professional and start your project."
  }
];

const PortfolioGrid = () => {
  const { t, language } = useLanguage();
  
  return (
    <section id="how-it-works" className="mt-8 px-4 sm:px-6 lg:px-12 pt-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground font-serif font-normal">
          {t("So einfach geht's", "How It Works")}
        </h2>
        <p className="text-lg text-muted-foreground mt-6">
          {t(
            "In 4 einfachen Schritten zum perfekten Handwerker",
            "4 simple steps to the perfect contractor"
          )}
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {howItWorksSteps.map((step, index) => (
        <article
          key={index}
          className="group glass-card rounded-xl overflow-hidden hover:border-white/[0.12] transition-all duration-500 min-h-[420px] flex flex-col"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center h-56">
            <step.icon className="w-24 h-24 text-primary/40" />
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
              {step.number}
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
              {language === 'de' ? step.titleDe : step.titleEn}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {language === 'de' ? step.descriptionDe : step.descriptionEn}
            </p>
          </div>
        </article>
      ))}
      </div>
    </section>
  );
};

export default PortfolioGrid;
