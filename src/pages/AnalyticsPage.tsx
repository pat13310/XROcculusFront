import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { NetworkGraph } from '../components/analytics/NetworkGraph';
import { DataUsageGraph } from '../components/analytics/DataUsageGraph';
import { BatteryGraph } from '../components/analytics/BatteryGraph';
import { AppStatsGraph } from '../components/analytics/AppStatsGraph';
import { ConsoleStorageGraph } from '../components/analytics/ConsoleStorageGraph';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import { useTranslation } from '../contexts/TranslationContext';

export function AnalyticsPage() {
  const { networkMetrics, dataUsage, batteryStats, appStats, consoleStorage, loading, error } = useAnalytics();
  const { t } = useTranslation();

  if (loading) {
    return <LoadingScreen message={t('analytics.loading', 'Loading analytics...')} />;
  }

  if (error) {
    return <ErrorScreen message={t('analytics.error', 'Failed to load analytics data')} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t('analytics.title', 'Analytics')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetworkGraph metrics={networkMetrics} />
        <DataUsageGraph dataUsage={dataUsage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppStatsGraph stats={appStats} />
        <ConsoleStorageGraph stats={consoleStorage} />
      </div>

      <BatteryGraph batteryStats={batteryStats} />
    </div>
  );
}