-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'warning', 'error')) DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample alerts
INSERT INTO alerts (title, message, type, created_at)
VALUES
  (
    'Batterie faible',
    'Le Meta Quest 3 a un niveau de batterie inférieur à 20%',
    'warning',
    now() - interval '30 minutes'
  ),
  (
    'Mise à jour disponible',
    'Une nouvelle mise à jour système est disponible pour vos appareils',
    'info',
    now() - interval '2 hours'
  ),
  (
    'Erreur de synchronisation',
    'La synchronisation a échoué pour le Pico 4',
    'error',
    now() - interval '1 day'
  ),
  (
    'Stockage limité',
    'Le Meta Quest Pro approche de sa capacité de stockage maximale',
    'warning',
    now() - interval '3 hours'
  );