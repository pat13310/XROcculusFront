/*
  # Analytics System Setup

  1. New Tables
    - network_metrics: Network connection and status data
    - data_usage: Application data consumption
    - battery_history: Device battery levels history
    - system_metrics: Overall system performance metrics

  2. Views
    - app_data_usage_stats: Aggregated app data usage statistics
    - device_battery_stats: Aggregated battery statistics
    
  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Network metrics table
CREATE TABLE network_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT now(),
  connection_type TEXT,
  signal_strength INTEGER,
  latency INTEGER,
  download_speed FLOAT,
  upload_speed FLOAT,
  packet_loss FLOAT
);

-- Data usage by application
CREATE TABLE data_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  app_id UUID REFERENCES available_apps(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT now(),
  bytes_downloaded BIGINT,
  bytes_uploaded BIGINT
);

-- Battery history
CREATE TABLE battery_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT now(),
  level INTEGER CHECK (level BETWEEN 0 AND 100),
  is_charging BOOLEAN,
  temperature FLOAT
);

-- System metrics
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT now(),
  cpu_usage FLOAT,
  memory_usage FLOAT,
  gpu_usage FLOAT,
  storage_usage FLOAT
);

-- Create views for aggregated statistics
CREATE VIEW app_data_usage_stats AS
SELECT 
  app_id,
  device_id,
  date_trunc('hour', timestamp) as hour,
  SUM(bytes_downloaded + bytes_uploaded) as total_bytes,
  AVG(bytes_downloaded + bytes_uploaded) as avg_bytes_per_hour
FROM data_usage
GROUP BY app_id, device_id, date_trunc('hour', timestamp);

CREATE VIEW device_battery_stats AS
SELECT 
  device_id,
  date_trunc('hour', timestamp) as hour,
  AVG(level) as avg_level,
  MIN(level) as min_level,
  MAX(level) as max_level,
  COUNT(*) FILTER (WHERE is_charging) as charging_count
FROM battery_history
GROUP BY device_id, date_trunc('hour', timestamp);

-- Enable RLS
ALTER TABLE network_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE battery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read network metrics"
  ON network_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read data usage"
  ON data_usage FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read battery history"
  ON battery_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read system metrics"
  ON system_metrics FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO network_metrics (device_id, connection_type, signal_strength, latency, download_speed, upload_speed, packet_loss)
SELECT 
  d.id,
  CASE floor(random() * 3)
    WHEN 0 THEN 'wifi'
    WHEN 1 THEN '5g'
    ELSE '4g'
  END,
  floor(random() * 100),
  floor(random() * 200),
  random() * 100,
  random() * 50,
  random() * 5
FROM devices d
CROSS JOIN generate_series(1, 24) s;

INSERT INTO battery_history (device_id, level, is_charging, temperature)
SELECT 
  d.id,
  floor(random() * 100),
  random() < 0.3,
  20 + (random() * 15)
FROM devices d
CROSS JOIN generate_series(1, 24) s;