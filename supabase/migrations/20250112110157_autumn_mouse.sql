-- Safely create report_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('device', 'usage', 'performance', 'custom')),
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Safely create generated_reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  data JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;

-- Safely create policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can read report templates" ON report_templates;
  DROP POLICY IF EXISTS "Users can read generated reports" ON generated_reports;
  
  -- Create new policies
  CREATE POLICY "Users can read report templates"
    ON report_templates FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Users can read generated reports"
    ON generated_reports FOR SELECT
    TO authenticated
    USING (true);
END $$;

-- Insert sample report templates
INSERT INTO report_templates (name, description, type, config)
VALUES
  (
    'Device Health Report',
    'Comprehensive overview of device health metrics including battery levels, storage usage, and performance indicators',
    'device',
    '{"metrics": ["health_score", "battery_trend", "storage_usage", "performance_index"]}'::jsonb
  ),
  (
    'Usage Analytics Report',
    'Detailed analysis of device and application usage patterns across your VR fleet',
    'usage',
    '{"metrics": ["active_time", "app_usage", "peak_hours", "user_engagement"]}'::jsonb
  ),
  (
    'Network Performance Report',
    'Analysis of network connectivity, latency, and bandwidth usage across devices',
    'performance',
    '{"metrics": ["connection_quality", "latency_trend", "bandwidth_usage", "packet_loss"]}'::jsonb
  ),
  (
    'Application Distribution Report',
    'Overview of application installation status and usage across your device fleet',
    'custom',
    '{"metrics": ["install_rate", "usage_frequency", "popular_apps", "storage_impact"]}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Insert sample generated reports
INSERT INTO generated_reports (template_id, name, status, data, created_at, completed_at)
SELECT 
  t.id,
  t.name,
  'completed',
  '{"summary": {"devices_analyzed": 42, "issues_found": 3, "recommendations": 2}}'::jsonb,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '23 hours'
FROM report_templates t
WHERE t.name = 'Device Health Report'
UNION ALL
SELECT 
  t.id,
  t.name,
  'processing',
  NULL,
  NOW() - INTERVAL '1 hour',
  NULL
FROM report_templates t
WHERE t.name = 'Usage Analytics Report'
UNION ALL
SELECT 
  t.id,
  t.name,
  'completed',
  '{"summary": {"total_usage": "256 hours", "peak_time": "14:00-16:00", "most_active_devices": 15}}'::jsonb,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '47 hours'
FROM report_templates t
WHERE t.name = 'Network Performance Report';