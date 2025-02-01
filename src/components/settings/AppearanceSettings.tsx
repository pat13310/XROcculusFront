import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import type { UserSettings } from '../../types/settings';

interface AppearanceSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export function AppearanceSettings({ settings, onUpdate }: AppearanceSettingsProps) {
  const { t } = useTranslation();

  const themes = [
    { value: 'light', label: t('settings.themes.light', 'Clair') },
    { value: 'dark', label: t('settings.themes.dark', 'Sombre') },
    { value: 'system', label: t('settings.themes.system', 'Système') }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium text-gray-900">
          {t('settings.appearance.theme', 'Thèmes')}
        </h3>
        <div className="mt-4 space-y-4">
          {themes.map(({ value, label }) => (
            <label key={value} className="text-md flex items-center">
              <input
                type="radio"
                name="theme"
                value={value}
                checked={settings.theme === value}
                onChange={(e) => onUpdate({ theme: e.target.value as UserSettings['theme'] })}
                className="h-4 w-4 text-violet-600 border-gray-300 focus:ring-violet-500"
              />
              <span className="ml-3 text-sm text-gray-500">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium text-gray-900">
          {t('settings.appearance.sidebar', 'Barre latérale')}
        </h3>
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.sidebarCollapsed}
              onChange={(e) => onUpdate({ sidebarCollapsed: e.target.checked })}
              className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
            />
            <span className="ml-3 text-sm text-gray-500">
              {t('settings.appearance.collapse_sidebar', 'Barre latérale visible par défaut')}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}