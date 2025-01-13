/*
  # Add Dashboard Page Translations

  1. New Translations
    - Add translations for dashboard page content in all supported languages
  2. Categories
    - Add dashboard category if it doesn't exist
  3. Security
    - Inherits existing RLS policies
*/

-- Ensure the dashboard category exists
INSERT INTO translation_categories (id, name, description)
VALUES ('dashboard', 'Dashboard', 'Translations for the dashboard page')
ON CONFLICT (id) DO NOTHING;

-- Safely insert translations using DO block
DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "dashboard.title", "value": "Dashboard"},
    {"lang": "en", "key": "dashboard.total_devices", "value": "Total Devices"},
    {"lang": "en", "key": "dashboard.active_devices", "value": "Active Devices"},
    {"lang": "en", "key": "dashboard.storage_used", "value": "Total Storage Used"},
    {"lang": "en", "key": "dashboard.avg_battery", "value": "Average Battery Level"},
    {"lang": "en", "key": "dashboard.devices_title", "value": "Devices"},
    {"lang": "en", "key": "dashboard.loading", "value": "Loading devices..."},
    
    {"lang": "fr", "key": "dashboard.title", "value": "Tableau de bord"},
    {"lang": "fr", "key": "dashboard.total_devices", "value": "Appareils totaux"},
    {"lang": "fr", "key": "dashboard.active_devices", "value": "Appareils actifs"},
    {"lang": "fr", "key": "dashboard.storage_used", "value": "Stockage total utilisé"},
    {"lang": "fr", "key": "dashboard.avg_battery", "value": "Niveau de batterie moyen"},
    {"lang": "fr", "key": "dashboard.devices_title", "value": "Appareils"},
    {"lang": "fr", "key": "dashboard.loading", "value": "Chargement des appareils..."},
    
    {"lang": "es", "key": "dashboard.title", "value": "Panel"},
    {"lang": "es", "key": "dashboard.total_devices", "value": "Dispositivos totales"},
    {"lang": "es", "key": "dashboard.active_devices", "value": "Dispositivos activos"},
    {"lang": "es", "key": "dashboard.storage_used", "value": "Almacenamiento total usado"},
    {"lang": "es", "key": "dashboard.avg_battery", "value": "Nivel de batería promedio"},
    {"lang": "es", "key": "dashboard.devices_title", "value": "Dispositivos"},
    {"lang": "es", "key": "dashboard.loading", "value": "Cargando dispositivos..."},
    
    {"lang": "de", "key": "dashboard.title", "value": "Dashboard"},
    {"lang": "de", "key": "dashboard.total_devices", "value": "Gesamtanzahl Geräte"},
    {"lang": "de", "key": "dashboard.active_devices", "value": "Aktive Geräte"},
    {"lang": "de", "key": "dashboard.storage_used", "value": "Gesamtspeichernutzung"},
    {"lang": "de", "key": "dashboard.avg_battery", "value": "Durchschnittlicher Batteriestand"},
    {"lang": "de", "key": "dashboard.devices_title", "value": "Geräte"},
    {"lang": "de", "key": "dashboard.loading", "value": "Lade Geräte..."}
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      'dashboard',
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;