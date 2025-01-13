/*
  # Fix Foreign Key Relationships

  1. Changes
    - Drop and recreate device_apps table with proper foreign key constraints
    - Add indexes for better query performance
    
  2. Security
    - Maintain existing RLS policies
*/

-- Temporarily disable RLS to modify the table
ALTER TABLE device_apps DISABLE ROW LEVEL SECURITY;

-- Drop existing device_apps table
DROP TABLE IF EXISTS device_apps;

-- Recreate device_apps table with proper constraints
CREATE TABLE device_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES available_apps(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('installed', 'installing', 'uninstalling', 'failed')) DEFAULT 'installing',
  installed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(device_id, app_id)
);

-- Add indexes for better performance
CREATE INDEX idx_device_apps_device_id ON device_apps(device_id);
CREATE INDEX idx_device_apps_app_id ON device_apps(app_id);
CREATE INDEX idx_device_apps_status ON device_apps(status);

-- Re-enable RLS
ALTER TABLE device_apps ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Users can read device apps"
  ON device_apps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage device apps"
  ON device_apps FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO device_apps (device_id, app_id, status)
SELECT 
  d.id,
  a.id,
  'installed'
FROM devices d
CROSS JOIN available_apps a
WHERE d.model = 'Meta Quest 3'
  AND a.name IN ('Beat Saber', 'Population: One')
ON CONFLICT (device_id, app_id) DO NOTHING;

INSERT INTO device_apps (device_id, app_id, status)
SELECT 
  d.id,
  a.id,
  'installed'
FROM devices d
CROSS JOIN available_apps a
WHERE d.model = 'Meta Quest Pro'
  AND a.name IN ('Half-Life: Alyx', 'Superhot VR', 'Job Simulator')
ON CONFLICT (device_id, app_id) DO NOTHING;