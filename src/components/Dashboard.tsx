import React from 'react';
import { Monitor, Battery, HardDrive, Activity } from 'lucide-react';
import type { DeviceStats } from '../types';

interface DashboardProps {
  stats: DeviceStats;
}

export function Dashboard({ stats }: DashboardProps) {
  const avgBattery = stats.batteryLevels.reduce((a, b) => a + b, 0) / stats.batteryLevels.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Monitor className="w-8 h-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-gray-600">Total Devices</p>
            <h3 className="text-2xl font-bold">{stats.totalDevices}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Activity className="w-8 h-8 text-green-500" />
          <div className="ml-4">
            <p className="text-gray-600">Active Devices</p>
            <h3 className="text-2xl font-bold">{stats.activeDevices}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Battery className="w-8 h-8 text-yellow-500" />
          <div className="ml-4">
            <p className="text-gray-600">Avg Battery Level</p>
            <h3 className="text-2xl font-bold">{Math.round(avgBattery)}%</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <HardDrive className="w-8 h-8 text-purple-500" />
          <div className="ml-4">
            <p className="text-gray-600">Total Storage Used</p>
            <h3 className="text-2xl font-bold">{Math.round(stats.storageUsed / 1024)} GB</h3>
          </div>
        </div>
      </div>
    </div>
  );
}