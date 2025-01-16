import React from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'gradient' | 'ghost';

interface ButtonProps {
  // Types d'actions
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  
  // Gestion des actions
  onClick?: () => void;
  to?: string;
  
  // Contenu et traduction
  children?: React.ReactNode;
  translationKey?: string;
  translationDefault?: string;
  
  // Style et apparence
  className?: string;
  icon?: IconType | React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  
  // États du bouton
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  gradient: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 ',
  ghost: 'bg-transparent text-gray-700 hover:text-gray-900 border-0',
};

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'gradient',
  onClick,
  to,
  children,
  translationKey,
  translationDefault,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
}) => {
  const { t } = useTranslation();
  
  // Préparation du contenu du bouton
  const buttonContent = (
    <div className="flex items-center space-x-2 justify-center">
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 mr-2" />}
      {(translationKey ? t(translationKey, translationDefault || '') : children)}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 ml-2" />}
    </div>
  );

  // Styles de base du bouton
  const baseStyles = `
    px-4 py-2 
    text-sm 
    font-medium 
    rounded-lg 
    transition-all 
    duration-200 
    shadow-sm 
    hover:shadow 
    flex 
    items-center 
    space-x-2
    disabled:opacity-50 
    disabled:cursor-not-allowed
  `;

  // Combinaison des styles
  const combinedClassName = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${className}
  `.trim();

  // Si un lien est spécifié, utiliser Link
  if (to) {
    return (
      <Link 
        to={to} 
        className={combinedClassName}
        onClick={onClick}
      >
        {buttonContent}
      </Link>
    );
  }

  // Sinon, utiliser un bouton standard
  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
};

export default Button;
