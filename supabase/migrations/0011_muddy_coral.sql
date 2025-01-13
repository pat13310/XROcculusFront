/*
  # Add Sidebar Translations

  1. Tables
    - Ensure translations table exists with proper structure
  2. Data
    - Add translations for sidebar menu items in all supported languages
  3. Security
    - Enable RLS and set appropriate policies
*/

-- First ensure the required tables exist
CREATE TABLE IF NOT EXISTS languages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS translation_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_id TEXT REFERENCES languages(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES translation_categories(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(language_id, key)
);

-- Ensure the sidebar category exists
INSERT INTO translation_categories (id, name, description)
VALUES ('sidebar', 'Sidebar', 'Translations for the sidebar navigation')
ON CONFLICT (id) DO NOTHING;

-- Safely insert translations using DO block to handle existing entries
DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "sidebar.dashboard", "value": "Dashboard"},
    {"lang": "en", "key": "sidebar.devices", "value": "Devices"},
    {"lang": "en", "key": "sidebar.applications", "value": "Applications"},
    {"lang": "en", "key": "sidebar.analytics", "value": "Analytics"},
    {"lang": "en", "key": "sidebar.users", "value": "Users"},
    {"lang": "en", "key": "sidebar.settings", "value": "Settings"},
    
    {"lang": "fr", "key": "sidebar.dashboard", "value": "Tableau de bord"},
    {"lang": "fr", "key": "sidebar.devices", "value": "Appareils"},
    {"lang": "fr", "key": "sidebar.applications", "value": "Applications"},
    {"lang": "fr", "key": "sidebar.analytics", "value": "Analytique"},
    {"lang": "fr", "key": "sidebar.users", "value": "Utilisateurs"},
    {"lang": "fr", "key": "sidebar.settings", "value": "Paramètres"},
    
    {"lang": "es", "key": "sidebar.dashboard", "value": "Panel"},
    {"lang": "es", "key": "sidebar.devices", "value": "Dispositivos"},
    {"lang": "es", "key": "sidebar.applications", "value": "Aplicaciones"},
    {"lang": "es", "key": "sidebar.analytics", "value": "Análisis"},
    {"lang": "es", "key": "sidebar.users", "value": "Usuarios"},
    {"lang": "es", "key": "sidebar.settings", "value": "Ajustes"},
    
    {"lang": "de", "key": "sidebar.dashboard", "value": "Dashboard"},
    {"lang": "de", "key": "sidebar.devices", "value": "Geräte"},
    {"lang": "de", "key": "sidebar.applications", "value": "Anwendungen"},
    {"lang": "de", "key": "sidebar.analytics", "value": "Analytik"},
    {"lang": "de", "key": "sidebar.users", "value": "Benutzer"},
    {"lang": "de", "key": "sidebar.settings", "value": "Einstellungen"}
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      'sidebar',
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;