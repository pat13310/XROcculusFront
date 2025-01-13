/*
  # Safe Table and Policy Creation

  This migration safely creates tables and policies if they don't exist.
  
  1. Tables
    - Checks for existence before creating tables
    - Uses IF NOT EXISTS for all table creation
  2. Policies
    - Drops existing policies before creating new ones
    - Ensures clean policy creation
*/

-- Safely create tables if they don't exist
DO $$ 
BEGIN
  -- Create devices table if it doesn't exist
  CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    status TEXT CHECK (status IN ('online', 'offline')) DEFAULT 'offline',
    battery_level INTEGER CHECK (battery_level BETWEEN 0 AND 100),
    storage_used BIGINT NOT NULL DEFAULT 0,
    storage_total BIGINT NOT NULL,
    last_sync TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  -- Create available_apps table if it doesn't exist
  CREATE TABLE IF NOT EXISTS available_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    developer TEXT NOT NULL,
    size BIGINT NOT NULL,
    version TEXT NOT NULL,
    thumbnail TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Create device_apps table if it doesn't exist
  CREATE TABLE IF NOT EXISTS device_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    app_id UUID REFERENCES available_apps(id) ON DELETE CASCADE,
    installed_at TIMESTAMPTZ DEFAULT now(),
    status TEXT CHECK (status IN ('installed', 'installing', 'uninstalling', 'failed')) DEFAULT 'installing',
    UNIQUE(device_id, app_id)
  );
END $$;

-- Safely enable RLS
DO $$ 
BEGIN
  ALTER TABLE IF EXISTS devices ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS available_apps ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS device_apps ENABLE ROW LEVEL SECURITY;
END $$;

-- Safely recreate policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can read all devices" ON devices;
  DROP POLICY IF EXISTS "Users can read all available apps" ON available_apps;
  DROP POLICY IF EXISTS "Users can read device apps" ON device_apps;
  DROP POLICY IF EXISTS "Users can manage device apps" ON device_apps;

  -- Create new policies
  CREATE POLICY "Users can read all devices"
    ON devices FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Users can read all available apps"
    ON available_apps FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Users can read device apps"
    ON device_apps FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Users can manage device apps"
    ON device_apps FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
END $$;