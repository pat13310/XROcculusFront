/*
  # Add missing settings translations
  
  1. New Translations
    - Add missing language section translations
    - Add missing timezone section translations
*/

DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "settings.language.title", "value": "Language"},
    {"lang": "en", "key": "settings.language.description", "value": "Choose your preferred language for the interface"},
    {"lang": "en", "key": "settings.timezone.title", "value": "Time Zone"},
    {"lang": "en", "key": "settings.timezone.description", "value": "Choose your preferred time zone"},
    
    {"lang": "fr", "key": "settings.language.title", "value": "Langue"},
    {"lang": "fr", "key": "settings.language.description", "value": "Choisissez votre langue préférée pour l''interface"},
    {"lang": "fr", "key": "settings.timezone.title", "value": "Fuseau horaire"},
    {"lang": "fr", "key": "settings.timezone.description", "value": "Choisissez votre fuseau horaire préféré"},
    
    {"lang": "es", "key": "settings.language.title", "value": "Idioma"},
    {"lang": "es", "key": "settings.language.description", "value": "Elija su idioma preferido para la interfaz"},
    {"lang": "es", "key": "settings.timezone.title", "value": "Zona horaria"},
    {"lang": "es", "key": "settings.timezone.description", "value": "Elija su zona horaria preferida"},
    
    {"lang": "de", "key": "settings.language.title", "value": "Sprache"},
    {"lang": "de", "key": "settings.language.description", "value": "Wählen Sie Ihre bevorzugte Sprache für die Benutzeroberfläche"},
    {"lang": "de", "key": "settings.timezone.title", "value": "Zeitzone"},
    {"lang": "de", "key": "settings.timezone.description", "value": "Wählen Sie Ihre bevorzugte Zeitzone"}
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