import { useTranslation } from '../../contexts/TranslationContext';
import type { UserSettings } from '../../types/settings';

interface NotificationSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  const { t } = useTranslation();

  const updateNotifications = (key: keyof UserSettings['notifications'], value: boolean) => {
    onUpdate({
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  const notificationOptions = [
    { key: 'enabled', label: t('settings.notifications.enable', 'Activer les notifications') },
    { key: 'sound', label: t('settings.notifications.sound', 'Son des notifications') },
    { key: 'deviceAlerts', label: t('settings.notifications.device_alerts', 'Alertes de l\'appareil') },
    { key: 'updates', label: t('settings.notifications.updates', 'Mises à jour') }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          {t('settings.notifications.preferences', 'Notification Preferences')}
        </h3>
        <div className="mt-4 space-y-4">
          {notificationOptions.map(({ key, label }) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications[key as keyof UserSettings['notifications']]}
                onChange={(e) => updateNotifications(key as keyof UserSettings['notifications'], e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}