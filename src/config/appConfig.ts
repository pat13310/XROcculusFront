// Configuration de l'application

interface AppConfig {
  apiBaseUrl: string;
  apiTimeout?: number;
  apiHeaders?: Record<string, string>;
}

// Charger la configuration en fonction de l'environnement
export function getConfig(): AppConfig {
  const env = process.env.NODE_ENV || 'development';
  
  const configs: Record<string, AppConfig> = {
    development: {
      apiBaseUrl: 'http://localhost:8000/api',
      apiTimeout: 10000,
      apiHeaders: {}
    },
    production: {
      apiBaseUrl: 'https://api.monapplication.com/api',
      apiTimeout: 5000,
      apiHeaders: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    },
    test: {
      apiBaseUrl: 'http://test-api.monapplication.com/api',
      apiTimeout: 15000
    }
  };

  return configs[env] || configs.development;
}
