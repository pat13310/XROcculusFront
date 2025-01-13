import React, { createContext, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../hooks/useSettings';

interface TranslationContextType {
  t: (key: string, fallback?: string) => string;
  loading: boolean;
  setLanguage: (lang: string) => void;
  currentLanguage: string;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key: string, fallback?: string) => fallback || key,
  loading: false,
  setLanguage: () => {},
  currentLanguage: 'fr'
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useSettings();
  const { t, i18n } = useTranslation();

  const setLanguage = useCallback((lang: string) => {
    updateSettings({ language: lang });
    i18n.changeLanguage(lang);
  }, [updateSettings, i18n]);

  return (
    <TranslationContext.Provider value={{ 
      t, 
      loading: false, 
      setLanguage,
      currentLanguage: settings.language 
    }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useCustomTranslation() {
  return useContext(TranslationContext);
}

export { useTranslation };
