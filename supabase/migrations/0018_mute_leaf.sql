/*
  # Add device-related translations

  1. New Translations
    - Add translations for device status, metrics and actions
    - Include translations for confirmation dialogs
*/

-- First ensure the devices category exists
INSERT INTO translation_categories (id, name, description)
VALUES ('devices', 'Devices', 'Translations for device management')
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "devices.status.online", "value": "Online"},
    {"lang": "en", "key": "devices.status.offline", "value": "Offline"},
    {"lang": "en", "key": "devices.battery_level", "value": "Battery Level"},
    {"lang": "en", "key": "devices.storage", "value": "Storage"},
    {"lang": "en", "key": "devices.last_synced", "value": "Last synced"},
    {"lang": "en", "key": "devices.last_sync", "value": "Last Sync"},
    {"lang": "en", "key": "devices.uninstall", "value": "Uninstall"},
    {"lang": "en", "key": "devices.uninstall_confirm_title", "value": "Confirm Uninstall"},
    {"lang": "en", "key": "devices.uninstall_confirm_message", "value": "Are you sure you want to uninstall {device}? This action cannot be undone."},

    {"lang": "fr", "key": "devices.status.online", "value": "En ligne"},
    {"lang": "fr", "key": "devices.status.offline", "value": "Hors ligne"},
    {"lang": "fr", "key": "devices.battery_level", "value": "Niveau de batterie"},
    {"lang": "fr", "key": "devices.storage", "value": "Stockage"},
    {"lang": "fr", "key": "devices.last_synced", "value": "Dernière synchronisation"},
    {"lang": "fr", "key": "devices.last_sync", "value": "Dernière synchro"},
    {"lang": "fr", "key": "devices.uninstall", "value": "Désinstaller"},
    {"lang": "fr", "key": "devices.uninstall_confirm_title", "value": "Confirmer la désinstallation"},
    {"lang": "fr", "key": "devices.uninstall_confirm_message", "value": "Êtes-vous sûr de vouloir désinstaller {device} ? Cette action ne peut pas être annulée."},

    {"lang": "es", "key": "devices.status.online", "value": "En línea"},
    {"lang": "es", "key": "devices.status.offline", "value": "Desconectado"},
    {"lang": "es", "key": "devices.battery_level", "value": "Nivel de batería"},
    {"lang": "es", "key": "devices.storage", "value": "Almacenamiento"},
    {"lang": "es", "key": "devices.last_synced", "value": "Última sincronización"},
    {"lang": "es", "key": "devices.last_sync", "value": "Última sincronización"},
    {"lang": "es", "key": "devices.uninstall", "value": "Desinstalar"},
    {"lang": "es", "key": "devices.uninstall_confirm_title", "value": "Confirmar desinstalación"},
    {"lang": "es", "key": "devices.uninstall_confirm_message", "value": "¿Estás seguro de que quieres desinstalar {device}? Esta acción no se puede deshacer."},

    {"lang": "de", "key": "devices.status.online", "value": "Online"},
    {"lang": "de", "key": "devices.status.offline", "value": "Offline"},
    {"lang": "de", "key": "devices.battery_level", "value": "Batteriestand"},
    {"lang": "de", "key": "devices.storage", "value": "Speicher"},
    {"lang": "de", "key": "devices.last_synced", "value": "Letzte Synchronisation"},
    {"lang": "de", "key": "devices.last_sync", "value": "Letzte Synchronisation"},
    {"lang": "de", "key": "devices.uninstall", "value": "Deinstallieren"},
    {"lang": "de", "key": "devices.uninstall_confirm_title", "value": "Deinstallation bestätigen"},
    {"lang": "de", "key": "devices.uninstall_confirm_message", "value": "Sind Sie sicher, dass Sie {device} deinstallieren möchten? Diese Aktion kann nicht rückgängig gemacht werden."}
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