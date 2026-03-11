import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Cookie } from "lucide-react";

const CookieConsent = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    // Enable Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
    // Disable Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("Cookie-Einstellungen", "Cookie Settings")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                "Wir verwenden Cookies und ähnliche Technologien, um Ihnen ein besseres Erlebnis zu bieten und die Nutzung unserer Website zu analysieren. Mit 'Akzeptieren' stimmen Sie der Verwendung von Cookies zu.",
                "We use cookies and similar technologies to provide you with a better experience and analyze the use of our website. By clicking 'Accept', you agree to the use of cookies."
              )}
              {" "}
              <a href="/cookies" className="text-primary hover:underline">
                {t("Mehr erfahren", "Learn more")}
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
              >
                {t("Alle akzeptieren", "Accept all")}
              </button>
              <button
                onClick={handleDecline}
                className="px-6 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors font-medium text-sm"
              >
                {t("Nur notwendige", "Only necessary")}
              </button>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="flex-shrink-0 p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label={t("Schließen", "Close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
