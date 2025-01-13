/*
  # Add translations for application descriptions

  1. New Translations
    - Add translations for app descriptions in all supported languages
    - Include translations for each game's description
*/

-- First ensure the apps category exists
INSERT INTO translation_categories (id, name, description)
VALUES ('apps_descriptions', 'App Descriptions', 'Translations for application descriptions')
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "apps.descriptions.beat_saber", "value": "Rhythm game where you slash blocks with lightsabers to the beat of music"},
    {"lang": "en", "key": "apps.descriptions.half_life_alyx", "value": "Set between Half-Life and Half-Life 2, Alyx Vance and her father fight the Combine"},
    {"lang": "en", "key": "apps.descriptions.population_one", "value": "Battle royale reimagined for VR with unique vertical combat and building mechanics"},
    {"lang": "en", "key": "apps.descriptions.superhot", "value": "Time moves only when you move in this stylish FPS"},
    {"lang": "en", "key": "apps.descriptions.job_simulator", "value": "Experience what ''jobs'' were like before robots took over in this tongue-in-cheek simulation"},
    {"lang": "en", "key": "apps.descriptions.walkabout", "value": "Realistic mini golf simulation with beautiful courses and multiplayer support"},
    {"lang": "en", "key": "apps.descriptions.pistol_whip", "value": "Rhythm-shooter that combines music and action in a stylish world"},
    {"lang": "en", "key": "apps.descriptions.eleven", "value": "Ultra-realistic table tennis simulation with physics-based gameplay"},
    {"lang": "en", "key": "apps.descriptions.demeo", "value": "Turn-based tactical RPG that brings tabletop gaming to life in VR"},

    {"lang": "fr", "key": "apps.descriptions.beat_saber", "value": "Jeu de rythme où vous tranchez des blocs avec des sabres laser au rythme de la musique"},
    {"lang": "fr", "key": "apps.descriptions.half_life_alyx", "value": "Se déroulant entre Half-Life et Half-Life 2, Alyx Vance et son père combattent le Cartel"},
    {"lang": "fr", "key": "apps.descriptions.population_one", "value": "Battle royale réinventé pour la VR avec des mécaniques uniques de combat vertical et de construction"},
    {"lang": "fr", "key": "apps.descriptions.superhot", "value": "Le temps ne bouge que lorsque vous bougez dans ce FPS stylisé"},
    {"lang": "fr", "key": "apps.descriptions.job_simulator", "value": "Découvrez comment étaient les ''emplois'' avant que les robots ne prennent le contrôle dans cette simulation humoristique"},
    {"lang": "fr", "key": "apps.descriptions.walkabout", "value": "Simulation réaliste de mini-golf avec de magnifiques parcours et support multijoueur"},
    {"lang": "fr", "key": "apps.descriptions.pistol_whip", "value": "Jeu de tir rythmique qui combine musique et action dans un monde stylisé"},
    {"lang": "fr", "key": "apps.descriptions.eleven", "value": "Simulation ultra-réaliste de tennis de table avec un gameplay basé sur la physique"},
    {"lang": "fr", "key": "apps.descriptions.demeo", "value": "RPG tactique au tour par tour qui donne vie aux jeux de plateau en VR"},

    {"lang": "es", "key": "apps.descriptions.beat_saber", "value": "Juego rítmico donde cortas bloques con sables de luz al ritmo de la música"},
    {"lang": "es", "key": "apps.descriptions.half_life_alyx", "value": "Ambientado entre Half-Life y Half-Life 2, Alyx Vance y su padre luchan contra el Combine"},
    {"lang": "es", "key": "apps.descriptions.population_one", "value": "Battle royale reinventado para VR con mecánicas únicas de combate vertical y construcción"},
    {"lang": "es", "key": "apps.descriptions.superhot", "value": "El tiempo solo se mueve cuando tú te mueves en este elegante FPS"},
    {"lang": "es", "key": "apps.descriptions.job_simulator", "value": "Experimenta cómo eran los ''trabajos'' antes de que los robots tomaran el control en esta simulación humorística"},
    {"lang": "es", "key": "apps.descriptions.walkabout", "value": "Simulación realista de mini golf con hermosos campos y soporte multijugador"},
    {"lang": "es", "key": "apps.descriptions.pistol_whip", "value": "Shooter rítmico que combina música y acción en un mundo estilizado"},
    {"lang": "es", "key": "apps.descriptions.eleven", "value": "Simulación ultra realista de tenis de mesa con jugabilidad basada en física"},
    {"lang": "es", "key": "apps.descriptions.demeo", "value": "RPG táctico por turnos que da vida a los juegos de mesa en VR"},

    {"lang": "de", "key": "apps.descriptions.beat_saber", "value": "Rhythmusspiel, bei dem Sie Blöcke mit Lichtschwertern im Takt der Musik zerschneiden"},
    {"lang": "de", "key": "apps.descriptions.half_life_alyx", "value": "Zwischen Half-Life und Half-Life 2 angesiedelt, kämpfen Alyx Vance und ihr Vater gegen die Combine"},
    {"lang": "de", "key": "apps.descriptions.population_one", "value": "Battle Royale neu gedacht für VR mit einzigartiger vertikaler Kampf- und Baumechanik"},
    {"lang": "de", "key": "apps.descriptions.superhot", "value": "Die Zeit bewegt sich nur, wenn Sie sich in diesem stylischen FPS bewegen"},
    {"lang": "de", "key": "apps.descriptions.job_simulator", "value": "Erleben Sie, wie ''Jobs'' waren, bevor Roboter die Kontrolle übernahmen, in dieser humorvollen Simulation"},
    {"lang": "de", "key": "apps.descriptions.walkabout", "value": "Realistische Minigolf-Simulation mit wunderschönen Plätzen und Mehrspieler-Unterstützung"},
    {"lang": "de", "key": "apps.descriptions.pistol_whip", "value": "Rhythmus-Shooter, der Musik und Action in einer stylischen Welt verbindet"},
    {"lang": "de", "key": "apps.descriptions.eleven", "value": "Ultra-realistische Tischtennis-Simulation mit physikbasiertem Gameplay"},
    {"lang": "de", "key": "apps.descriptions.demeo", "value": "Rundenbasiertes taktisches RPG, das Brettspiele in VR zum Leben erweckt"}
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