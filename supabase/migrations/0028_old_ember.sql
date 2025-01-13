-- Create system_logs table for application logging
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
  message TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can insert logs"
  ON system_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read logs"
  ON system_logs FOR SELECT
  TO authenticated
  USING (true);