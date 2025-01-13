/*
  # Fix System Logs Policies

  1. Changes
    - Add proper RLS policies for system_logs table
    - Allow authenticated users to insert and read logs
    
  2. Security
    - Enable RLS
    - Create policies for read and insert operations
*/

-- Ensure RLS is enabled
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert logs" ON system_logs;
DROP POLICY IF EXISTS "Users can read logs" ON system_logs;

-- Create new policies
CREATE POLICY "Users can insert logs"
  ON system_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read logs"
  ON system_logs FOR SELECT
  TO authenticated
  USING (true);

-- Grant necessary permissions
GRANT INSERT, SELECT ON system_logs TO authenticated;