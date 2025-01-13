-- Add sample data for analytics
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
CROSS JOIN generate_series(1, 10);

-- Add data usage records
INSERT INTO data_usage (device_id, app_id, bytes_downloaded, bytes_uploaded)
SELECT 
  d.id,
  a.id,
  floor(random() * 1000000000),
  floor(random() * 500000000)
FROM devices d
CROSS JOIN available_apps a
LIMIT 20;

-- Add battery history
INSERT INTO battery_history (device_id, level, is_charging, temperature)
SELECT 
  d.id,
  floor(random() * 100),
  random() < 0.3,
  20 + (random() * 15)
FROM devices d
CROSS JOIN generate_series(1, 10);