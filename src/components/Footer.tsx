import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Logo et Description */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <div className="flex items-center space-x-2">
              <img
                src="/images/horus2.svg"
                alt="Horus2"
                className="h-10 w-10 text-violet-400"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {t('footer.title', 'Gestionnaire XR')}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              {t('footer.description', 'Solutions professionnelles pour la gestion de vos appareils VR. Surveillance en temps réel, déploiement d\'applications.')}
            </p>
          </div>

          {/* Liens Rapides */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {t('footer.quickLinks', 'Liens Rapides')}
            </h3>
            <ul className="space-y-0">
              {['Documentation', 'Ressources', 'Support'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-xs text-gray-400 hover:text-violet-300 transition-colors"
                  >
                    {t(`footer.links.${item.toLowerCase()}`, item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {t('footer.contact', 'Contact')}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-1.5">
                <Mail className="h-3 w-3 text-gray-400" />
                <a
                  href="mailto:contact@xrocculus.com"
                  className="text-xs text-gray-400 hover:text-violet-300"
                >
                  contact@xrocculus.com
                </a>
              </li>
              <li className="flex items-center space-x-1.5">
                <Phone className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">Arles 13200, France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparation */}
        <div className="border-t border-gray-800 mt-4 pt-3 text-center flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-3">
          <p className="text-xs text-gray-500">
            {t('footer.copyright', 'Copyright')} {currentYear} {t('footer.company', 'Gestionnaire XR')}. {t('footer.all_rights_reserved', 'Tous droits réservés')}
          </p>
          <div className="flex items-center space-x-2">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300">
              {t('footer.privacy_policy', 'Politique de Confidentialité')}
            </a>
            <span className="text-xs text-gray-700">•</span>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300">
              {t('footer.terms', 'Conditions d\'utilisation')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}