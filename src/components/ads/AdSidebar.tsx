import { useEffect, useRef } from 'react';
import { type Ad, trackImpression, trackClick, MAX_SLOTS } from '@/lib/ads';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdSidebarProps {
  ads: Ad[];
}

export default function AdSidebar({ ads }: AdSidebarProps) {
  const { t } = useLanguage();
  const impressionTrackedRef = useRef<Set<string>>(new Set());

  // Track impressions for visible ads
  useEffect(() => {
    ads.forEach((ad) => {
      if (!impressionTrackedRef.current.has(ad.id)) {
        trackImpression(ad.id, 'desktop');
        impressionTrackedRef.current.add(ad.id);
      }
    });
  }, [ads]);

  const handleAdClick = (ad: Ad) => {
    trackClick(ad.id, 'desktop');
    window.open(ad.website_url, '_blank', 'noopener,noreferrer');
  };

  // Calculate empty slots
  const emptySlots = MAX_SLOTS - ads.length;

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 w-[280px] h-screen bg-background/95 backdrop-blur-md border-r border-border z-40 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          {t('Gesponsert', 'Sponsored')}
        </p>
      </div>

      {/* Ad Cards Container */}
      <div
        className="flex flex-col gap-3 overflow-y-auto flex-1 p-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(16, 185, 129, 0.3) transparent',
        }}
      >
        {/* Active Ads */}
        {ads.map((ad) => (
          <button
            key={ad.id}
            onClick={() => handleAdClick(ad)}
            className="group relative bg-muted/30 dark:bg-white/[0.03] hover:bg-muted/50 dark:hover:bg-white/[0.06] border border-border hover:border-primary/30 rounded-xl p-4 text-left transition-all duration-300 cursor-pointer"
          >
            {/* Logo */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-muted/50 dark:bg-white/5 border border-border flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-colors">
                <img
                  src={ad.logo_url}
                  alt={ad.company_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Company Name */}
            <h3 className="text-sm font-semibold text-foreground text-center mb-1 group-hover:text-primary transition-colors">
              {ad.company_name}
            </h3>

            {/* Description */}
            {ad.short_description && (
              <p className="text-xs text-muted-foreground text-center line-clamp-2">
                {ad.short_description}
              </p>
            )}

            {/* Hover indicator */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-primary/0 group-hover:ring-primary/20 transition-all pointer-events-none" />
          </button>
        ))}

        {/* Empty Slots - "Your Ad Here" placeholders */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <a
            key={`empty-${index}`}
            href="/advertise"
            className="group relative bg-muted/20 dark:bg-white/[0.02] hover:bg-muted/40 dark:hover:bg-white/[0.04] border border-dashed border-border hover:border-primary/30 rounded-xl p-4 text-center transition-all duration-300 cursor-pointer"
          >
            {/* Placeholder Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-muted/30 dark:bg-white/[0.03] border border-dashed border-border flex items-center justify-center group-hover:border-primary/20 transition-colors">
                <span className="text-muted-foreground text-lg group-hover:text-primary/50 transition-colors">+</span>
              </div>
            </div>

            {/* Placeholder Text */}
            <p className="text-sm font-medium text-muted-foreground group-hover:text-primary/70 transition-colors">
              {t('Ihre Werbung hier', 'Your Ad Here')}
            </p>

            {/* Hover indicator */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-primary/0 group-hover:ring-primary/10 transition-all pointer-events-none" />
          </a>
        ))}
      </div>

      {/* Footer with slot count */}
      <div className="p-3 border-t border-border text-center">
        <p className="text-[10px] text-muted-foreground">
          {ads.length}/{MAX_SLOTS} {t('Slots belegt', 'slots filled')}
        </p>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        aside::-webkit-scrollbar {
          width: 4px;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        aside::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 4px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </aside>
  );
}
