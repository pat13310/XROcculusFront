import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../contexts/TranslationContext';
import { createLogger } from '../utils/logger';
import type { Application } from '../types';

const logger = createLogger('useApps');

export function useApps() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const getAppDescription = (appName: string): string => {
    const key = `apps.descriptions.${appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const description = t(key, '');
    return description || t('apps.no_description', 'No description available');
  };

  const loadApps = useCallback(async () => {
    try {
      logger.debug('Loading apps');
      
      // First get all available apps
      const { data: availableApps, error: appsError } = await supabase
        .from('available_apps')
        .select('*');

      if (appsError) throw appsError;

      // Then get installation status for all apps
      const { data: deviceApps, error: statusError } = await supabase
        .from('device_apps')
        .select('app_id, status');

      if (statusError) throw statusError;

      // Create a map of app_id to status
      const statusMap = deviceApps?.reduce((acc, curr) => {
        acc[curr.app_id] = curr.status;
        return acc;
      }, {} as Record<string, string>);

      const formattedApps: Application[] = availableApps.map(app => ({
        id: app.id,
        name: app.name,
        developer: app.developer,
        size: app.size,
        version: app.version,
        thumbnail: app.thumbnail || '',
        description: getAppDescription(app.name),
        category: app.category || 'other',
        rating: app.rating || 0,
        installed: statusMap?.[app.id] === 'installed',
        installing: statusMap?.[app.id] === 'installing'
      }));

      logger.debug('Apps loaded successfully', { count: formattedApps.length });
      setApps(formattedApps);
    } catch (error) {
      logger.error('Error loading apps:', error);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadApps();

    const appsSubscription = supabase
      .channel('apps-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'device_apps' }, loadApps)
      .subscribe();

    return () => {
      appsSubscription.unsubscribe();
    };
  }, [loadApps]);

  return { apps, loading };
}