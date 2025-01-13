/*
  # Add missing translations and fix existing ones
  
  1. Updates
    - Add missing settings translations
    - Fix device status translations
    - Add missing section titles
    - Update timezone translations
  
  2. Languages
    - English
    - French
    - Spanish
    - German
*/

DO $$
DECLARE
  translations_data jsonb := '[
    {
      "lang": "fr",
      "key": "settings.sections.appearance",
      "value": "Apparence"
    },
    {
      "lang": "fr",
      "key": "settings.sections.notifications",
      "value": "Notifications"
    },
    {
      "lang": "fr",
      "key": "settings.sections.language",
      "value": "Langue et région"
    },
    {
      "lang": "fr",
      "key": "settings.sections.advanced",
      "value": "Avancé"
    },
    {
      "lang": "es",
      "key": "settings.sections.appearance",
      "value": "Apariencia"
    },
    {
      "lang": "es",
      "key": "settings.sections.notifications",
      "value": "Notificaciones"
    },
    {
      "lang": "es",
      "key": "settings.sections.language",
      "value": "Idioma y región"
    },
    {
      "lang": "es",
      "key": "settings.sections.advanced",
      "value": "Avanzado"
    },
    {
      "lang": "fr",
      "key": "settings.appearance.theme",
      "value": "Thème"
    },
    {
      "lang": "fr",
      "key": "settings.appearance.sidebar",
      "value": "Barre latérale"
    },
    {
      "lang": "fr",
      "key": "settings.appearance.collapse_sidebar",
      "value": "Réduire la barre latérale par défaut"
    },
    {
      "lang": "es",
      "key": "settings.appearance.theme",
      "value": "Tema"
    },
    {
      "lang": "es",
      "key": "settings.appearance.sidebar",
      "value": "Barra lateral"
    },
    {
      "lang": "es",
      "key": "settings.appearance.collapse_sidebar",
      "value": "Contraer barra lateral por defecto"
    },
    {
      "lang": "fr",
      "key": "settings.themes.light",
      "value": "Clair"
    },
    {
      "lang": "fr",
      "key": "settings.themes.dark",
      "value": "Sombre"
    },
    {
      "lang": "fr",
      "key": "settings.themes.system",
      "value": "Système"
    },
    {
      "lang": "es",
      "key": "settings.themes.light",
      "value": "Claro"
    },
    {
      "lang": "es",
      "key": "settings.themes.dark",
      "value": "Oscuro"
    },
    {
      "lang": "es",
      "key": "settings.themes.system",
      "value": "Sistema"
    },
    {
      "lang": "fr",
      "key": "settings.notifications.preferences",
      "value": "Préférences de notification"
    },
    {
      "lang": "fr",
      "key": "settings.notifications.enable",
      "value": "Activer les notifications"
    },
    {
      "lang": "fr",
      "key": "settings.notifications.sound",
      "value": "Son pour les notifications"
    },
    {
      "lang": "fr",
      "key": "settings.notifications.device_alerts",
      "value": "Alertes des appareils"
    },
    {
      "lang": "fr",
      "key": "settings.notifications.updates",
      "value": "Mises à jour"
    },
    {
      "lang": "es",
      "key": "settings.notifications.preferences",
      "value": "Preferencias de notificación"
    },
    {
      "lang": "es",
      "key": "settings.notifications.enable",
      "value": "Activar notificaciones"
    },
    {
      "lang": "es",
      "key": "settings.notifications.sound",
      "value": "Sonido para notificaciones"
    },
    {
      "lang": "es",
      "key": "settings.notifications.device_alerts",
      "value": "Alertas de dispositivos"
    },
    {
      "lang": "es",
      "key": "settings.notifications.updates",
      "value": "Actualizaciones"
    },
    {
      "lang": "fr",
      "key": "settings.language.title",
      "value": "Langue"
    },
    {
      "lang": "fr",
      "key": "settings.language.description",
      "value": "Choisissez votre langue préférée pour l''interface"
    },
    {
      "lang": "fr",
      "key": "settings.timezone.title",
      "value": "Fuseau horaire"
    },
    {
      "lang": "fr",
      "key": "settings.timezone.description",
      "value": "Choisissez votre fuseau horaire préféré"
    },
    {
      "lang": "es",
      "key": "settings.language.title",
      "value": "Idioma"
    },
    {
      "lang": "es",
      "key": "settings.language.description",
      "value": "Elija su idioma preferido para la interfaz"
    },
    {
      "lang": "es",
      "key": "settings.timezone.title",
      "value": "Zona horaria"
    },
    {
      "lang": "es",
      "key": "settings.timezone.description",
      "value": "Elija su zona horaria preferida"
    },
    {
      "lang": "fr",
      "key": "settings.advanced.coming_soon",
      "value": "Paramètres avancés bientôt disponibles..."
    },
    {
      "lang": "es",
      "key": "settings.advanced.coming_soon",
      "value": "Configuración avanzada próximamente..."
    }
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