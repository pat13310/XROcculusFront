import { useState, useEffect } from 'react';
import type { UserSettings } from '../types/settings';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  sidebarCollapsed: false,
  notifications: {
    enabled: true,
    sound: true,
    deviceAlerts: true,
    updates: true
  },
  language: 'fr', // Changed from 'en' to 'fr'
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(current => ({ ...current, ...newSettings }));
  };

  return { settings, updateSettings };
}