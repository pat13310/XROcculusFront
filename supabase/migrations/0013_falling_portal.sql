/*
  # Add application page translations

  1. New Translations
    - Add translations for the applications page in all supported languages
    - Include translations for filters, buttons, and status messages
*/

DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "apps.title", "value": "Applications"},
    {"lang": "en", "key": "apps.loading", "value": "Loading applications..."},
    {"lang": "en", "key": "apps.filters.all", "value": "All Apps"},
    {"lang": "en", "key": "apps.filters.installed", "value": "Installed"},
    {"lang": "en", "key": "apps.filters.available", "value": "Available"},
    {"lang": "en", "key": "apps.install", "value": "Install"},
    {"lang": "en", "key": "apps.uninstall", "value": "Uninstall"},
    {"lang": "en", "key": "apps.installing", "value": "Installing..."},
    
    {"lang": "fr", "key": "apps.title", "value": "Applications"},
    {"lang": "fr", "key": "apps.loading", "value": "Chargement des applications..."},
    {"lang": "fr", "key": "apps.filters.all", "value": "Toutes les apps"},
    {"lang": "fr", "key": "apps.filters.installed", "value": "Installées"},
    {"lang": "fr", "key": "apps.filters.available", "value": "Disponibles"},
    {"lang": "fr", "key": "apps.install", "value": "Installer"},
    {"lang": "fr", "key": "apps.uninstall", "value": "Désinstaller"},
    {"lang": "fr", "key": "apps.installing", "value": "Installation..."},
    
    {"lang": "es", "key": "apps.title", "value": "Aplicaciones"},
    {"lang": "es", "key": "apps.loading", "value": "Cargando aplicaciones..."},
    {"lang": "es", "key": "apps.filters.all", "value": "Todas las apps"},
    {"lang": "es", "key": "apps.filters.installed", "value": "Instaladas"},
    {"lang": "es", "key": "apps.filters.available", "value": "Disponibles"},
    {"lang": "es", "key": "apps.install", "value": "Instalar"},
    {"lang": "es", "key": "apps.uninstall", "value": "Desinstalar"},
    {"lang": "es", "key": "apps.installing", "value": "Instalando..."},
    
    {"lang": "de", "key": "apps.title", "value": "Anwendungen"},
    {"lang": "de", "key": "apps.loading", "value": "Lade Anwendungen..."},
    {"lang": "de", "key": "apps.filters.all", "value": "Alle Apps"},
    {"lang": "de", "key": "apps.filters.installed", "value": "Installiert"},
    {"lang": "de", "key": "apps.filters.available", "value": "Verfügbar"},
    {"lang": "de", "key": "apps.install", "value": "Installieren"},
    {"lang": "de", "key": "apps.uninstall", "value": "Deinstallieren"},
    {"lang": "de", "key": "apps.installing", "value": "Installiere..."}
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      'apps',
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;