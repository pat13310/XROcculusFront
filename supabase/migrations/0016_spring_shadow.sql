/*
  # Add translations for application cards

  1. New Translations
    - Add translations for app card details in all supported languages
    - Include translations for size, version, rating labels
*/

DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "apps.card.version", "value": "Version"},
    {"lang": "en", "key": "apps.card.size", "value": "Size"},
    {"lang": "en", "key": "apps.card.rating", "value": "Rating"},
    {"lang": "en", "key": "apps.card.by", "value": "by"},
    
    {"lang": "fr", "key": "apps.card.version", "value": "Version"},
    {"lang": "fr", "key": "apps.card.size", "value": "Taille"},
    {"lang": "fr", "key": "apps.card.rating", "value": "Note"},
    {"lang": "fr", "key": "apps.card.by", "value": "par"},
    
    {"lang": "es", "key": "apps.card.version", "value": "Versión"},
    {"lang": "es", "key": "apps.card.size", "value": "Tamaño"},
    {"lang": "es", "key": "apps.card.rating", "value": "Valoración"},
    {"lang": "es", "key": "apps.card.by", "value": "por"},
    
    {"lang": "de", "key": "apps.card.version", "value": "Version"},
    {"lang": "de", "key": "apps.card.size", "value": "Größe"},
    {"lang": "de", "key": "apps.card.rating", "value": "Bewertung"},
    {"lang": "de", "key": "apps.card.by", "value": "von"}
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