import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true);

  // Gestion du chargement des traductions
  useEffect(() => {
    i18n.on('loaded', () => setLoading(false));
    return () => {
      i18n.off('loaded');
    };
  }, [i18n]);

  // Fonction pour changer la langue
  const setLanguage = useCallback((lang: string) => {
    localStorage.setItem('language', lang);
    updateSettings({ language: lang });
    i18n.changeLanguage(lang);
  }, [updateSettings, i18n]);

  // Fonction de traduction avec fallback
  const translate = (key: string, fallback?: string) => {
    const translated = t(key);
    return translated && translated !== key ? translated : fallback || key;
  };

  return (
    <TranslationContext.Provider value={{ 
      t: translate, 
      loading, 
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
