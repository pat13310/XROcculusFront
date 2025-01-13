import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { createLogger } from '../utils/logger';

const logger = createLogger('useTranslations');

interface Translation {
  key: string;
  value: string;
}

// Fallback translations for critical UI elements
const FALLBACK_TRANSLATIONS: Record<string, string> = {
  'dashboard.title': 'Dashboard',
  'devices.title': 'Devices',
  'apps.title': 'Applications',
  'settings.title': 'Settings',
  'users.title': 'Users',
  'analytics.title': 'Analytics',
  'reports.title': 'Reports'
};

export function useTranslations(language: string) {
  const [translations, setTranslations] = useState<Record<string, string>>(FALLBACK_TRANSLATIONS);
  const [loading, setLoading] = useState(true);

  const loadTranslations = useCallback(async (lang: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('translations')
        .select('key, value')
        .eq('language_id', lang);

      if (error) {
        logger.warn('Failed to load translations, using fallbacks', { error });
        return;
      }

      const translationMap = (data as Translation[]).reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      setTranslations({ ...FALLBACK_TRANSLATIONS, ...translationMap });
    } catch (error) {
      logger.error('Error loading translations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
  }, [language, loadTranslations]);

  const t = useCallback((key: string, fallback: string = key) => {
    return translations[key] || fallback;
  }, [translations]);

  const refreshTranslations = useCallback((lang: string) => {
    loadTranslations(lang);
  }, [loadTranslations]);

  return { t, loading, refreshTranslations };
}