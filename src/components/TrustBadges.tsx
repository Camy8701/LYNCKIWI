import { Check } from "lucide-react";

const TrustBadges = () => {

  const badges = [
    {
      textDe: "Geprüfte Fachleute in Ihrer Nähe",
      textEn: "Verified Professionals In Your Area"
    },
    {
      textDe: "Kostenlos & unverbindlich",
      textEn: "Free & non-binding"
    },
    {
      textDe: "Direkte Kontaktaufnahme",
      textEn: "Direct professional contact"
    },
    {
      textDe: "Schnelle Rückmeldung",
      textEn: "Fast response"
    }
  ];

  return (
    <div className="mx-4 md:mx-6 lg:mx-8 mb-12">
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              {badge.textEn}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;
