-- First ensure the landing category exists
INSERT INTO translation_categories (id, name, description)
VALUES ('landing', 'Landing Page', 'Translations for the landing page')
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE
  translations_data jsonb := '[
    {"lang": "en", "key": "landing.title", "value": "VR Device Manager"},
    {"lang": "en", "key": "landing.sign_in", "value": "Sign In"},
    {"lang": "en", "key": "landing.hero.title1", "value": "Manage Your VR Devices"},
    {"lang": "en", "key": "landing.hero.title2", "value": "With Confidence"},
    {"lang": "en", "key": "landing.hero.description", "value": "The complete solution for managing your VR device fleet. Monitor performance, deploy applications, and keep your devices up to date - all from one dashboard."},
    {"lang": "en", "key": "landing.hero.learn_more", "value": "Learn More"},
    {"lang": "en", "key": "landing.hero.get_started", "value": "Get Started"},
    {"lang": "en", "key": "landing.features.title", "value": "Why Choose Us"},
    {"lang": "en", "key": "landing.features.subtitle", "value": "Powerful features to help you manage your VR device fleet effectively"},
    {"lang": "en", "key": "landing.features.security.title", "value": "Enterprise Security"},
    {"lang": "en", "key": "landing.features.security.description", "value": "Enterprise-grade security with role-based access control and real-time monitoring."},
    {"lang": "en", "key": "landing.features.monitoring.title", "value": "Real-time Monitoring"},
    {"lang": "en", "key": "landing.features.monitoring.description", "value": "Monitor device status, battery levels, and storage usage in real-time."},
    {"lang": "en", "key": "landing.features.collaboration.title", "value": "Team Collaboration"},
    {"lang": "en", "key": "landing.features.collaboration.description", "value": "Seamless team collaboration with granular permissions and activity tracking."},
    {"lang": "en", "key": "landing.login.title", "value": "Sign In"},
    {"lang": "en", "key": "landing.login.subtitle", "value": "Access your device management dashboard"},
    {"lang": "en", "key": "landing.login.no_account", "value": "Don''t have an account?"},
    {"lang": "en", "key": "landing.login.contact_admin", "value": "Contact your administrator"},

    {"lang": "fr", "key": "landing.title", "value": "Gestionnaire VR"},
    {"lang": "fr", "key": "landing.sign_in", "value": "Se connecter"},
    {"lang": "fr", "key": "landing.hero.title1", "value": "Gérez vos appareils VR"},
    {"lang": "fr", "key": "landing.hero.title2", "value": "En toute confiance"},
    {"lang": "fr", "key": "landing.hero.description", "value": "La solution complète pour gérer votre flotte d''appareils VR. Surveillez les performances, déployez des applications et gardez vos appareils à jour - le tout depuis un seul tableau de bord."},
    {"lang": "fr", "key": "landing.hero.learn_more", "value": "En savoir plus"},
    {"lang": "fr", "key": "landing.hero.get_started", "value": "Commencer"},
    {"lang": "fr", "key": "landing.features.title", "value": "Pourquoi nous choisir"},
    {"lang": "fr", "key": "landing.features.subtitle", "value": "Des fonctionnalités puissantes pour vous aider à gérer efficacement votre flotte d''appareils VR"},
    {"lang": "fr", "key": "landing.features.security.title", "value": "Sécurité entreprise"},
    {"lang": "fr", "key": "landing.features.security.description", "value": "Sécurité de niveau entreprise avec contrôle d''accès basé sur les rôles et surveillance en temps réel."},
    {"lang": "fr", "key": "landing.features.monitoring.title", "value": "Surveillance en temps réel"},
    {"lang": "fr", "key": "landing.features.monitoring.description", "value": "Surveillez l''état des appareils, les niveaux de batterie et l''utilisation du stockage en temps réel."},
    {"lang": "fr", "key": "landing.features.collaboration.title", "value": "Collaboration d''équipe"},
    {"lang": "fr", "key": "landing.features.collaboration.description", "value": "Collaboration d''équipe transparente avec permissions granulaires et suivi des activités."},
    {"lang": "fr", "key": "landing.login.title", "value": "Connexion"},
    {"lang": "fr", "key": "landing.login.subtitle", "value": "Accédez à votre tableau de bord de gestion des appareils"},
    {"lang": "fr", "key": "landing.login.no_account", "value": "Vous n''avez pas de compte ?"},
    {"lang": "fr", "key": "landing.login.contact_admin", "value": "Contactez votre administrateur"}
  ]';
  translation jsonb;
BEGIN
  FOR translation IN SELECT * FROM jsonb_array_elements(translations_data)
  LOOP
    INSERT INTO translations (language_id, category_id, key, value)
    VALUES (
      (translation->>'lang'),
      'landing',
      (translation->>'key'),
      (translation->>'value')
    )
    ON CONFLICT (language_id, key) 
    DO UPDATE SET 
      value = EXCLUDED.value,
      updated_at = now();
  END LOOP;
END $$;