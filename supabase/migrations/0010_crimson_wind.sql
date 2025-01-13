/*
  # Add Settings Translations

  1. New Translations
    - Add translations for settings pages
    - Include all supported languages
*/

INSERT INTO translations (language_id, category_id, key, value)
VALUES
  -- English
  ('en', 'settings', 'title', 'Settings'),
  ('en', 'settings', 'appearance', 'Appearance'),
  ('en', 'settings', 'notifications', 'Notifications'),
  ('en', 'settings', 'language_region', 'Language & Region'),
  ('en', 'settings', 'advanced', 'Advanced'),
  ('en', 'settings', 'language', 'Language'),
  ('en', 'settings', 'language_description', 'Choose your preferred language for the interface'),
  ('en', 'settings', 'timezone', 'Time Zone'),
  
  -- French
  ('fr', 'settings', 'title', 'Paramètres'),
  ('fr', 'settings', 'appearance', 'Apparence'),
  ('fr', 'settings', 'notifications', 'Notifications'),
  ('fr', 'settings', 'language_region', 'Langue et région'),
  ('fr', 'settings', 'advanced', 'Avancé'),
  ('fr', 'settings', 'language', 'Langue'),
  ('fr', 'settings', 'language_description', 'Choisissez votre langue préférée pour l''interface'),
  ('fr', 'settings', 'timezone', 'Fuseau horaire'),
  
  -- Spanish
  ('es', 'settings', 'title', 'Ajustes'),
  ('es', 'settings', 'appearance', 'Apariencia'),
  ('es', 'settings', 'notifications', 'Notificaciones'),
  ('es', 'settings', 'language_region', 'Idioma y región'),
  ('es', 'settings', 'advanced', 'Avanzado'),
  ('es', 'settings', 'language', 'Idioma'),
  ('es', 'settings', 'language_description', 'Elige tu idioma preferido para la interfaz'),
  ('es', 'settings', 'timezone', 'Zona horaria'),
  
  -- German
  ('de', 'settings', 'title', 'Einstellungen'),
  ('de', 'settings', 'appearance', 'Aussehen'),
  ('de', 'settings', 'notifications', 'Benachrichtigungen'),
  ('de', 'settings', 'language_region', 'Sprache & Region'),
  ('de', 'settings', 'advanced', 'Erweitert'),
  ('de', 'settings', 'language', 'Sprache'),
  ('de', 'settings', 'language_description', 'Wählen Sie Ihre bevorzugte Sprache für die Benutzeroberfläche'),
  ('de', 'settings', 'timezone', 'Zeitzone');