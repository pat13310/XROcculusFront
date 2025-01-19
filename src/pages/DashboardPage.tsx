import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Monitor, Battery, HardDrive, Activity, Gauge } from 'lucide-react';
import { DeviceList } from '../components/DeviceList';
import { StatCard } from '../components/dashboard/StatCard';
import { GradientProgressBar } from '../components/dashboard/GradientProgressBar';
import { LoadingScreen } from '../components/LoadingScreen';
import { formatBytes } from '../utils/formatters';
import type { Device, DeviceStats } from '../types';
import GradientHeader from '../components/GradientHeader';

interface DashboardPageContextProps {
  stats: DeviceStats;
  devices: Device[];
  devicesLoading: boolean;
  onSelectDevice: (id: string) => void;
  onUninstallDevice?: (id: string) => void;
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { 
    stats, 
    devices, 
    devicesLoading, 
    onSelectDevice, 
    onUninstallDevice 
  } = useOutletContext<DashboardPageContextProps>();

  // Calcul des statistiques en toute sécurité
  const avgBattery = stats.batteryLevels.length > 0
    ? Math.round(stats.batteryLevels.reduce((a, b) => a + b, 0) / stats.batteryLevels.length)
    : 0;

  const totalStorage = devices.reduce((acc, device) => acc + device.storageTotal, 0);
  const usedStorage = devices.reduce((acc, device) => acc + device.storageUsed, 0);

  return (
    <div className="space-y-8">
      <GradientHeader
        titleKey="dashboard.title"
        defaultTitle="Tableau de bord"
        Icon={Gauge} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Monitor}
          label={t('dashboard.total_devices', 'Appareils totaux')}
          value={stats.totalDevices.toString()}
          color="blue" />
        <StatCard
          icon={Activity}
          label={t('dashboard.active_devices', 'Appareils actifs')}
          value={stats.activeDevices.toString()}
          color="green"
          trend={{
            value: Math.round((stats.activeDevices / stats.totalDevices) * 100),
            isPositive: true
          }} />
        <StatCard
          icon={Battery}
          label={t('dashboard.avg_battery', 'Niveau de batterie moyen')}
          value={`${avgBattery}%`}
          color="yellow" />
        <StatCard
          icon={HardDrive}
          label={t('dashboard.storage_used', 'Stockage utilisé')}
          value={formatBytes(stats.storageUsed)}
          color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {t('dashboard.system_status', 'État du système')}
        </h2>
        <div className="space-y-4">
          <div>
            <GradientProgressBar
              value={stats.activeDevices}
              max={stats.totalDevices}
              size="lg"
              label={t('dashboard.device_activity', 'Activité des appareils')}
              type="percentage" />
          </div>
          <div>
            <GradientProgressBar
              value={usedStorage}
              max={totalStorage}
              size="lg"
              label={t('dashboard.storage_usage', 'Utilisation du stockage')}
              type="storage" />
          </div>
          <div>
            <GradientProgressBar
              value={avgBattery}
              max={100}
              size="lg"
              label={t('dashboard.battery_status', 'État de la batterie')}
              type="percentage" />
          </div>
        </div>
      </div>

      {devicesLoading ? (
        <LoadingScreen message={t('dashboard.loading', 'Chargement des appareils...')} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('devices.title', 'Appareils')}
          </h2>
          <DeviceList
            devices={devices}
            onSelectDevice={onSelectDevice}
            onUninstallDevice={onUninstallDevice}
          />
        </div>
      )}
    </div>
  );
}