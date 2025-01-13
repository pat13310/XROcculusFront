import React from 'react';
import { Monitor, Battery, HardDrive, Activity } from 'lucide-react';
import { StatCard } from './StatCard';
import { useTranslation } from '../../contexts/TranslationContext';
import type { DeviceStats } from '../../types';

interface DashboardStatsProps {
  stats: DeviceStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useTranslation();
  
  // Calculate average battery level safely
  const avgBattery = stats.batteryLevels.length > 0
    ? stats.batteryLevels.reduce((a, b) => a + b, 0) / stats.batteryLevels.length
    : 0;

  // Format storage value safely
  const storageGB = stats.storageUsed ? Math.round(stats.storageUsed / 1024) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={Monitor}
        label={t('dashboard.total_devices', 'Total Devices')}
        value={stats.totalDevices?.toString() || '0'}
        color="blue"
      />
      <StatCard
        icon={Activity}
        label={t('dashboard.active_devices', 'Active Devices')}
        value={stats.activeDevices?.toString() || '0'}
        color="green"
      />
      <StatCard
        icon={Battery}
        label={t('dashboard.avg_battery', 'Average Battery Level')}
        value={Number.isFinite(avgBattery) ? `${Math.round(avgBattery)}%` : '0%'}
        color="yellow"
      />
      <StatCard
        icon={HardDrive}
        label={t('dashboard.storage_used', 'Total Storage Used')}
        value={`${storageGB} GB`}
        color="purple"
      />
    </div>
  );
}