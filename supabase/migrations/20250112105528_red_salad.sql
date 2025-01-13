/*
  # Fix Database Schema and Policies

  1. Changes
    - Add IF NOT EXISTS to policy creation
    - Ensure unique policy names
    - Keep table creation and data insertion
    
  2. Security
    - Safely create RLS policies
*/

-- Create available_apps table first
CREATE TABLE IF NOT EXISTS available_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  developer TEXT NOT NULL,
  size BIGINT NOT NULL,
  version TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  category TEXT,
  rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on available_apps
ALTER TABLE available_apps ENABLE ROW LEVEL SECURITY;

-- Safely create policy for available_apps
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'available_apps' 
    AND policyname = 'Users can read all available apps'
  ) THEN
    CREATE POLICY "Users can read all available apps"
      ON available_apps FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Now create device_apps table
CREATE TABLE IF NOT EXISTS device_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES available_apps(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('installed', 'installing', 'uninstalling', 'failed')) DEFAULT 'installing',
  installed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(device_id, app_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_device_apps_device_id ON device_apps(device_id);
CREATE INDEX IF NOT EXISTS idx_device_apps_app_id ON device_apps(app_id);
CREATE INDEX IF NOT EXISTS idx_device_apps_status ON device_apps(status);

-- Enable RLS on device_apps
ALTER TABLE device_apps ENABLE ROW LEVEL SECURITY;

-- Safely create policies for device_apps
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'device_apps' 
    AND policyname = 'Device apps read access'
  ) THEN
    CREATE POLICY "Device apps read access"
      ON device_apps FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'device_apps' 
    AND policyname = 'Device apps manage access'
  ) THEN
    CREATE POLICY "Device apps manage access"
      ON device_apps FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Insert sample apps
INSERT INTO available_apps (name, developer, size, version, thumbnail, category, rating)
VALUES
  ('Beat Saber', 'Beat Games', 12000000000, '1.34.0', 'https://images.unsplash.com/photo-1626379961798-54f819ee896a?w=800&q=80', 'rhythm', 4.9),
  ('Half-Life: Alyx', 'Valve', 67800000000, '1.5.2', 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80', 'action', 4.8),
  ('Population: One', 'BigBox VR', 8500000000, '2.5.0', 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=800&q=80', 'battle-royale', 4.5),
  ('Superhot VR', 'SUPERHOT Team', 4200000000, '1.14.2', 'https://images.unsplash.com/photo-1626379936553-b27a0a7235ea?w=800&q=80', 'action', 4.7),
  ('Job Simulator', 'Owlchemy Labs', 5100000000, '1.9.4', 'https://images.unsplash.com/photo-1626379965464-d71d89ef0503?w=800&q=80', 'simulation', 4.6)
ON CONFLICT (id) DO NOTHING;

-- Insert sample device-app relationships
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