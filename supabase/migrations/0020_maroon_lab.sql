/*
  # Add missing settings translations
  
  1. New Translations
    - Add missing settings section translations
    - Add missing settings navigation translations
    - Add missing settings form labels and descriptions
*/

-- First ensure the settings category exists
INSERT INTO translation_categories (id, name, description)
VALUES ('settings', 'Settings', 'Translations for settings pages and components')
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "settings.sections.appearance", "value": "Appearance"},
    {"lang": "en", "key": "settings.sections.notifications", "value": "Notifications"},
    {"lang": "en", "key": "settings.sections.language", "value": "Language & Region"},
    {"lang": "en", "key": "settings.sections.advanced", "value": "Advanced"},
    {"lang": "en", "key": "settings.language.select", "value": "Select Language"},
    {"lang": "en", "key": "settings.language.timezone", "value": "Time Zone"},
    {"lang": "en", "key": "settings.language.timezone_description", "value": "Your preferred time zone for dates and times"},
    {"lang": "en", "key": "settings.advanced.coming_soon", "value": "Advanced settings coming soon..."},
    
    {"lang": "fr", "key": "settings.sections.appearance", "value": "Apparence"},
    {"lang": "fr", "key": "settings.sections.notifications", "value": "Notifications"},
    {"lang": "fr", "key": "settings.sections.language", "value": "Langue et région"},
    {"lang": "fr", "key": "settings.sections.advanced", "value": "Avancé"},
    {"lang": "fr", "key": "settings.language.select", "value": "Sélectionner la langue"},
    {"lang": "fr", "key": "settings.language.timezone", "value": "Fuseau horaire"},
    {"lang": "fr", "key": "settings.language.timezone_description", "value": "Votre fuseau horaire préféré pour les dates et heures"},
    {"lang": "fr", "key": "settings.advanced.coming_soon", "value": "Paramètres avancés bientôt disponibles..."},
    
    {"lang": "es", "key": "settings.sections.appearance", "value": "Apariencia"},
    {"lang": "es", "key": "settings.sections.notifications", "value": "Notificaciones"},
    {"lang": "es", "key": "settings.sections.language", "value": "Idioma y región"},
    {"lang": "es", "key": "settings.sections.advanced", "value": "Avanzado"},
    {"lang": "es", "key": "settings.language.select", "value": "Seleccionar idioma"},
    {"lang": "es", "key": "settings.language.timezone", "value": "Zona horaria"},
    {"lang": "es", "key": "settings.language.timezone_description", "value": "Su zona horaria preferida para fechas y horas"},
    {"lang": "es", "key": "settings.advanced.coming_soon", "value": "Configuración avanzada próximamente..."},
    
    {"lang": "de", "key": "settings.sections.appearance", "value": "Erscheinungsbild"},
    {"lang": "de", "key": "settings.sections.notifications", "value": "Benachrichtigungen"},
    {"lang": "de", "key": "settings.sections.language", "value": "Sprache & Region"},
    {"lang": "de", "key": "settings.sections.advanced", "value": "Erweitert"},
    {"lang": "de", "key": "settings.language.select", "value": "Sprache auswählen"},
    {"lang": "de", "key": "settings.language.timezone", "value": "Zeitzone"},
    {"lang": "de", "key": "settings.language.timezone_description", "value": "Ihre bevorzugte Zeitzone für Datum und Uhrzeit"},
    {"lang": "de", "key": "settings.advanced.coming_soon", "value": "Erweiterte Einstellungen in Kürze verfügbar..."}
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