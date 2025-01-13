import React from 'react';
import { Battery, Signal, Power } from 'lucide-react';
import type { Device } from '../../types';

interface DeviceHeaderProps {
  device: Device;
}

export function DeviceHeader({ device }: DeviceHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{device.name}</h1>
          <p className="text-gray-500">{device.model}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Battery className={`w-5 h-5 ${
              device.batteryLevel > 20 ? 'text-green-500' : 'text-red-500'
            }`} />
            <span className="ml-1 text-sm">{device.batteryLevel}%</span>
          </div>
          <div className="flex items-center">
            <Signal className={`w-5 h-5 ${
              device.status === 'online' ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="ml-1 text-sm capitalize">{device.status}</span>
          </div>
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md flex items-center hover:bg-blue-100">
            <Power className="w-4 h-4 mr-2" />
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}