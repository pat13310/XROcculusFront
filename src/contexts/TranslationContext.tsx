import React, { createContext, useContext, useCallback } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useSettings } from '../hooks/useSettings';

interface TranslationContextType {
  t: (key: string, fallback?: string) => string;
  loading: boolean;
  setLanguage: (lang: string) => void;
  currentLanguage: string;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key: string, fallback?: string) => fallback || key,
  loading: true,
  setLanguage: () => {},
  currentLanguage: 'en'
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useSettings();
  const { t, loading, refreshTranslations } = useTranslations(settings.language);

  const setLanguage = useCallback((lang: string) => {
    updateSettings({ language: lang });
    refreshTranslations(lang);
  }, [updateSettings, refreshTranslations]);

  return (
    <TranslationContext.Provider value={{ 
      t, 
      loading, 
      setLanguage,
      currentLanguage: settings.language 
    }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}