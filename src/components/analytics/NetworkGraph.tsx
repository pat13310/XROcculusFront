import React from 'react';
import { Wifi, Activity } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import type { NetworkMetric } from '../../types/analytics';

interface NetworkGraphProps {
  metrics: NetworkMetric[];
}

export function NetworkGraph({ metrics }: NetworkGraphProps) {
  const { t } = useTranslation();

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {t('analytics.network.title', 'Network Performance')}
      </h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className={`p-1 rounded-full ${
                  metric.signal_strength > 70 ? 'bg-green-100 text-green-600' :
                  metric.signal_strength > 30 ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {getConnectionIcon(metric.connection_type)}
                </div>
                <span className="text-sm font-medium">{metric.connection_type.toUpperCase()}</span>
              </div>
              <span className="text-sm text-gray-600">{metric.signal_strength}%</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <div className="font-medium">{t('analytics.network.latency', 'Latency')}</div>
                <div>{metric.latency}ms</div>
              </div>
              <div>
                <div className="font-medium">{t('analytics.network.download', 'Download')}</div>
                <div>{metric.download_speed.toFixed(1)} Mbps</div>
              </div>
              <div>
                <div className="font-medium">{t('analytics.network.upload', 'Upload')}</div>
                <div>{metric.upload_speed.toFixed(1)} Mbps</div>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                style={{ width: `${metric.signal_strength}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}