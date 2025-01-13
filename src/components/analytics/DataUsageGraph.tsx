import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { formatBytes } from '../../utils/formatters';
import { createLogger } from '../../utils/logger';
import type { DataUsage } from '../../types/analytics';

const logger = createLogger('DataUsageGraph');

interface DataUsageGraphProps {
  dataUsage: DataUsage[];
}

export function DataUsageGraph({ dataUsage }: DataUsageGraphProps) {
  const { t } = useTranslation();

  const totalUsage = dataUsage.reduce((acc, curr) => acc + curr.total_bytes, 0);
  
  logger.debug('Rendering data usage graph', { 
    appsCount: dataUsage.length,
    totalUsage: formatBytes(totalUsage)
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t('analytics.data_usage.title', 'Data Usage by Application')}
      </h3>
      <div className="space-y-4">
        {dataUsage.map((usage) => {
          const percentage = (usage.total_bytes / totalUsage) * 100;
          
          logger.debug('Rendering app usage', {
            appId: usage.app_id,
            appName: usage.app_name,
            usage: formatBytes(usage.total_bytes),
            percentage: percentage.toFixed(1)
          });

          return (
            <div key={usage.app_id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{usage.app_name}</span>
                <span>{formatBytes(usage.total_bytes)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}