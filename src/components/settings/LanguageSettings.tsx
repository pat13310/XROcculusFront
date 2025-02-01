import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import type { UserSettings } from '../../types/settings';

interface LanguageSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export function LanguageSettings({ settings, onUpdate }: LanguageSettingsProps) {
  const { t, setLanguage } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' }
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    onUpdate({ language: newLang });
    setLanguage(newLang);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium text-gray-700">
          {t('settings.language.title', 'Langages')}
        </h3>
        <select
          value={settings.language}
          onChange={handleLanguageChange}
          className="mt-4 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
        >
          {languages.map(({ code, name, nativeName }) => (
            <option key={code} value={code}>
              {name} ({nativeName})
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-gray-500">
          {t('settings.language.description', 'Choisissez votre langue préférée pour l\'interface')}
        </p>
      </div>

      <div>
        <h3 className="text-md font-medium text-gray-700">
          {t('settings.timezone.title', 'Time Zone')}
        </h3>
        <select
          value={settings.timezone}
          onChange={(e) => onUpdate({ timezone: e.target.value })}
          className="text-gray-600 mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
        >
          {[
            'UTC', 
            'Europe/Paris', 
            'America/New_York', 
            'Asia/Tokyo', 
            'Australia/Sydney'
          ].map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-gray-500">
          {t('settings.timezone.description', 'Choisissez votre fuseau horaire préféré')}
        </p>
      </div>
    </div>
  );
}