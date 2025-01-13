import React from 'react';
import { Users, HardDrive } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { formatBytes } from '../../utils/formatters';
import type { AppStats } from '../../types/analytics';

interface AppStatsGraphProps {
  stats: AppStats[];
}

export function AppStatsGraph({ stats }: AppStatsGraphProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t('analytics.apps.title', 'Application Usage')}
      </h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.app_name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{stat.app_name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-violet-500" />
                <span className="text-sm text-gray-600">
                  {stat.user_count} {t('analytics.apps.users', 'users')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-fuchsia-500" />
                <span className="text-sm text-gray-600">
                  {formatBytes(stat.total_bytes)}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                style={{ width: `${(stat.user_count / Math.max(...stats.map(s => s.user_count))) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}