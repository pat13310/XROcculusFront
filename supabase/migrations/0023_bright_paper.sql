/*
  # Add translations for authentication, navbar and footer
  
  1. New Categories
    - Authentication translations
    - Navbar translations
    - Footer translations
  
  2. New Translations
    - Login form labels and messages
    - Navigation elements
    - Footer text and links
*/

-- First ensure all required categories exist
INSERT INTO translation_categories (id, name, description)
VALUES 
  ('auth', 'Authentication', 'Authentication-related translations'),
  ('navbar', 'Navigation Bar', 'Navigation bar translations'),
  ('footer', 'Footer', 'Footer translations')
ON CONFLICT (id) DO NOTHING;

-- Then insert the translations
DO $$
DECLARE
  translations_data jsonb := '[
    {
      "lang": "en",
      "key": "auth.email",
      "value": "Email"
    },
    {
      "lang": "en",
      "key": "auth.password",
      "value": "Password"
    },
    {
      "lang": "en",
      "key": "auth.email_placeholder",
      "value": "Enter your email"
    },
    {
      "lang": "en",
      "key": "auth.password_placeholder",
      "value": "Enter your password"
    },
    {
      "lang": "en",
      "key": "auth.sign_in",
      "value": "Sign in"
    },
    {
      "lang": "en",
      "key": "auth.signing_in",
      "value": "Signing in..."
    },
    {
      "lang": "en",
      "key": "auth.invalid_credentials",
      "value": "Invalid email or password"
    },
    {
      "lang": "fr",
      "key": "auth.email",
      "value": "Email"
    },
    {
      "lang": "fr",
      "key": "auth.password",
      "value": "Mot de passe"
    },
    {
      "lang": "fr",
      "key": "auth.email_placeholder",
      "value": "Entrez votre email"
    },
    {
      "lang": "fr",
      "key": "auth.password_placeholder",
      "value": "Entrez votre mot de passe"
    },
    {
      "lang": "fr",
      "key": "auth.sign_in",
      "value": "Se connecter"
    },
    {
      "lang": "fr",
      "key": "auth.signing_in",
      "value": "Connexion en cours..."
    },
    {
      "lang": "fr",
      "key": "auth.invalid_credentials",
      "value": "Email ou mot de passe invalide"
    },
    {
      "lang": "en",
      "key": "navbar.title",
      "value": "VR Device Manager"
    },
    {
      "lang": "en",
      "key": "navbar.toggle_sidebar",
      "value": "Toggle sidebar"
    },
    {
      "lang": "en",
      "key": "navbar.notifications",
      "value": "Notifications"
    },
    {
      "lang": "en",
      "key": "navbar.settings",
      "value": "Settings"
    },
    {
      "lang": "en",
      "key": "navbar.sign_out",
      "value": "Sign Out"
    },
    {
      "lang": "fr",
      "key": "navbar.title",
      "value": "Gestionnaire VR"
    },
    {
      "lang": "fr",
      "key": "navbar.toggle_sidebar",
      "value": "Basculer la barre latérale"
    },
    {
      "lang": "fr",
      "key": "navbar.notifications",
      "value": "Notifications"
    },
    {
      "lang": "fr",
      "key": "navbar.settings",
      "value": "Paramètres"
    },
    {
      "lang": "fr",
      "key": "navbar.sign_out",
      "value": "Se déconnecter"
    },
    {
      "lang": "en",
      "key": "footer.copyright",
      "value": "© {year} VR Device Manager. All rights reserved."
    },
    {
      "lang": "en",
      "key": "footer.privacy_policy",
      "value": "Privacy Policy"
    },
    {
      "lang": "en",
      "key": "footer.terms",
      "value": "Terms of Service"
    },
    {
      "lang": "en",
      "key": "footer.contact",
      "value": "Contact"
    },
    {
      "lang": "fr",
      "key": "footer.copyright",
      "value": "© {year} Gestionnaire VR. Tous droits réservés."
    },
    {
      "lang": "fr",
      "key": "footer.privacy_policy",
      "value": "Politique de confidentialité"
    },
    {
      "lang": "fr",
      "key": "footer.terms",
      "value": "Conditions d''utilisation"
    },
    {
      "lang": "fr",
      "key": "footer.contact",
      "value": "Contact"
    }
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      CASE 
        WHEN (translation->>'key') LIKE 'auth.%' THEN 'auth'
        WHEN (translation->>'key') LIKE 'navbar.%' THEN 'navbar'
        WHEN (translation->>'key') LIKE 'footer.%' THEN 'footer'
      END,
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;