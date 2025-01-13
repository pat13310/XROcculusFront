/*
  # Add settings page translations

  1. New Translations
    - Add translations for the settings page in all supported languages
    - Include translations for all settings sections and options
*/

DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "settings.title", "value": "Settings"},
    {"lang": "en", "key": "settings.appearance.theme", "value": "Theme"},
    {"lang": "en", "key": "settings.themes.light", "value": "Light"},
    {"lang": "en", "key": "settings.themes.dark", "value": "Dark"},
    {"lang": "en", "key": "settings.themes.system", "value": "System"},
    {"lang": "en", "key": "settings.appearance.sidebar", "value": "Sidebar"},
    {"lang": "en", "key": "settings.appearance.collapse_sidebar", "value": "Collapse sidebar by default"},
    {"lang": "en", "key": "settings.notifications.preferences", "value": "Notification Preferences"},
    {"lang": "en", "key": "settings.notifications.enable", "value": "Enable notifications"},
    {"lang": "en", "key": "settings.notifications.sound", "value": "Play sound for notifications"},
    {"lang": "en", "key": "settings.notifications.device_alerts", "value": "Device alerts"},
    {"lang": "en", "key": "settings.notifications.updates", "value": "Software updates"},
    
    {"lang": "fr", "key": "settings.title", "value": "Paramètres"},
    {"lang": "fr", "key": "settings.appearance.theme", "value": "Thème"},
    {"lang": "fr", "key": "settings.themes.light", "value": "Clair"},
    {"lang": "fr", "key": "settings.themes.dark", "value": "Sombre"},
    {"lang": "fr", "key": "settings.themes.system", "value": "Système"},
    {"lang": "fr", "key": "settings.appearance.sidebar", "value": "Barre latérale"},
    {"lang": "fr", "key": "settings.appearance.collapse_sidebar", "value": "Réduire la barre latérale par défaut"},
    {"lang": "fr", "key": "settings.notifications.preferences", "value": "Préférences de notification"},
    {"lang": "fr", "key": "settings.notifications.enable", "value": "Activer les notifications"},
    {"lang": "fr", "key": "settings.notifications.sound", "value": "Jouer un son pour les notifications"},
    {"lang": "fr", "key": "settings.notifications.device_alerts", "value": "Alertes des appareils"},
    {"lang": "fr", "key": "settings.notifications.updates", "value": "Mises à jour logicielles"},
    
    {"lang": "es", "key": "settings.title", "value": "Ajustes"},
    {"lang": "es", "key": "settings.appearance.theme", "value": "Tema"},
    {"lang": "es", "key": "settings.themes.light", "value": "Claro"},
    {"lang": "es", "key": "settings.themes.dark", "value": "Oscuro"},
    {"lang": "es", "key": "settings.themes.system", "value": "Sistema"},
    {"lang": "es", "key": "settings.appearance.sidebar", "value": "Barra lateral"},
    {"lang": "es", "key": "settings.appearance.collapse_sidebar", "value": "Contraer barra lateral por defecto"},
    {"lang": "es", "key": "settings.notifications.preferences", "value": "Preferencias de notificación"},
    {"lang": "es", "key": "settings.notifications.enable", "value": "Activar notificaciones"},
    {"lang": "es", "key": "settings.notifications.sound", "value": "Reproducir sonido para notificaciones"},
    {"lang": "es", "key": "settings.notifications.device_alerts", "value": "Alertas de dispositivos"},
    {"lang": "es", "key": "settings.notifications.updates", "value": "Actualizaciones de software"},
    
    {"lang": "de", "key": "settings.title", "value": "Einstellungen"},
    {"lang": "de", "key": "settings.appearance.theme", "value": "Design"},
    {"lang": "de", "key": "settings.themes.light", "value": "Hell"},
    {"lang": "de", "key": "settings.themes.dark", "value": "Dunkel"},
    {"lang": "de", "key": "settings.themes.system", "value": "System"},
    {"lang": "de", "key": "settings.appearance.sidebar", "value": "Seitenleiste"},
    {"lang": "de", "key": "settings.appearance.collapse_sidebar", "value": "Seitenleiste standardmäßig einklappen"},
    {"lang": "de", "key": "settings.notifications.preferences", "value": "Benachrichtigungseinstellungen"},
    {"lang": "de", "key": "settings.notifications.enable", "value": "Benachrichtigungen aktivieren"},
    {"lang": "de", "key": "settings.notifications.sound", "value": "Ton bei Benachrichtigungen abspielen"},
    {"lang": "de", "key": "settings.notifications.device_alerts", "value": "Gerätebenachrichtigungen"},
    {"lang": "de", "key": "settings.notifications.updates", "value": "Software-Updates"}
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      'settings',
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;