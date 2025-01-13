-- Create views for analytics
CREATE OR REPLACE VIEW app_usage_stats AS
SELECT 
  a.id as app_id,
  a.name as app_name,
  COUNT(DISTINCT da.device_id) as user_count,
  COALESCE(SUM(du.bytes_downloaded + du.bytes_uploaded), 0) as total_bytes
FROM available_apps a
LEFT JOIN device_apps da ON a.id = da.app_id
LEFT JOIN data_usage du ON a.id = du.app_id
GROUP BY a.id, a.name;

CREATE OR REPLACE VIEW console_storage_stats AS
SELECT 
  d.model,
  COUNT(*) as device_count,
  SUM(d.storage_total) as total_storage,
  SUM(d.storage_used) as used_storage
FROM devices d
GROUP BY d.model;

-- Insert additional sample data
INSERT INTO data_usage (device_id, app_id, bytes_downloaded, bytes_uploaded)
SELECT 
  d.id,
  a.id,
  floor(random() * 5000000000), -- 5GB max download
  floor(random() * 2000000000)  -- 2GB max upload
FROM devices d
CROSS JOIN available_apps a
WHERE NOT EXISTS (
  SELECT 1 FROM data_usage 
  WHERE device_id = d.id AND app_id = a.id
)
LIMIT 50;

-- Update device storage usage to be more realistic
UPDATE devices
SET storage_used = GREATEST(
  floor(random() * storage_total),
  floor(storage_total * 0.2) -- Minimum 20% usage
);