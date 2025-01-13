/*
  # Add missing device translations
  
  1. New Translations
    - Device section title
    - Device status messages
    - Device information labels
*/

-- First ensure the devices category exists
INSERT INTO translation_categories (id, name, description)
VALUES ('devices', 'Devices', 'Translations for device management')
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "devices.title", "value": "Devices"},
    {"lang": "fr", "key": "devices.title", "value": "Appareils"},
    {"lang": "es", "key": "devices.title", "value": "Dispositivos"},
    {"lang": "de", "key": "devices.title", "value": "Geräte"},

    {"lang": "fr", "key": "devices.status.online", "value": "En ligne"},
    {"lang": "fr", "key": "devices.status.offline", "value": "Hors ligne"},
    {"lang": "fr", "key": "devices.battery_level", "value": "Niveau de batterie"},
    {"lang": "fr", "key": "devices.storage", "value": "Stockage"},
    {"lang": "fr", "key": "devices.last_synced", "value": "Dernière synchronisation"},
    {"lang": "fr", "key": "devices.last_sync", "value": "Dernière synchro"},
    {"lang": "fr", "key": "devices.uninstall", "value": "Désinstaller"},
    {"lang": "fr", "key": "devices.uninstall_confirm_title", "value": "Confirmer la désinstallation"},
    {"lang": "fr", "key": "devices.uninstall_confirm_message", "value": "Êtes-vous sûr de vouloir désinstaller {device} ? Cette action ne peut pas être annulée."}
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      'devices',
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;