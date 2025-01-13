/*
  # Initial schema for VR device management

  1. New Tables
    - `devices`
      - Basic device information
      - Status and metrics
    - `device_apps`
      - Apps installed on specific devices
      - Installation status and details
    - `available_apps`
      - Catalog of all available VR applications

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users
*/

-- Create devices table
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

-- Create available_apps table
CREATE TABLE IF NOT EXISTS available_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  developer TEXT NOT NULL,
  size BIGINT NOT NULL,
  version TEXT NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create device_apps table (junction table)
CREATE TABLE IF NOT EXISTS device_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  app_id UUID REFERENCES available_apps(id) ON DELETE CASCADE,
  installed_at TIMESTAMPTZ DEFAULT now(),
  status TEXT CHECK (status IN ('installed', 'installing', 'uninstalling', 'failed')) DEFAULT 'installing',
  UNIQUE(device_id, app_id)
);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_apps ENABLE ROW LEVEL SECURITY;

-- Create policies
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