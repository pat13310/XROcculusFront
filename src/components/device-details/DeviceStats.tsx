import React from 'react';
import { HardDrive, Clock, Activity } from 'lucide-react';
import type { Device } from '../../types';

interface DeviceStatsProps {
  device: Device;
}

export function DeviceStats({ device }: DeviceStatsProps) {
  const storagePercentage = (device.storageUsed / device.storageTotal) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Device Status</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 flex items-center">
              <HardDrive className="w-4 h-4 mr-2" /> Storage
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(device.storageUsed / 1024)} / {Math.round(device.storageTotal / 1024)} GB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-t">
          <span className="text-sm text-gray-600 flex items-center">
            <Clock className="w-4 h-4 mr-2" /> Last Sync
          </span>
          <span className="text-sm">{new Date(device.lastSync).toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-t">
          <span className="text-sm text-gray-600 flex items-center">
            <Activity className="w-4 h-4 mr-2" /> System Version
          </span>
          <span className="text-sm">v2.5.0</span>
        </div>
      </div>
    </div>
  );
}