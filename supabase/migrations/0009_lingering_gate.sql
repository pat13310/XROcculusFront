/*
  # Add Translation Support

  1. New Tables
    - `languages`: Supported languages
    - `translations`: Translation key-value pairs for each language
    - `translation_categories`: Categories for organizing translations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create translation categories table
CREATE TABLE IF NOT EXISTS translation_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create translations table
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

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to languages" ON languages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to translation categories" ON translation_categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to translations" ON translations
  FOR SELECT TO authenticated USING (true);

-- Insert default languages
INSERT INTO languages (id, name, native_name, is_default)
VALUES 
  ('en', 'English', 'English', true),
  ('fr', 'French', 'Français', false),
  ('es', 'Spanish', 'Español', false),
  ('de', 'German', 'Deutsch', false);

-- Insert translation categories
INSERT INTO translation_categories (id, name, description)
VALUES
  ('common', 'Common', 'Common translations used throughout the application'),
  ('auth', 'Authentication', 'Authentication-related translations'),
  ('devices', 'Devices', 'Device management translations'),
  ('apps', 'Applications', 'Application management translations'),
  ('settings', 'Settings', 'Settings page translations');

-- Insert sample translations
INSERT INTO translations (language_id, category_id, key, value)
VALUES
  -- English translations
  ('en', 'common', 'dashboard', 'Dashboard'),
  ('en', 'common', 'devices', 'Devices'),
  ('en', 'common', 'applications', 'Applications'),
  ('en', 'common', 'settings', 'Settings'),
  ('en', 'common', 'users', 'Users'),
  ('en', 'auth', 'sign_in', 'Sign In'),
  ('en', 'auth', 'sign_out', 'Sign Out'),
  ('en', 'devices', 'total_devices', 'Total Devices'),
  ('en', 'devices', 'active_devices', 'Active Devices'),
  ('en', 'apps', 'install', 'Install'),
  ('en', 'apps', 'uninstall', 'Uninstall'),
  
  -- French translations
  ('fr', 'common', 'dashboard', 'Tableau de bord'),
  ('fr', 'common', 'devices', 'Appareils'),
  ('fr', 'common', 'applications', 'Applications'),
  ('fr', 'common', 'settings', 'Paramètres'),
  ('fr', 'common', 'users', 'Utilisateurs'),
  ('fr', 'auth', 'sign_in', 'Se connecter'),
  ('fr', 'auth', 'sign_out', 'Se déconnecter'),
  ('fr', 'devices', 'total_devices', 'Appareils totaux'),
  ('fr', 'devices', 'active_devices', 'Appareils actifs'),
  ('fr', 'apps', 'install', 'Installer'),
  ('fr', 'apps', 'uninstall', 'Désinstaller'),

  -- Spanish translations
  ('es', 'common', 'dashboard', 'Panel'),
  ('es', 'common', 'devices', 'Dispositivos'),
  ('es', 'common', 'applications', 'Aplicaciones'),
  ('es', 'common', 'settings', 'Ajustes'),
  ('es', 'common', 'users', 'Usuarios'),
  ('es', 'auth', 'sign_in', 'Iniciar sesión'),
  ('es', 'auth', 'sign_out', 'Cerrar sesión'),
  ('es', 'devices', 'total_devices', 'Dispositivos totales'),
  ('es', 'devices', 'active_devices', 'Dispositivos activos'),
  ('es', 'apps', 'install', 'Instalar'),
  ('es', 'apps', 'uninstall', 'Desinstalar');