/*
  # Fix System Logs Policies and Permissions

  1. Changes
    - Drop and recreate system_logs table with proper structure
    - Set up proper RLS policies
    - Grant all necessary permissions
    
  2. Security
    - Enable RLS
    - Create policies for read and insert operations
    - Grant proper role permissions
*/

-- Drop existing table and start fresh
DROP TABLE IF EXISTS system_logs;

-- Create system_logs table
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
  message TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "system_logs_insert_policy"
  ON system_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "system_logs_select_policy"
  ON system_logs FOR SELECT
  TO authenticated
  USING (true);

-- Grant proper permissions to authenticated users
GRANT ALL ON system_logs TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;