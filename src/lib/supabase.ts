import { createClient } from '@supabase/supabase-js';
import { createLogger } from '../utils/logger';
import type { Database } from '../types/supabase';

const logger = createLogger('Supabase');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Variables d\'environnement Supabase manquantes');
  throw new Error('Configuration Supabase incomplète');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'vr-device-manager'
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// Intercepteur pour une meilleure gestion des erreurs
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    if (!response.ok) {
      if (response.status === 401) {
        logger.warn('Session expirée ou non authentifiée');
      } else if (response.status >= 500) {
        logger.error('Erreur serveur', {
          status: response.status,
          url: args[0],
          method: args[1]?.method
        });
      }
    }
    return response;
  } catch (error) {
    logger.error('Erreur réseau', { error, url: args[0] });
    throw error;
  }
};

// Vérifier la connexion
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('system_logs').select('count').limit(1);
    if (error) throw error;
    logger.info('Connexion Supabase établie avec succès');
    return true;
  } catch (error) {
    logger.error('Échec de la connexion Supabase:', error);
    return false;
  }
}

// Initialiser la connexion au démarrage
checkSupabaseConnection().catch(() => {
  logger.warn('Impossible de vérifier la connexion Supabase');
});