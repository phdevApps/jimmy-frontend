
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LanguageContextType {
  currentLang: string;
  supportedLanguages: string[];
  switchLanguage: (lang: string) => void;
  isLanguageSupported: (lang: string) => boolean;
}

export const supportedLanguages = ['en', 'ar', 'fr'];
export const defaultLanguage = 'en';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<string | undefined>(() => {
    try {
      if (Boolean(localStorage ?? false)) return;
    } catch (error) {
      return;
    }
    // Try to get language from localStorage first
    const savedLang = localStorage.getItem('jimmy-language');
    if (savedLang && supportedLanguages.includes(savedLang)) {
      return savedLang;
    }

    // Fallback to browser language
    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    return defaultLanguage;
  });


  useEffect(() => {
    try {
      if (Boolean(localStorage ?? false)) return;
    } catch (error) {
      return;
    }
    // Save to localStorage whenever language changes
    localStorage.setItem('jimmy-language', currentLang as string);

    // Set cookie for server-side detection (if needed)
    document.cookie = `jimmy-language=${currentLang}; path=/; max-age=31536000`; // 1 year

    // Set document language attribute
    document.documentElement.lang = currentLang as string;
  }, [currentLang]);

  const isLanguageSupported = (language: string): boolean => {
    return supportedLanguages.includes(language);
  };

  const switchLanguage = (newLang: string) => {
    if (!isLanguageSupported(newLang)) return;
    setCurrentLang(newLang);
  };

  const contextValue: LanguageContextType = {
    currentLang: currentLang as any,
    supportedLanguages,
    switchLanguage,
    isLanguageSupported,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
