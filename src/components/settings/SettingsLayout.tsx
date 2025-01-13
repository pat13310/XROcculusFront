import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import type { SettingsSection } from '../../types/settings';
import GradientHeader from '../GradientHeader';

interface SettingsLayoutProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  children: React.ReactNode;
}

export function SettingsLayout({ activeSection, onSectionChange, children }: SettingsLayoutProps) {
  const { t } = useTranslation();

  const sections: { id: SettingsSection; label: string }[] = [
    { id: 'appearance', label: t('settings.sections.appearance', 'Apparence') },
    { id: 'notifications', label: t('settings.sections.notifications', 'Notifications') },
    { id: 'language', label: t('settings.sections.language', 'Langues & Région') },
    { id: 'advanced', label: t('settings.sections.advanced', 'Avancé') }
  ];

  return (
      <div className="py-0">
      <GradientHeader
        titleKey="settings.title"
        defaultTitle="Configuration"
        Icon={SettingsIcon}
      />     
      <div className="flex bg-white border-gray-200">
          <nav className="p-4 space-y-1">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onSectionChange(id)}
                className={`
                  w-full px-4 py-2 text-md font-medium rounded-md text-left
                  ${activeSection === id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-violet-50'}
                `}
              >
                {label}
              </button>
            ))}
          </nav>
        
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}