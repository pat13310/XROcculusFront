/*
  # Add Reports Tables and Functions
  
  1. New Tables
    - report_templates
    - generated_reports
    - report_schedules
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create report_templates table
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('device', 'usage', 'performance', 'custom')),
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create generated_reports table
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

-- Create report_schedules table
CREATE TABLE IF NOT EXISTS report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  next_run TIMESTAMPTZ NOT NULL,
  last_run TIMESTAMPTZ,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read report templates"
  ON report_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read generated reports"
  ON generated_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read report schedules"
  ON report_schedules FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample report templates
INSERT INTO report_templates (name, description, type, config) VALUES
  ('Device Usage Report', 'Overview of device usage statistics', 'device', '{"metrics": ["usage_time", "battery_levels", "storage_usage"]}'),
  ('Performance Analysis', 'Detailed performance metrics for all devices', 'performance', '{"metrics": ["cpu_usage", "memory_usage", "network_latency"]}'),
  ('Application Usage', 'Analysis of application installation and usage patterns', 'usage', '{"metrics": ["installed_apps", "usage_time", "data_transfer"]}')
ON CONFLICT DO NOTHING;