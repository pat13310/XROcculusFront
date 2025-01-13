/*
  # Add landing page statistics translations
  
  1. New Translations
    - Adds translations for the statistics section on the landing page
    - Includes numbers and labels in multiple languages
    - Supports English and French initially
  
  2. Structure
    - Uses the existing 'landing' category
    - Adds new keys for each statistic value and label
*/

-- Add translations for landing page statistics
DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "landing.stats.devices.value", "value": "500+"},
    {"lang": "en", "key": "landing.stats.devices.label", "value": "Devices Managed"},
    {"lang": "en", "key": "landing.stats.uptime.value", "value": "99.9%"},
    {"lang": "en", "key": "landing.stats.uptime.label", "value": "Uptime"},
    {"lang": "en", "key": "landing.stats.support.value", "value": "24/7"},
    {"lang": "en", "key": "landing.stats.support.label", "value": "Support"},
    {"lang": "en", "key": "landing.stats.clients.value", "value": "50+"},
    {"lang": "en", "key": "landing.stats.clients.label", "value": "Enterprise Clients"},
    
    {"lang": "fr", "key": "landing.stats.devices.value", "value": "500+"},
    {"lang": "fr", "key": "landing.stats.devices.label", "value": "Appareils gérés"},
    {"lang": "fr", "key": "landing.stats.uptime.value", "value": "99,9%"},
    {"lang": "fr", "key": "landing.stats.uptime.label", "value": "Disponibilité"},
    {"lang": "fr", "key": "landing.stats.support.value", "value": "24/7"},
    {"lang": "fr", "key": "landing.stats.support.label", "value": "Support"},
    {"lang": "fr", "key": "landing.stats.clients.value", "value": "50+"},
    {"lang": "fr", "key": "landing.stats.clients.label", "value": "Clients entreprise"},

    {"lang": "es", "key": "landing.stats.devices.value", "value": "500+"},
    {"lang": "es", "key": "landing.stats.devices.label", "value": "Dispositivos gestionados"},
    {"lang": "es", "key": "landing.stats.uptime.value", "value": "99,9%"},
    {"lang": "es", "key": "landing.stats.uptime.label", "value": "Tiempo activo"},
    {"lang": "es", "key": "landing.stats.support.value", "value": "24/7"},
    {"lang": "es", "key": "landing.stats.support.label", "value": "Soporte"},
    {"lang": "es", "key": "landing.stats.clients.value", "value": "50+"},
    {"lang": "es", "key": "landing.stats.clients.label", "value": "Clientes empresariales"},

    {"lang": "de", "key": "landing.stats.devices.value", "value": "500+"},
    {"lang": "de", "key": "landing.stats.devices.label", "value": "Verwaltete Geräte"},
    {"lang": "de", "key": "landing.stats.uptime.value", "value": "99,9%"},
    {"lang": "de", "key": "landing.stats.uptime.label", "value": "Verfügbarkeit"},
    {"lang": "de", "key": "landing.stats.support.value", "value": "24/7"},
    {"lang": "de", "key": "landing.stats.support.label", "value": "Support"},
    {"lang": "de", "key": "landing.stats.clients.value", "value": "50+"},
    {"lang": "de", "key": "landing.stats.clients.label", "value": "Unternehmenskunden"}
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      'landing',
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;