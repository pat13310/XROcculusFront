import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Fallback translations
const resources = {
  fr: {
    translation: {
      // Traductions générales
      'app.name': 'Gestionnaire XR',
      
      
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