import { Shield, Lock, Star, Users } from "lucide-react";

const SecurityBadges = () => {

  const badges = [
    {
      icon: Shield,
      textDe: "SSL Verschlüsselt",
      textEn: "SSL Encrypted"
    },
    {
      icon: Lock,
      textDe: "DSGVO Konform",
      textEn: "GDPR Compliant"
    },
    {
      icon: Star,
      textDe: "4.8★ Bewertung",
      textEn: "4.8★ Rating"
    },
    {
      icon: Users,
      textDe: "Geprüfte Fachleute in Ihrer Nähe",
      textEn: "Verified Professionals In Your Area"
    }
  ];

  return (
    <div className="mx-4 md:mx-6 lg:mx-8 mb-12 mt-8">
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-2">
            <badge.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              {t(badge.textDe, badge.textEn)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;
