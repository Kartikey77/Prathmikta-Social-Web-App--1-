// Stub for removed language system - English only now
import { createContext, useContext, ReactNode, useState } from 'react';

type SupportedLanguage = 'en' | 'hi';

interface LanguageContextType {
  language: SupportedLanguage;
  t: (key: string) => string;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, _setLanguage] = useState<SupportedLanguage>('en');
  const value: LanguageContextType = {
    language,
    t: (key: string) => {
      // Return the key as fallback for any remaining t() calls
      console.warn(`Translation key "${key}" used but language system was removed. Consider replacing with hardcoded English text.`);
      return key.split('.').pop() || key;
    },
    setLanguage: async (lang: SupportedLanguage) => {
      _setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}