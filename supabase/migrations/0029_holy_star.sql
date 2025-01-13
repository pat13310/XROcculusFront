-- Update device values
UPDATE devices
SET 
  battery_level = 50,
  storage_used = ROUND(storage_total * 0.75),
  last_sync = NOW() - INTERVAL '2 hours'
WHERE id IN (
  SELECT id FROM devices
  ORDER BY created_at DESC
  LIMIT 1
);