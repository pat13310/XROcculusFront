import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { Battery } from 'lucide-react';
import { createLogger } from '../../utils/logger';
import type { BatteryStats } from '../../types/analytics';

const logger = createLogger('BatteryGraph');

interface BatteryGraphProps {
  batteryStats: BatteryStats[];
}

export function BatteryGraph({ batteryStats }: BatteryGraphProps) {
  const { t } = useTranslation();

  logger.debug('Rendering battery graph', { devicesCount: batteryStats.length });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t('analytics.battery.title', 'Battery Levels')}
      </h3>
      <div className="space-y-4">
        {batteryStats.map((stat) => {
          logger.debug('Rendering device battery stats', {
            deviceId: stat.device_id,
            deviceName: stat.device_name,
            avgLevel: stat.avg_level,
            minLevel: stat.min_level,
            maxLevel: stat.max_level
          });

          return (
            <div key={stat.device_id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{stat.device_name}</span>
                <div className="flex items-center space-x-2">
                  <Battery className={`w-5 h-5 ${
                    stat.avg_level > 20 ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className="text-sm font-medium">{Math.round(stat.avg_level)}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    stat.avg_level > 20 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stat.avg_level}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">{t('analytics.battery.min', 'Min')}:</span>
                  <span className="ml-2">{stat.min_level}%</span>
                </div>
                <div>
                  <span className="font-medium">{t('analytics.battery.max', 'Max')}:</span>
                  <span className="ml-2">{stat.max_level}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}