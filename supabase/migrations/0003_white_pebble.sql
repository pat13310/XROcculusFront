/*
  # Add Sample Data

  This migration adds initial sample data for:
  1. VR Devices (Meta Quest, Pico, etc.)
  2. Popular VR Applications and Games
  
  All data is representative of real VR devices and applications
*/

-- Insert sample VR devices
INSERT INTO devices (name, model, status, battery_level, storage_used, storage_total, last_sync)
VALUES
  ('Meta Quest 3', 'MQ3-128', 'online', 85, 95000000000, 128000000000, now()),
  ('Meta Quest Pro', 'MPR-256', 'online', 72, 156000000000, 256000000000, now()),
  ('Pico 4', 'P4-256', 'offline', 15, 198000000000, 256000000000, now()),
  ('VIVE XR Elite', 'VXR-128', 'online', 93, 78000000000, 128000000000, now());

-- Insert sample VR applications
INSERT INTO available_apps (name, developer, size, version, thumbnail)
VALUES
  ('Beat Saber', 'Beat Games', 12000000000, '1.34.0', 'https://images.unsplash.com/photo-1626379961798-54f819ee896a?w=800&q=80'),
  ('Half-Life: Alyx', 'Valve', 67800000000, '1.5.2', 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80'),
  ('Population: One', 'BigBox VR', 8500000000, '2.5.0', 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=800&q=80'),
  ('Superhot VR', 'SUPERHOT Team', 4200000000, '1.14.2', 'https://images.unsplash.com/photo-1626379936553-b27a0a7235ea?w=800&q=80'),
  ('Job Simulator', 'Owlchemy Labs', 5100000000, '1.9.4', 'https://images.unsplash.com/photo-1626379965464-d71d89ef0503?w=800&q=80');

-- Install some apps on devices
INSERT INTO device_apps (device_id, app_id, status)
SELECT 
  devices.id,
  available_apps.id,
  'installed'
FROM devices
CROSS JOIN available_apps
WHERE devices.name = 'Meta Quest 3'
  AND available_apps.name IN ('Beat Saber', 'Population: One');

INSERT INTO device_apps (device_id, app_id, status)
SELECT 
  devices.id,
  available_apps.id,
  'installed'
FROM devices
CROSS JOIN available_apps
WHERE devices.name = 'Meta Quest Pro'
  AND available_apps.name IN ('Half-Life: Alyx', 'Superhot VR', 'Job Simulator');