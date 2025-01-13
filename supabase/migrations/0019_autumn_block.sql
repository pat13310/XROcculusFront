/*
  # Update translations and add app descriptions

  1. Updates
    - Fix Spanish translations for devices section
    - Add app descriptions translations
*/

-- Update Spanish device translations
UPDATE translations 
SET value = 'Dispositivos'
WHERE language_id = 'es' 
AND key = 'devices.title';

-- Add app descriptions translations
DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "apps.descriptions.demeo", "value": "Turn-based tactical RPG that brings tabletop gaming to life in VR"},
    {"lang": "en", "key": "apps.descriptions.beat_saber", "value": "Rhythm game where you slash blocks with lightsabers to the beat of music"},
    {"lang": "en", "key": "apps.descriptions.half_life_alyx", "value": "Set between Half-Life and Half-Life 2, Alyx Vance and her father fight the Combine"},
    {"lang": "en", "key": "apps.descriptions.population_one", "value": "Battle royale reimagined for VR with unique vertical combat and building mechanics"},
    {"lang": "en", "key": "apps.descriptions.superhot_vr", "value": "Time moves only when you move in this stylish FPS"},
    {"lang": "en", "key": "apps.descriptions.job_simulator", "value": "Experience what ''jobs'' were like before robots took over in this tongue-in-cheek simulation"},
    
    {"lang": "fr", "key": "apps.descriptions.demeo", "value": "JDR tactique au tour par tour qui donne vie aux jeux de plateau en VR"},
    {"lang": "fr", "key": "apps.descriptions.beat_saber", "value": "Jeu de rythme où vous tranchez des blocs avec des sabres laser au rythme de la musique"},
    {"lang": "fr", "key": "apps.descriptions.half_life_alyx", "value": "Se déroulant entre Half-Life et Half-Life 2, Alyx Vance et son père combattent le Cartel"},
    {"lang": "fr", "key": "apps.descriptions.population_one", "value": "Battle royale réinventé pour la VR avec des mécaniques uniques de combat vertical et de construction"},
    {"lang": "fr", "key": "apps.descriptions.superhot_vr", "value": "Le temps ne bouge que lorsque vous bougez dans ce FPS stylisé"},
    {"lang": "fr", "key": "apps.descriptions.job_simulator", "value": "Découvrez comment étaient les ''emplois'' avant que les robots ne prennent le contrôle dans cette simulation humoristique"},
    
    {"lang": "es", "key": "apps.descriptions.demeo", "value": "RPG táctico por turnos que da vida a los juegos de mesa en VR"},
    {"lang": "es", "key": "apps.descriptions.beat_saber", "value": "Juego rítmico donde cortas bloques con sables de luz al ritmo de la música"},
    {"lang": "es", "key": "apps.descriptions.half_life_alyx", "value": "Ambientado entre Half-Life y Half-Life 2, Alyx Vance y su padre luchan contra el Combine"},
    {"lang": "es", "key": "apps.descriptions.population_one", "value": "Battle royale reinventado para VR con mecánicas únicas de combate vertical y construcción"},
    {"lang": "es", "key": "apps.descriptions.superhot_vr", "value": "El tiempo solo se mueve cuando tú te mueves en este elegante FPS"},
    {"lang": "es", "key": "apps.descriptions.job_simulator", "value": "Experimenta cómo eran los ''trabajos'' antes de que los robots tomaran el control en esta simulación humorística"},
    
    {"lang": "de", "key": "apps.descriptions.demeo", "value": "Rundenbasiertes taktisches RPG, das Brettspiele in VR zum Leben erweckt"},
    {"lang": "de", "key": "apps.descriptions.beat_saber", "value": "Rhythmusspiel, bei dem Sie Blöcke mit Lichtschwertern im Takt der Musik zerschneiden"},
    {"lang": "de", "key": "apps.descriptions.half_life_alyx", "value": "Zwischen Half-Life und Half-Life 2 angesiedelt, kämpfen Alyx Vance und ihr Vater gegen die Combine"},
    {"lang": "de", "key": "apps.descriptions.population_one", "value": "Battle Royale neu gedacht für VR mit einzigartiger vertikaler Kampf- und Baumechanik"},
    {"lang": "de", "key": "apps.descriptions.superhot_vr", "value": "Die Zeit bewegt sich nur, wenn Sie sich in diesem stylischen FPS bewegen"},
    {"lang": "de", "key": "apps.descriptions.job_simulator", "value": "Erleben Sie, wie ''Jobs'' waren, bevor Roboter die Kontrolle übernahmen, in dieser humorvollen Simulation"}
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      'apps_descriptions',
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;