import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../contexts/TranslationContext';
import { createLogger } from '../utils/logger';
import { useAuth } from '../hooks/useAuth';
import type { Application } from '../types';

const logger = createLogger('useApps');

interface UserApp {
  status: 'available' | 'installed';
  created_at: string | null;
  updated_at: string | null;
}

export function useApps() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    const getAppDescription = (appName: string): string => {
      const key = `apps.descriptions.${appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const description = t(key, '');
      return description || t('apps.no_description', 'No description available');
    };

    async function loadApps() {
      if (!mounted) return;

      if (!user) {
        setApps([]);
        setLoading(false);
        return;
      }

      try {
        logger.debug('Chargement des applications...');
      
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            applications_users!left (
              status,
              created_at,
              updated_at
            )
          `)
          .eq('applications_users.user_id', user.id);

        if (!mounted) return;

        if (error) {
          logger.error('Erreur lors de la récupération des applications:', error);
          setApps([]);
          return;
        }

        if (!data) {
          setApps([]);
          return;
        }

        // Transformer les données
        const transformedApps: Application[] = data.map(app => {
          const userApp: UserApp | undefined = app.applications_users?.[0];
          return {
            id: app.id,
            name: app.name,
            description: app.description || getAppDescription(app.name),
            url: app.url || '',
            category: app.category || 'default',
            developer: app.developer || t('apps.unknown_developer', 'Développeur inconnu'),
            version: app.version,
            size: app.size,
            status: userApp?.status || 'available',
            installed: userApp?.status === 'installed',
            createdAt: userApp?.created_at || null,
            updatedAt: userApp?.updated_at || null
          };
        });

        if (!mounted) return;
        setApps(transformedApps);
      } catch (error) {
        if (!mounted) return;
        logger.error('Error loading apps:', error);
        setApps([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    loadApps();

    return () => {
      mounted = false;
    };
  }, [user, t]);

  const refresh = () => {
    setLoading(true);
  };

  return { apps, loading, refresh };
}