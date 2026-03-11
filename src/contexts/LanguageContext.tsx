import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (de: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'language';
const DEFAULT_LANGUAGE: Language = 'de';

// Helper function to safely get language from localStorage
function getSavedLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    // Validate that the saved value is actually a valid language
    if (saved === 'de' || saved === 'en') {
      return saved;
    }
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn('Failed to read language from localStorage:', error);
    return DEFAULT_LANGUAGE;
  }
}

// Helper function to safely save language to localStorage
function saveLanguage(lang: Language): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.warn('Failed to save language to localStorage:', error);
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage synchronously to prevent flashing
  const [language, setLanguageState] = useState<Language>(() => getSavedLanguage());

  // Handle language change
  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
    // Update HTML lang attribute for SEO and accessibility
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  // Sync language across tabs/windows using storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANGUAGE_KEY && e.newValue) {
        const newLang = e.newValue;
        if (newLang === 'de' || newLang === 'en') {
          setLanguageState(newLang);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Verify localStorage on mount (defensive check for mobile browsers)
  useEffect(() => {
    const savedLang = getSavedLanguage();
    if (savedLang !== language) {
      setLanguageState(savedLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const t = (de: string, en: string) => {
    return language === 'de' ? de : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
