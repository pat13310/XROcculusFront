-- Insert sample report templates if they don't exist
INSERT INTO report_templates (name, description, type, config)
VALUES
  (
    'Device Health Report',
    'Comprehensive overview of device health metrics including battery levels, storage usage, and performance indicators',
    'device',
    '{"metrics": ["health_score", "battery_trend", "storage_usage", "performance_index"]}'
  ),
  (
    'Usage Analytics Report',
    'Detailed analysis of device and application usage patterns across your VR fleet',
    'usage',
    '{"metrics": ["active_time", "app_usage", "peak_hours", "user_engagement"]}'
  ),
  (
    'Network Performance Report',
    'Analysis of network connectivity, latency, and bandwidth usage across devices',
    'performance',
    '{"metrics": ["connection_quality", "latency_trend", "bandwidth_usage", "packet_loss"]}'
  ),
  (
    'Application Distribution Report',
    'Overview of application installation status and usage across your device fleet',
    'custom',
    '{"metrics": ["install_rate", "usage_frequency", "popular_apps", "storage_impact"]}'
  )
ON CONFLICT DO NOTHING;

-- Insert sample generated reports
INSERT INTO generated_reports (template_id, name, status, data, created_at, completed_at)
SELECT 
  t.id,
  t.name,
  'completed',
  '{"summary": {"devices_analyzed": 42, "issues_found": 3, "recommendations": 2}}',
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
  '{"summary": {"total_usage": "256 hours", "peak_time": "14:00-16:00", "most_active_devices": 15}}',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '47 hours'
FROM report_templates t
WHERE t.name = 'Network Performance Report';