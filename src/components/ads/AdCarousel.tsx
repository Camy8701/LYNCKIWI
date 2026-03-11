import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Ad, trackImpression, trackClick, MAX_SLOTS } from '@/lib/ads';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdCarouselProps {
  ads: Ad[];
}

export default function AdCarousel({ ads }: AdCarouselProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number>(0);

  // Calculate empty slots
  const emptySlots = MAX_SLOTS - ads.length;
  const totalSlots = ads.length + emptySlots;

  // Auto-scroll every 5 seconds (only if there are real ads)
  useEffect(() => {
    if (isPaused || ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, ads.length]);

  // Scroll to current index
  useEffect(() => {
    if (!trackRef.current) return;

    const scrollWidth = 292; // card width (280) + gap (12)
    trackRef.current.scrollTo({
      left: currentIndex * scrollWidth,
      behavior: 'smooth'
    });
  }, [currentIndex]);

  // Track impressions
  useEffect(() => {
    if (ads[currentIndex]) {
      trackImpression(ads[currentIndex].id, 'mobile');
    }
  }, [currentIndex, ads]);

  // Pause on interaction
  const handlePause = useCallback(() => {
    setIsPaused(true);

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    // Resume after 10 seconds of inactivity
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 10000);
  }, []);

  const goToNext = () => {
    const maxIndex = ads.length > 0 ? ads.length - 1 : emptySlots - 1;
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1));
    handlePause();
  };

  const goToPrev = () => {
    const maxIndex = ads.length > 0 ? ads.length : emptySlots;
    setCurrentIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
    handlePause();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  };

  const handleAdClick = (ad: Ad) => {
    trackClick(ad.id, 'mobile');
    window.open(ad.website_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="block lg:hidden w-full bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-sm border-b border-white/5 py-3 px-4 relative"
      onMouseEnter={handlePause}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sponsored Label */}
      <span className="absolute top-1 right-4 text-[10px] text-gray-500 uppercase tracking-wide">
        {t('Gesponsert', 'Sponsored')}
      </span>

      {/* Carousel Wrapper */}
      <div className="relative flex items-center gap-2">
        {/* Left Arrow */}
        <button
          onClick={goToPrev}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 z-10"
          aria-label={t('Vorherige Anzeige', 'Previous ad')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Carousel Track */}
        <div
          ref={trackRef}
          className="flex-1 flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Active Ads */}
          {ads.map((ad) => (
            <button
              key={ad.id}
              onClick={() => handleAdClick(ad)}
              className="flex-shrink-0 w-[280px] h-[90px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-primary/30 rounded-xl p-3 transition-all duration-200 snap-start flex items-center gap-3 text-left"
            >
              {/* Logo */}
              <img
                src={ad.logo_url}
                alt={ad.company_name}
                className="w-[60px] h-[60px] rounded-full object-cover border-2 border-white/10 flex-shrink-0"
              />

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm mb-1 truncate">
                  {ad.company_name}
                </h3>
                <p className="text-gray-400 text-xs mb-1 truncate">
                  {ad.short_description}
                </p>
                <span className="text-primary text-xs font-medium">
                  {t('Mehr erfahren', 'Learn more')} →
                </span>
              </div>
            </button>
          ))}

          {/* Empty Slots - "Your Ad Here" placeholders */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <a
              key={`empty-${index}`}
              href="/advertise"
              className="flex-shrink-0 w-[280px] h-[90px] bg-white/[0.02] hover:bg-white/[0.04] border border-dashed border-white/[0.1] hover:border-primary/30 rounded-xl p-3 transition-all duration-200 snap-start flex items-center gap-3 text-left"
            >
              {/* Placeholder Icon */}
              <div className="w-[60px] h-[60px] rounded-full bg-white/[0.03] border border-dashed border-white/[0.1] flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 text-2xl">+</span>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 font-medium text-sm mb-1">
                  {t('Ihre Werbung hier', 'Your Ad Here')}
                </p>
                <span className="text-primary/70 text-xs font-medium">
                  {t('Jetzt buchen', 'Book now')} →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 z-10"
          aria-label={t('Nächste Anzeige', 'Next ad')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-1.5 mt-2">
        {Array.from({ length: totalSlots }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              handlePause();
            }}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-primary w-4'
                : index < ads.length
                  ? 'bg-white/20 w-1.5 hover:bg-white/40'
                  : 'bg-white/10 w-1.5 hover:bg-white/20'
            }`}
            aria-label={`Go to slot ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
