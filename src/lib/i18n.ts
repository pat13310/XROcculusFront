import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Fallback translations
const resources = {
  fr: {
    translation: {
      // Traductions générales
      'app.name': 'Gestionnaire XR',
      
      // Traductions de l'assistant
      'assistant.title': 'Assistant XR',
      'assistant.subtitle': 'Votre guide personnalisé pour la gestion XR',
      'assistant.welcome': 'Bienvenue dans votre Assistant XR',
      'assistant.welcome_desc': 'Cet assistant va vous guider à travers les fonctionnalités principales de votre gestionnaire XR.',
      'assistant.device_management': 'Gestion des Appareils',
      'assistant.device_management_desc': 'Découvrez comment surveiller et gérer vos appareils XR.',
      'assistant.applications': 'Gestion des Applications',
      'assistant.applications_desc': 'Apprenez à déployer et gérer des applications sur vos appareils.',
      'assistant.complete': 'Configuration Terminée',
      'assistant.complete_desc': 'Félicitations ! Vous êtes maintenant prêt à utiliser votre gestionnaire XR.',
      'assistant.previous': 'Précédent',
      'assistant.next': 'Suivant',
      'assistant.finish': 'Terminer',

      // Autres traductions génériques
      'common.loading': 'Chargement...',
      'common.error': 'Une erreur est survenue',
    }
  },
  en: {
    translation: {
      'app.name': 'XR Manager',
      
      // Traductions de l'assistant en anglais
      'assistant.title': 'XR Assistant',
      'assistant.subtitle': 'Your personalized guide to XR management',
      // ... autres traductions similaires en anglais
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Langue par défaut
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React gère déjà l'échappement
    }
  });

export default i18n;