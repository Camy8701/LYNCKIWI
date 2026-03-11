/**
 * Partner Logo Component
 *
 * Displays partner company logo as a colored circle with initials
 * until real logos are available
 */

import { PartnerCompany } from '@/data/partnerLogos';

interface PartnerLogoProps {
  partner: PartnerCompany;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export default function PartnerLogo({ partner, size = 'md', showName = false }: PartnerLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-xl',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-transform hover:scale-110`}
        style={{ backgroundColor: partner.color }}
        title={partner.name}
      >
        {partner.initials}
      </div>
      {showName && (
        <div className="text-center">
          <p className="text-xs font-medium text-foreground">{partner.name}</p>
          <p className="text-xs text-muted-foreground">
            {partner.city} • {partner.rating}⭐
          </p>
        </div>
      )}
    </div>
  );
}
