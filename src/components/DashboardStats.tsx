import { Monitor, Battery, HardDrive, Activity } from 'lucide-react';
import type { DeviceStats } from '../types';

interface DashboardStatsProps {
  stats: DeviceStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const avgBattery = stats.batteryLevels.reduce((a, b) => a + b, 0) / stats.batteryLevels.length;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Statistiques du Tableau de Bord</h2>
      <div className="flex items-center space-x-4">
        <Monitor className="text-blue-500" />
        <div>
          <p className="text-gray-600">Nombre Total d'Appareils</p>
          <p className="text-2xl font-bold">{stats.totalDevices}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Battery className="text-green-500" />
        <div>
          <p className="text-gray-600">Batterie Moyenne</p>
          <p className="text-2xl font-bold">{avgBattery.toFixed(1)}%</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <HardDrive className="text-purple-500" />
        <div>
          <p className="text-gray-600">Espace de Stockage</p>
          <p className="text-2xl font-bold">{stats.storageUsed} / {stats.storageTotal} Go</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Activity className="text-red-500" />
        <div>
          <p className="text-gray-600">Appareils Actifs</p>
          <p className="text-2xl font-bold">{stats.activeDevices}</p>
        </div>
      </div>
    </div>
  );
}
