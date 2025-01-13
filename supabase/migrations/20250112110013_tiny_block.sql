-- Drop existing policies
DROP POLICY IF EXISTS "system_logs_insert_policy" ON system_logs;
DROP POLICY IF EXISTS "system_logs_select_policy" ON system_logs;
DROP POLICY IF EXISTS "Users can insert logs" ON system_logs;
DROP POLICY IF EXISTS "Users can read logs" ON system_logs;

-- Recreate policies with proper permissions
CREATE POLICY "system_logs_insert_policy"
  ON system_logs 
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "system_logs_select_policy"
  ON system_logs 
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure proper grants
GRANT ALL ON system_logs TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;