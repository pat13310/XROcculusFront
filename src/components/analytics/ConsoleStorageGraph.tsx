import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { formatBytes } from '../../utils/formatters';
import type { ConsoleStorage } from '../../types/analytics';

interface ConsoleStorageGraphProps {
  stats: ConsoleStorage[];
}

export function ConsoleStorageGraph({ stats }: ConsoleStorageGraphProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t('analytics.storage.title', 'Storage by Console')}
      </h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.model} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium">{stat.model}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({stat.device_count} {t('analytics.storage.devices', 'devices')})
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {formatBytes(stat.used_storage)} / {formatBytes(stat.total_storage)}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${(stat.used_storage / stat.total_storage) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}