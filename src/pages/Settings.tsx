import React, { useState } from 'react';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { LanguageSettings } from '../components/settings/LanguageSettings';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from '../contexts/TranslationContext';
import type { SettingsSection } from '../types/settings';

export function Settings() {
  const { settings, updateSettings } = useSettings();
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');
  const { t } = useTranslation();

  const renderSection = () => {
    switch (activeSection) {
      case 'appearance':
        return <AppearanceSettings settings={settings} onUpdate={updateSettings} />;
      case 'notifications':
        return <NotificationSettings settings={settings} onUpdate={updateSettings} />;
      case 'language':
        return <LanguageSettings settings={settings} onUpdate={updateSettings} />;
      case 'advanced':
        return (
          <div className="text-gray-600">
            {t('settings.advanced.coming_soon', 'Configuration avancée bientôt...')}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SettingsLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderSection()}
    </SettingsLayout>
  );
}