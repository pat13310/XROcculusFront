import React from 'react';
import { FileText } from 'react-feather'; // Exemple avec react-feather (vous pouvez changer d'icône ici)
import { useTranslation } from 'react-i18next'; // Pour la traduction si nécessaire

interface HeaderProps {
  titleKey?: string; // Clé de traduction
  defaultTitle?: string; // Titre par défaut
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>; // Icône personnalisable (par défaut FileText)
  rightContent?: React.ReactNode; // Contenu à droite du header
}

const GradientHeader: React.FC<HeaderProps> = ({
  titleKey = 'reports.title',
  defaultTitle = 'Rapports',
  Icon = FileText, // Icône par défaut
  rightContent,
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative pb-1 mb-4">
      {/* Titre et Icône */}
      <div className="flex items-center justify-between mb-3">
        {/* Conteneur gauche avec icône et titre */}
        <div className="flex items-center space-x-4">
          {/* Conteneur de l'icône */}
          <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl shadow-lg">
            <Icon className="w-6 h-6 text-white" /> {/* Icône dynamique */}
          </div>
          {/* Texte avec dégradé */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {t(titleKey, defaultTitle)}
          </h1>
        </div>
        {/* Conteneur droit */}
        {rightContent && (
          <div className="flex items-center">{rightContent}</div>
        )}
      </div>
      {/* Ligne de dégradé */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 rounded-full shadow-sm" />
      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 blur-sm" />
    </div>
  );
};

export default GradientHeader;
