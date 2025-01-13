/*
  # Add Available Apps and Installation Features

  1. New Data
    - Add more sample VR applications
    - Add categories and descriptions
    - Add installation status tracking

  2. Changes
    - Add new columns to available_apps table
    - Update existing apps with more details
*/

-- Add new columns to available_apps
ALTER TABLE available_apps 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5);

-- Update existing apps with more details
UPDATE available_apps SET
  description = CASE name
    WHEN 'Beat Saber' THEN 'Rhythm game where you slash blocks with lightsabers to the beat of music'
    WHEN 'Half-Life: Alyx' THEN 'Set between Half-Life and Half-Life 2, Alyx Vance and her father fight the Combine'
    WHEN 'Population: One' THEN 'Battle royale reimagined for VR with unique vertical combat and building mechanics'
    WHEN 'Superhot VR' THEN 'Time moves only when you move in this stylish FPS'
    WHEN 'Job Simulator' THEN 'Experience what ''jobs'' were like before robots took over in this tongue-in-cheek simulation'
  END,
  category = CASE name
    WHEN 'Beat Saber' THEN 'rhythm'
    WHEN 'Half-Life: Alyx' THEN 'action'
    WHEN 'Population: One' THEN 'battle-royale'
    WHEN 'Superhot VR' THEN 'action'
    WHEN 'Job Simulator' THEN 'simulation'
  END,
  rating = CASE name
    WHEN 'Beat Saber' THEN 4.9
    WHEN 'Half-Life: Alyx' THEN 4.8
    WHEN 'Population: One' THEN 4.5
    WHEN 'Superhot VR' THEN 4.7
    WHEN 'Job Simulator' THEN 4.6
  END;

-- Insert additional VR applications
INSERT INTO available_apps (
  name, 
  developer, 
  size, 
  version, 
  thumbnail, 
  description, 
  category,
  rating
) VALUES
  (
    'Walkabout Mini Golf',
    'Mighty Coconut',
    3500000000,
    '1.15.0',
    'https://images.unsplash.com/photo-1535610546-d7dcf1c2d472?w=800&q=80',
    'Realistic mini golf simulation with beautiful courses and multiplayer support',
    'sports',
    4.8
  ),
  (
    'Pistol Whip',
    'Cloudhead Games',
    8900000000,
    '2.0.0',
    'https://images.unsplash.com/photo-1626379936553-b27a0a7235ea?w=800&q=80',
    'Rhythm-shooter that combines music and action in a stylish world',
    'rhythm-action',
    4.7
  ),
  (
    'Eleven Table Tennis',
    'For Fun Labs',
    2500000000,
    '1.9.0',
    'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&q=80',
    'Ultra-realistic table tennis simulation with physics-based gameplay',
    'sports',
    4.9
  ),
  (
    'Demeo',
    'Resolution Games',
    7200000000,
    '1.12.0',
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80',
    'Turn-based tactical RPG that brings tabletop gaming to life in VR',
    'strategy',
    4.6
  );