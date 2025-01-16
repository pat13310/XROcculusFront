import { Monitor, Battery, HardDrive, Activity } from 'lucide-react';
import type { DeviceStats, Device } from '../types';
import { DashboardStats } from './DashboardStats';
import { DeviceCard } from './DeviceCard';

interface DashboardProps {
  stats: DeviceStats;
  devices: Device[];
  devicesLoading: boolean;
  onSelectDevice: (device: Device) => void;
}

export function Dashboard({ stats, devices, devicesLoading, onSelectDevice }: DashboardProps) {
  const avgBattery = stats.batteryLevels.reduce((a, b) => a + b, 0) / stats.batteryLevels.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <DashboardStats stats={stats} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow col-span-3">
        {devicesLoading ? (
          <div>Chargement des appareils...</div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Mes Appareils</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <DeviceCard 
                  key={device.id} 
                  device={device} 
                  onSelect={() => onSelectDevice(device)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}