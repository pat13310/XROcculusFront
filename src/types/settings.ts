export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  notifications: {
    enabled: boolean;
    sound: boolean;
    deviceAlerts: boolean;
    updates: boolean;
  };
  language: string;
  timezone: string;
}

export type SettingsSection = 'appearance' | 'notifications' | 'language' | 'advanced';