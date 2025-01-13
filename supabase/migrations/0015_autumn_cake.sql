/*
  # Add users page translations

  1. New Category
    - Add 'users' category to translation_categories
  2. New Translations
    - Add translations for users page in all supported languages
    - Include translations for user management, stats, and table columns
*/

-- First ensure the users category exists
INSERT INTO translation_categories (id, name, description)
VALUES ('users', 'Users', 'Translations for the users management section')
ON CONFLICT (id) DO NOTHING;

-- Then insert the translations
DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "users.title", "value": "Users"},
    {"lang": "en", "key": "users.loading", "value": "Loading users..."},
    {"lang": "en", "key": "users.no_users", "value": "No users found"},
    {"lang": "en", "key": "users.add_user", "value": "Add User"},
    {"lang": "en", "key": "users.search_placeholder", "value": "Search users..."},
    {"lang": "en", "key": "users.stats.total", "value": "Total Users"},
    {"lang": "en", "key": "users.stats.active", "value": "Active Users"},
    {"lang": "en", "key": "users.stats.new", "value": "New This Month"},
    {"lang": "en", "key": "users.stats.session", "value": "Average Session"},
    {"lang": "en", "key": "users.columns.user", "value": "User"},
    {"lang": "en", "key": "users.columns.role", "value": "Role"},
    {"lang": "en", "key": "users.columns.status", "value": "Status"},
    {"lang": "en", "key": "users.columns.last_active", "value": "Last Active"},
    {"lang": "en", "key": "users.columns.actions", "value": "Actions"},
    
    {"lang": "fr", "key": "users.title", "value": "Utilisateurs"},
    {"lang": "fr", "key": "users.loading", "value": "Chargement des utilisateurs..."},
    {"lang": "fr", "key": "users.no_users", "value": "Aucun utilisateur trouvé"},
    {"lang": "fr", "key": "users.add_user", "value": "Ajouter un utilisateur"},
    {"lang": "fr", "key": "users.search_placeholder", "value": "Rechercher des utilisateurs..."},
    {"lang": "fr", "key": "users.stats.total", "value": "Total utilisateurs"},
    {"lang": "fr", "key": "users.stats.active", "value": "Utilisateurs actifs"},
    {"lang": "fr", "key": "users.stats.new", "value": "Nouveaux ce mois"},
    {"lang": "fr", "key": "users.stats.session", "value": "Session moyenne"},
    {"lang": "fr", "key": "users.columns.user", "value": "Utilisateur"},
    {"lang": "fr", "key": "users.columns.role", "value": "Rôle"},
    {"lang": "fr", "key": "users.columns.status", "value": "Statut"},
    {"lang": "fr", "key": "users.columns.last_active", "value": "Dernière activité"},
    {"lang": "fr", "key": "users.columns.actions", "value": "Actions"},
    
    {"lang": "es", "key": "users.title", "value": "Usuarios"},
    {"lang": "es", "key": "users.loading", "value": "Cargando usuarios..."},
    {"lang": "es", "key": "users.no_users", "value": "No se encontraron usuarios"},
    {"lang": "es", "key": "users.add_user", "value": "Agregar usuario"},
    {"lang": "es", "key": "users.search_placeholder", "value": "Buscar usuarios..."},
    {"lang": "es", "key": "users.stats.total", "value": "Total usuarios"},
    {"lang": "es", "key": "users.stats.active", "value": "Usuarios activos"},
    {"lang": "es", "key": "users.stats.new", "value": "Nuevos este mes"},
    {"lang": "es", "key": "users.stats.session", "value": "Sesión promedio"},
    {"lang": "es", "key": "users.columns.user", "value": "Usuario"},
    {"lang": "es", "key": "users.columns.role", "value": "Rol"},
    {"lang": "es", "key": "users.columns.status", "value": "Estado"},
    {"lang": "es", "key": "users.columns.last_active", "value": "Última actividad"},
    {"lang": "es", "key": "users.columns.actions", "value": "Acciones"},
    
    {"lang": "de", "key": "users.title", "value": "Benutzer"},
    {"lang": "de", "key": "users.loading", "value": "Lade Benutzer..."},
    {"lang": "de", "key": "users.no_users", "value": "Keine Benutzer gefunden"},
    {"lang": "de", "key": "users.add_user", "value": "Benutzer hinzufügen"},
    {"lang": "de", "key": "users.search_placeholder", "value": "Benutzer suchen..."},
    {"lang": "de", "key": "users.stats.total", "value": "Benutzer gesamt"},
    {"lang": "de", "key": "users.stats.active", "value": "Aktive Benutzer"},
    {"lang": "de", "key": "users.stats.new", "value": "Neu diesen Monat"},
    {"lang": "de", "key": "users.stats.session", "value": "Durchschnittliche Sitzung"},
    {"lang": "de", "key": "users.columns.user", "value": "Benutzer"},
    {"lang": "de", "key": "users.columns.role", "value": "Rolle"},
    {"lang": "de", "key": "users.columns.status", "value": "Status"},
    {"lang": "de", "key": "users.columns.last_active", "value": "Letzte Aktivität"},
    {"lang": "de", "key": "users.columns.actions", "value": "Aktionen"}
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      'users',
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;